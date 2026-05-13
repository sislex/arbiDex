import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Columns2, Plus, Rows2, Save, Trash2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectPairsFullData, selectPairsMeta } from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';

interface QuoteRelationsPageProps {
  quoteId: number;
  quoteName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

interface PairRow {
  id: number;
  chainName: string;
  dexName: string;
  dexVersion: string;
  fee: string;
  tokenIn: string;
  tokenOut: string;
  tokenInAddress: string;
  tokenOutAddress: string;
}

interface PairQuoteRelationRow {
  pairQuoteRelationId: number;
  pairId: number;
}

const areSetsEqual = (left: Set<number>, right: Set<number>) => {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
};

export function QuoteRelationsPageAg({ quoteId, quoteName, language, onBack }: QuoteRelationsPageProps) {
  const dispatch = useAppDispatch();
  const pairsMeta = useAppSelector(selectPairsMeta);
  const pairs = useAppSelector(selectPairsFullData);

  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [activePairIds, setActivePairIds] = useState<Set<number>>(new Set());
  const [initialActivePairIds, setInitialActivePairIds] = useState<Set<number>>(new Set());
  const [relationIdByPairId, setRelationIdByPairId] = useState<Map<number, number>>(new Map());
  const [selectedInRelations, setSelectedInRelations] = useState<Set<number>>(new Set());
  const [selectedNotInRelations, setSelectedNotInRelations] = useState<Set<number>>(new Set());
  const [filteredInCount, setFilteredInCount] = useState(0);
  const [filteredNotCount, setFilteredNotCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const t = {
    en: {
      back: 'Back to Quotes',
      inRelations: "It's relations",
      notInRelations: 'Is not relations',
      chainName: 'Chain Name',
      dexName: 'Dex Name',
      dexVersion: 'Dex version',
      fee: 'Fee',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      tokenInAddress: 'Token In Address',
      tokenOutAddress: 'Token Out Address',
      addSelected: 'Add selected',
      removeSelected: 'Remove selected',
      saveChanges: 'Save changes',
      loading: 'Loading quote relations…',
    },
    ru: {
      back: 'К списку котировок',
      inRelations: 'В связях',
      notInRelations: 'Не в связях',
      chainName: 'Chain Name',
      dexName: 'Dex Name',
      dexVersion: 'Dex version',
      fee: 'Fee',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      tokenInAddress: 'Token In Address',
      tokenOutAddress: 'Token Out Address',
      addSelected: 'Добавить выбранные',
      removeSelected: 'Удалить выбранные',
      saveChanges: 'Сохранить',
      loading: 'Загрузка связей котировки…',
    },
  };

  useEffect(() => {
    if ((!pairsMeta.isLoaded || pairsMeta.error) && !pairsMeta.isLoading) {
      dispatch(dbConfigActions.refetchPairsPageResources());
    }
  }, [dispatch, pairsMeta.error, pairsMeta.isLoaded, pairsMeta.isLoading]);

  const allRows = useMemo<PairRow[]>(
    () =>
      pairs.map((pair: any) => ({
        id: Number(pair.pairId ?? pair.id),
        chainName: pair.chainName ?? '-',
        dexName: pair.dexName ?? '-',
        dexVersion: String(pair.version ?? pair.dexVersion ?? pair.dex_version ?? '-'),
        fee: String(pair.fee ?? '-'),
        tokenIn: pair.tokenInName ?? pair.tokenInSymbol ?? '-',
        tokenOut: pair.tokenOutName ?? pair.tokenOutSymbol ?? '-',
        tokenInAddress: pair.tokenInAddress ?? '-',
        tokenOutAddress: pair.tokenOutAddress ?? '-',
      })),
    [pairs],
  );

  const fetchRelations = async () => {
    setIsLoading(true);
    try {
      const relationRows = (await apiService.getQuoteRelationsByQuoteId(quoteId)) as PairQuoteRelationRow[];
      const nextActive = new Set<number>();
      const relationMap = new Map<number, number>();

      (relationRows ?? []).forEach((row: any) => {
        const pairId = Number(row.pairId ?? row.pair_id);
        const relationId = Number(row.pairQuoteRelationId ?? row.pair_quote_relation_id);
        if (Number.isFinite(pairId)) {
          nextActive.add(pairId);
          if (Number.isFinite(relationId)) relationMap.set(pairId, relationId);
        }
      });

      setActivePairIds(nextActive);
      setInitialActivePairIds(new Set(nextActive));
      setRelationIdByPairId(relationMap);
      setSelectedInRelations(new Set());
      setSelectedNotInRelations(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!allRows.length) return;
    fetchRelations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteId, allRows.length]);

  const inRelations = useMemo(() => allRows.filter((row) => activePairIds.has(row.id)), [activePairIds, allRows]);
  const notInRelations = useMemo(
    () => allRows.filter((row) => !activePairIds.has(row.id)),
    [activePairIds, allRows],
  );

  const relationsColumns: Column[] = [
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
    { key: 'dexName', label: t[language].dexName, sortable: true, filterable: true },
    { key: 'dexVersion', label: t[language].dexVersion, sortable: true, filterable: true },
    { key: 'fee', label: t[language].fee, sortable: true, filterable: true },
    { key: 'tokenIn', label: t[language].tokenIn, sortable: true, filterable: true },
    { key: 'tokenOut', label: t[language].tokenOut, sortable: true, filterable: true },
    {
      key: 'tokenInAddress',
      label: t[language].tokenInAddress,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
  ];

  const hasChanges = useMemo(
    () => !areSetsEqual(activePairIds, initialActivePairIds),
    [activePairIds, initialActivePairIds],
  );

  const toggleSelected = (setState: (value: Set<number> | ((prev: Set<number>) => Set<number>)) => void, id: number) => {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveSingle = (pairId: number, toActive: boolean) => {
    setActivePairIds((prev) => {
      const next = new Set(prev);
      if (toActive) next.add(pairId);
      else next.delete(pairId);
      return next;
    });
    setSelectedInRelations((prev) => {
      const next = new Set(prev);
      next.delete(pairId);
      return next;
    });
    setSelectedNotInRelations((prev) => {
      const next = new Set(prev);
      next.delete(pairId);
      return next;
    });
  };

  const handleRemoveSelected = () => {
    setActivePairIds((prev) => {
      const next = new Set(prev);
      selectedInRelations.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedInRelations(new Set());
  };

  const handleAddSelected = () => {
    setActivePairIds((prev) => {
      const next = new Set(prev);
      selectedNotInRelations.forEach((id) => next.add(id));
      return next;
    });
    setSelectedNotInRelations(new Set());
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const current = activePairIds;
      const initial = initialActivePairIds;

      const toCreate = Array.from(current).filter((id) => !initial.has(id));
      const toDeletePairIds = Array.from(initial).filter((id) => !current.has(id));
      const toDeleteRelationIds = toDeletePairIds
        .map((pairId) => relationIdByPairId.get(pairId))
        .filter((id): id is number => Number.isFinite(Number(id)));

      if (toCreate.length > 0) {
        await apiService.createQuoteRelations(
          toCreate.map((pairId) => ({
            quoteId,
            pairId,
          })),
        );
      }

      if (toDeleteRelationIds.length > 0) {
        await apiService.deleteQuoteRelations(toDeleteRelationIds);
      }

      await fetchRelations();
    } finally {
      setIsSaving(false);
    }
  };

  const renderTable = (
    data: PairRow[],
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
            checked={selectedSet.has(row.id)}
            onChange={() => onToggle(row.id)}
            className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        ),
      },
      ...relationsColumns,
      {
        key: 'actions',
        label: '',
        render: (_, row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              moveSingle(row.id, action === 'add');
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
      <DataTable
        title={`${title} (${data.length})`}
        columns={columnsWithCheckbox}
        data={data}
        language={language}
        isLoading={isLoading || pairsMeta.isLoading}
        loadingText={t[language].loading}
        onFilteredDataChange={onFilteredDataChange}
      />
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t[language].back}
        </button>
        <div className="h-6 w-px bg-border" />
        <h2 className="text-foreground">{quoteName}</h2>
        <div className="flex-1" />
        <button
          onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
        >
          {layoutMode === 'vertical' ? <Columns2 className="w-4 h-4" /> : <Rows2 className="w-4 h-4" />}
        </button>
      </div>

      <PanelGroup direction={layoutMode} className="flex-1">
        <Panel defaultSize={50} minSize={20}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              {renderTable(
                inRelations,
                selectedInRelations,
                (id) => toggleSelected(setSelectedInRelations, id),
                t[language].inRelations,
                'remove',
                (rows) => setFilteredInCount(rows.length),
              )}
            </div>
          </div>
        </Panel>

        <PanelResizeHandle
          className={`${layoutMode === 'vertical' ? 'h-1 cursor-row-resize' : 'w-1 cursor-col-resize'} bg-border hover:bg-primary transition-colors`}
        />

        <Panel defaultSize={50} minSize={20}>
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
              {renderTable(
                notInRelations,
                selectedNotInRelations,
                (id) => toggleSelected(setSelectedNotInRelations, id),
                t[language].notInRelations,
                'add',
                (rows) => setFilteredNotCount(rows.length),
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
        <button
          disabled={selectedInRelations.size === 0}
          onClick={handleRemoveSelected}
          className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Trash2 className="w-4 h-4" />
          {t[language].removeSelected} ({selectedInRelations.size})
        </button>
        <button
          disabled={selectedNotInRelations.size === 0}
          onClick={handleAddSelected}
          className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          <Plus className="w-4 h-4" />
          {t[language].addSelected} ({selectedNotInRelations.size})
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
