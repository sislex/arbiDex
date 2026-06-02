import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Columns2, Plus, Rows2, Save, Trash2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DataTable, Column } from '../DataTable';
import { apiService } from '../../services/api-service';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectDexesMeta,
  selectFullPoolsData,
  selectPoolsMeta,
} from '../../store/db-config/dbConfig.selectors';

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

export function DexJobRelationsPage({ jobId, jobName, language, onBack }: DexJobRelationsPageProps) {
  const dispatch = useAppDispatch();
  const pools = useAppSelector(selectFullPoolsData);
  const poolsMeta = useAppSelector(selectPoolsMeta);
  const dexesMeta = useAppSelector(selectDexesMeta);

  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [jobChainId, setJobChainId] = useState<number | null>(null);
  const [activePoolIds, setActivePoolIds] = useState<Set<number>>(new Set());
  const [initialActivePoolIds, setInitialActivePoolIds] = useState<Set<number>>(new Set());
  const [relationIdByPoolId, setRelationIdByPoolId] = useState<Map<number, number>>(new Map());
  const [selectedInRows, setSelectedInRows] = useState<Set<number>>(new Set());
  const [selectedNotInRows, setSelectedNotInRows] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [job, activeRelationsRaw] = await Promise.all([
        apiService.getJobById(jobId),
        apiService.getPoolJobRelationsByJobId(jobId),
      ]);

      const chainId = Number(job?.chainId);
      setJobChainId(Number.isFinite(chainId) ? chainId : null);

      const nextActivePoolIds = new Set<number>();
      const nextRelationMap = new Map<number, number>();

      (activeRelationsRaw ?? []).forEach((relation: any) => {
        const poolId = Number(relation?.pool?.poolId ?? relation?.poolId);
        const relationId = Number(
          relation?.poolsJobRelationId ?? relation?.pools_job_relation_id ?? relation?.id,
        );
        if (Number.isFinite(poolId)) {
          nextActivePoolIds.add(poolId);
          if (Number.isFinite(relationId)) nextRelationMap.set(poolId, relationId);
        }
      });

      setActivePoolIds(nextActivePoolIds);
      setInitialActivePoolIds(new Set(nextActivePoolIds));
      setRelationIdByPoolId(nextRelationMap);
      setSelectedInRows(new Set());
      setSelectedNotInRows(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!poolsMeta.isLoaded || poolsMeta.isLoading) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId, poolsMeta.isLoaded, poolsMeta.isLoading]);

  const inRelations = useMemo(
    () =>
      chainPools
        .filter((pool: any) => activePoolIds.has(Number(pool.poolId)))
        .map((pool: any) => mapPoolToRow(pool, relationIdByPoolId.get(Number(pool.poolId)))),
    [activePoolIds, chainPools, relationIdByPoolId],
  );

  const notInRelations = useMemo(
    () =>
      chainPools
        .filter((pool: any) => !activePoolIds.has(Number(pool.poolId)))
        .map((pool: any) => mapPoolToRow(pool)),
    [activePoolIds, chainPools],
  );

  const hasChanges = useMemo(
    () => !areSetsEqual(activePoolIds, initialActivePoolIds),
    [activePoolIds, initialActivePoolIds],
  );

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

  const moveSingle = (poolId: number, toActive: boolean) => {
    setActivePoolIds((prev) => {
      const next = new Set(prev);
      if (toActive) next.add(poolId);
      else next.delete(poolId);
      return next;
    });
    setSelectedInRows((prev) => {
      const next = new Set(prev);
      next.delete(poolId);
      return next;
    });
    setSelectedNotInRows((prev) => {
      const next = new Set(prev);
      next.delete(poolId);
      return next;
    });
  };

  const handleRemoveSelected = () => {
    setActivePoolIds((prev) => {
      const next = new Set(prev);
      selectedInRows.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedInRows(new Set());
  };

  const handleAddSelected = () => {
    setActivePoolIds((prev) => {
      const next = new Set(prev);
      selectedNotInRows.forEach((id) => next.add(id));
      return next;
    });
    setSelectedNotInRows(new Set());
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const toCreate = Array.from(activePoolIds).filter((poolId) => !initialActivePoolIds.has(poolId));
      const removedPoolIds = Array.from(initialActivePoolIds).filter((poolId) => !activePoolIds.has(poolId));
      const toDelete = removedPoolIds
        .map((poolId) => relationIdByPoolId.get(poolId))
        .filter((id): id is number => Number.isFinite(Number(id)));

      if (toCreate.length > 0) {
        await apiService.createPoolJobRelations(
          toCreate.map((poolId) => ({
            jobId,
            poolId,
          })),
        );
      }

      if (toDelete.length > 0) {
        await apiService.deletePoolJobRelations(toDelete);
      }

      await fetchData();
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
      {
        key: 'actions',
        label: '',
        render: (_, row) => (
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
        ),
      },
    ];

    return (
      <div className="h-full min-h-[260px] min-w-0 flex flex-col">
        <DataTable
          title={title}
          columns={columnsWithCheckbox}
          data={data}
          language={language}
          isLoading={isLoading || poolsMeta.isLoading}
          loadingText={t[language].loading}
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
                inRelations,
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
                notInRelations,
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

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
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
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {t[language].saveChanges}
        </button>
      </div>
    </div>
  );
}
