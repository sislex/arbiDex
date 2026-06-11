import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Columns2, Plus, RotateCcw, Rows2, Save, Trash2, Undo2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DataTable, Column } from '../DataTable';
import { apiService } from '../../services/api-service';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectDexesMeta,
  selectFullPoolsData,
  selectJobsDataResponse,
  selectPoolsMeta,
} from '../../store/db-config/dbConfig.selectors';
import { normalizeDexJobForStore } from '../../utils/dexJob';

interface DexJobRelationsPageProps {
  jobId: number;
  jobName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

interface PoolJobRow {
  id: number;
  poolId: number;
  relationId?: number;
  dexName: string;
  dexVersion: string;
  poolAddress: string;
  chainName: string;
  token0Symbol: string;
  token1Symbol: string;
  fee: string;
}

const areSetsEqual = (left: Set<number>, right: Set<number>) => {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
};

const mapPoolToRow = (pool: any, relationId?: number): PoolJobRow => ({
  id: Number(pool.poolId ?? pool.id),
  poolId: Number(pool.poolId ?? pool.id),
  relationId,
  dexName: String(pool.dexName ?? '-'),
  dexVersion: String(pool.version ?? '-'),
  poolAddress: String(pool.poolAddress ?? '-'),
  chainName: String(pool.chainName ?? '-'),
  token0Symbol: String(pool.token0Symbol ?? pool.token0Name ?? '-'),
  token1Symbol: String(pool.token1Symbol ?? pool.token1Name ?? '-'),
  fee: String(pool.fee ?? '-'),
});

interface MoveHistoryEntry {
  poolIds: number[];
  toActive: boolean;
}

const extractRelationMeta = (relation: any): { poolId: number; relationId: number } | null => {
  const poolId = Number(relation?.pool?.poolId ?? relation?.poolId);
  const relationId = Number(
    relation?.poolsJobRelationId ?? relation?.pools_job_relation_id ?? relation?.id,
  );
  if (!Number.isFinite(poolId) || !Number.isFinite(relationId)) return null;
  return { poolId, relationId };
};

export function DexJobRelationsPage({ jobId, jobName, language, onBack }: DexJobRelationsPageProps) {
  const dispatch = useAppDispatch();
  const pools = useAppSelector(selectFullPoolsData);
  const jobsFromStore = useAppSelector(selectJobsDataResponse);
  const poolsMeta = useAppSelector(selectPoolsMeta);
  const dexesMeta = useAppSelector(selectDexesMeta);

  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [jobChainId, setJobChainId] = useState<number | null>(null);
  const [activePoolIds, setActivePoolIds] = useState<Set<number>>(new Set());
  const [initialActivePoolIds, setInitialActivePoolIds] = useState<Set<number>>(new Set());
  const [relationIdByPoolId, setRelationIdByPoolId] = useState<Map<number, number>>(new Map());
  const [inTableRows, setInTableRows] = useState<PoolJobRow[]>([]);
  const [notInTableRows, setNotInTableRows] = useState<PoolJobRow[]>([]);
  const [selectedInRows, setSelectedInRows] = useState<Set<number>>(new Set());
  const [selectedNotInRows, setSelectedNotInRows] = useState<Set<number>>(new Set());
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [undoStack, setUndoStack] = useState<MoveHistoryEntry[]>([]);
  const inTableRowsRef = useRef<PoolJobRow[]>([]);
  const notInTableRowsRef = useRef<PoolJobRow[]>([]);

  useEffect(() => {
    inTableRowsRef.current = inTableRows;
  }, [inTableRows]);

  useEffect(() => {
    notInTableRowsRef.current = notInTableRows;
  }, [notInTableRows]);

  const t = {
    en: {
      back: 'Back to DEX jobs',
      inRelations: `Job ID:${jobId} pools`,
      notInRelations: 'Available pools',
      dexName: 'Dex Name',
      dexVersion: 'Dex version',
      token0Symbol: 'Token 0',
      token1Symbol: 'Token 1',
      fee: 'Fee',
      poolAddress: 'Pool address',
      chainName: 'Chain Name',
      addSelected: 'Add selected',
      removeSelected: 'Remove selected',
      saveChanges: 'Save changes',
      undo: 'Undo',
      reset: 'Reset',
      loading: 'Loading job pools…',
    },
    ru: {
      back: 'К списку DEX задач',
      inRelations: `Job ID:${jobId} пулы`,
      notInRelations: 'Доступные пулы',
      dexName: 'DEX',
      dexVersion: 'Версия DEX',
      token0Symbol: 'Токен 0',
      token1Symbol: 'Токен 1',
      fee: 'Комиссия',
      poolAddress: 'Адрес пула',
      chainName: 'Сеть',
      addSelected: 'Добавить выбранные',
      removeSelected: 'Удалить выбранные',
      saveChanges: 'Сохранить',
      undo: 'Отменить',
      reset: 'Сбросить',
      loading: 'Загрузка пулов задачи…',
    },
  };

  useEffect(() => {
    if ((!poolsMeta.isLoaded || poolsMeta.error) && !poolsMeta.isLoading) {
      dispatch(dbConfigActions.initPoolsPage());
    }
    if ((!dexesMeta.isLoaded || dexesMeta.error) && !dexesMeta.isLoading) {
      dispatch(dbConfigActions.setDexesData());
    }
  }, [dexesMeta.error, dexesMeta.isLoaded, dexesMeta.isLoading, dispatch, poolsMeta.error, poolsMeta.isLoaded, poolsMeta.isLoading]);

  const chainPools = useMemo(() => {
    if (jobChainId === null) return [];
    return (pools ?? []).filter((pool: any) => Number(pool.chainId) === jobChainId);
  }, [jobChainId, pools]);

  const poolById = useMemo(
    () => new Map(chainPools.map((pool: any) => [Number(pool.poolId ?? pool.id), pool])),
    [chainPools],
  );

  const applyRelationState = useCallback(
    (
      nextActivePoolIds: Set<number>,
      nextRelationMap: Map<number, number>,
      poolsForRows: any[],
    ) => {
      const inRows: PoolJobRow[] = [];
      const notRows: PoolJobRow[] = [];

      poolsForRows.forEach((pool) => {
        const poolId = Number(pool.poolId ?? pool.id);
        if (nextActivePoolIds.has(poolId)) {
          inRows.push(mapPoolToRow(pool, nextRelationMap.get(poolId)));
        } else {
          notRows.push(mapPoolToRow(pool));
        }
      });

      setActivePoolIds(nextActivePoolIds);
      setInitialActivePoolIds(new Set(nextActivePoolIds));
      setRelationIdByPoolId(nextRelationMap);
      setInTableRows(inRows);
      setNotInTableRows(notRows);
      setSelectedInRows(new Set());
      setSelectedNotInRows(new Set());
      setUndoStack([]);
    },
    [],
  );

  useEffect(() => {
    if (!poolsMeta.isLoaded || poolsMeta.isLoading) return;

    let mounted = true;

    const loadInitialData = async () => {
      setIsInitialLoading(true);
      try {
        const [job, activeRelationsRaw] = await Promise.all([
          apiService.getJobById(jobId),
          apiService.getPoolJobRelationsByJobId(jobId),
        ]);
        if (!mounted) return;

        const chainId = Number(job?.chainId);
        const resolvedChainId = Number.isFinite(chainId) ? chainId : null;
        setJobChainId(resolvedChainId);

        const poolsForChain = (pools ?? []).filter(
          (pool: any) => resolvedChainId == null || Number(pool.chainId) === resolvedChainId,
        );

        const nextActivePoolIds = new Set<number>();
        const nextRelationMap = new Map<number, number>();

        (activeRelationsRaw ?? []).forEach((relation: any) => {
          const meta = extractRelationMeta(relation);
          if (!meta) return;
          nextActivePoolIds.add(meta.poolId);
          nextRelationMap.set(meta.poolId, meta.relationId);
        });

        applyRelationState(nextActivePoolIds, nextRelationMap, poolsForChain);
      } finally {
        if (mounted) setIsInitialLoading(false);
      }
    };

    void loadInitialData();

    return () => {
      mounted = false;
    };
  }, [applyRelationState, jobId, pools, poolsMeta.isLoaded, poolsMeta.isLoading]);

  const hasChanges = useMemo(
    () => !areSetsEqual(activePoolIds, initialActivePoolIds),
    [activePoolIds, initialActivePoolIds],
  );

  const rebuildTablesFromActiveIds = useCallback(
    (activeIds: Set<number>) => {
      const inRows: PoolJobRow[] = [];
      const notRows: PoolJobRow[] = [];

      chainPools.forEach((pool) => {
        const poolId = Number(pool.poolId ?? pool.id);
        if (activeIds.has(poolId)) {
          inRows.push(mapPoolToRow(pool, relationIdByPoolId.get(poolId)));
        } else {
          notRows.push(mapPoolToRow(pool));
        }
      });

      setInTableRows(inRows);
      setNotInTableRows(notRows);
    },
    [chainPools, relationIdByPoolId],
  );

  const handleResetChanges = useCallback(() => {
    const restored = new Set(initialActivePoolIds);
    setActivePoolIds(restored);
    rebuildTablesFromActiveIds(restored);
    setSelectedInRows(new Set());
    setSelectedNotInRows(new Set());
    setUndoStack([]);
  }, [initialActivePoolIds, rebuildTablesFromActiveIds]);

  const toggleSelected = (
    setState: (value: Set<number> | ((prev: Set<number>) => Set<number>)) => void,
    id: number,
  ) => {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveRowsBetweenTables = useCallback(
    (poolIds: Iterable<number>, toActive: boolean, recordHistory = true) => {
      const ids = [...poolIds];
      if (ids.length === 0) return;

      if (recordHistory) {
        setUndoStack((prev) => [...prev, { poolIds: ids, toActive }]);
      }

      const idSet = new Set(ids);
      const movingRows: PoolJobRow[] = [];

      if (toActive) {
        const nextNot = notInTableRowsRef.current.filter((row) => {
          if (!idSet.has(row.poolId)) return true;
          const pool = poolById.get(row.poolId);
          if (pool) movingRows.push(mapPoolToRow(pool));
          return false;
        });
        setNotInTableRows(nextNot);
        setInTableRows([...inTableRowsRef.current, ...movingRows]);
      } else {
        const nextIn = inTableRowsRef.current.filter((row) => {
          if (!idSet.has(row.poolId)) return true;
          const pool = poolById.get(row.poolId);
          if (pool) movingRows.push(mapPoolToRow(pool));
          return false;
        });
        setInTableRows(nextIn);
        setNotInTableRows([...notInTableRowsRef.current, ...movingRows]);
      }

      setActivePoolIds((prev) => {
        const next = new Set(prev);
        ids.forEach((poolId) => {
          if (toActive) next.add(poolId);
          else next.delete(poolId);
        });
        return next;
      });

      setSelectedInRows((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      setSelectedNotInRows((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    },
    [poolById],
  );

  const moveSingle = (poolId: number, toActive: boolean) => {
    moveRowsBetweenTables([poolId], toActive);
  };

  const handleRemoveSelected = () => {
    moveRowsBetweenTables(selectedInRows, false);
  };

  const handleAddSelected = () => {
    moveRowsBetweenTables(selectedNotInRows, true);
  };

  const handleUndoLast = useCallback(() => {
    const last = undoStack[undoStack.length - 1];
    if (!last) return;
    setUndoStack((prev) => prev.slice(0, -1));
    moveRowsBetweenTables(last.poolIds, !last.toActive, false);
  }, [moveRowsBetweenTables, undoStack]);

  const patchJobPoolsCountInStore = useCallback(
    (poolsCount: number) => {
      const existing = (jobsFromStore ?? []).find(
        (job: any) => Number(job.jobId ?? job.id) === jobId,
      );
      if (!existing) return;

      dispatch(
        dbConfigActions.upsertJob({
          job: normalizeDexJobForStore({
            ...existing,
            poolsCount,
          }),
        }),
      );
    },
    [dispatch, jobId, jobsFromStore],
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toCreate = Array.from(activePoolIds).filter((poolId) => !initialActivePoolIds.has(poolId));
      const removedPoolIds = Array.from(initialActivePoolIds).filter(
        (poolId) => !activePoolIds.has(poolId),
      );
      const toDelete = removedPoolIds
        .map((poolId) => relationIdByPoolId.get(poolId))
        .filter((id): id is number => Number.isFinite(Number(id)));

      let createdRelations: any[] = [];
      if (toCreate.length > 0) {
        const result = await apiService.createPoolJobRelations(
          toCreate.map((poolId) => ({
            jobId,
            poolId,
          })),
        );
        createdRelations = Array.isArray(result) ? result : result ? [result] : [];
      }

      if (toDelete.length > 0) {
        await apiService.deletePoolJobRelations(toDelete);
      }

      setRelationIdByPoolId((prev) => {
        const next = new Map(prev);
        removedPoolIds.forEach((poolId) => next.delete(poolId));
        createdRelations.forEach((relation) => {
          const meta = extractRelationMeta(relation);
          if (meta) next.set(meta.poolId, meta.relationId);
        });
        return next;
      });

      if (createdRelations.length > 0) {
        const relationIdByCreatedPoolId = new Map<number, number>();
        createdRelations.forEach((relation) => {
          const meta = extractRelationMeta(relation);
          if (meta) relationIdByCreatedPoolId.set(meta.poolId, meta.relationId);
        });

        setInTableRows((current) =>
          current.map((row) => {
            const relationId = relationIdByCreatedPoolId.get(row.poolId);
            return relationId != null && row.relationId !== relationId
              ? { ...row, relationId }
              : row;
          }),
        );
      }

      setInitialActivePoolIds(new Set(activePoolIds));
      setUndoStack([]);
      patchJobPoolsCountInStore(activePoolIds.size);
    } finally {
      setIsSaving(false);
    }
  };

  const relationColumns: Column[] = [
    { key: 'dexName', label: t[language].dexName, sortable: true, filterable: true },
    { key: 'dexVersion', label: t[language].dexVersion, sortable: true, filterable: true },
    { key: 'token0Symbol', label: t[language].token0Symbol, sortable: true, filterable: true },
    { key: 'token1Symbol', label: t[language].token1Symbol, sortable: true, filterable: true },
    { key: 'fee', label: t[language].fee, sortable: true, filterable: true },
    {
      key: 'poolAddress',
      label: t[language].poolAddress,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
  ];

  const renderTable = (
    data: PoolJobRow[],
    selectedSet: Set<number>,
    onToggle: (id: number) => void,
    title: string,
    action: 'add' | 'remove',
    onFilteredDataChange: (rows: any[]) => void,
  ) => {
    const columnsWithCheckbox: Column[] = [
      {
        key: 'checkbox',
        label: '',
        render: (_, row) => (
          <input
            type="checkbox"
            checked={selectedSet.has(row.poolId)}
            onChange={() => onToggle(row.poolId)}
            className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
            onClick={(event) => event.stopPropagation()}
          />
        ),
      },
      ...relationColumns,
    ];

    return (
      <div className="h-full min-h-[260px] min-w-0 flex flex-col">
        <DataTable
          title={title}
          columns={columnsWithCheckbox}
          data={data}
          language={language}
          isLoading={isInitialLoading || poolsMeta.isLoading}
          loadingText={t[language].loading}
          actionsColumnPosition="last"
          actionsColumnLabel=""
          extraActions={(row) => (
            <button
              onClick={(event) => {
                event.stopPropagation();
                moveSingle(row.poolId, action === 'add');
              }}
              className={`p-1.5 rounded transition-colors ${
                action === 'remove'
                  ? 'hover:bg-destructive/10 text-destructive'
                  : 'hover:bg-success/10 text-success'
              }`}
            >
              {action === 'remove' ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          )}
          onFilteredDataChange={onFilteredDataChange}
          getRowId={(params) => String(params.data?.poolId ?? '')}
        />
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t[language].back}
        </button>
        <div className="h-6 w-px bg-border" />
        <h2 className="text-foreground">{jobName}</h2>
        <div className="flex-1" />
        <button
          onClick={handleUndoLast}
          disabled={isSaving || !hasChanges || undoStack.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Undo2 className="w-4 h-4" />
          {t[language].undo}
        </button>
        <button
          onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
        >
          {layoutMode === 'vertical' ? <Columns2 className="w-4 h-4" /> : <Rows2 className="w-4 h-4" />}
        </button>
      </div>

      <PanelGroup direction={layoutMode} className="flex-1 min-h-[320px] min-w-0 overflow-hidden">
        <Panel defaultSize={50} minSize={20}>
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
              {renderTable(
                inTableRows,
                selectedInRows,
                (id) => toggleSelected(setSelectedInRows, id),
                t[language].inRelations,
                'remove',
                () => undefined,
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle
          className={`${layoutMode === 'vertical' ? 'h-1 cursor-row-resize' : 'w-1 cursor-col-resize'} bg-border hover:bg-primary transition-colors`}
        />

        <Panel defaultSize={50} minSize={20}>
          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
              {renderTable(
                notInTableRows,
                selectedNotInRows,
                (id) => toggleSelected(setSelectedNotInRows, id),
                t[language].notInRelations,
                'add',
                () => undefined,
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>

      <div className="h-16 border-t border-border bg-card flex items-center justify-between gap-3 px-4">
        <button
          onClick={handleResetChanges}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded hover:bg-muted transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          {t[language].reset}
        </button>
        <div className="flex items-center gap-3">
        <button
          disabled={selectedInRows.size === 0}
          onClick={handleRemoveSelected}
          className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Trash2 className="w-4 h-4" />
          {t[language].removeSelected} ({selectedInRows.size})
        </button>
        <button
          disabled={selectedNotInRows.size === 0}
          onClick={handleAddSelected}
          className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Plus className="w-4 h-4" />
          {t[language].addSelected} ({selectedNotInRows.size})
        </button>
        <button
          onClick={() => void handleSave()}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {t[language].saveChanges}
        </button>
        </div>
      </div>
    </div>
  );
}
