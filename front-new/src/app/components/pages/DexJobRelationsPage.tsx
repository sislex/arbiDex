import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Columns2, Plus, Rows2, Save, Trash2 } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { DataTable, Column } from '../DataTable';
import { apiService } from '../../services/api-service';

interface DexJobRelationsPageProps {
  jobId: number;
  jobName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

interface QuoteRelationRow {
  id: number;
  quoteId: number | string;
  dexName: string;
  dexVersion: string;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  tokenIn: number | string;
  tokenOut: number | string;
  amount: string;
  fee: string;
  pairId: number | string;
  chainName: string;
}

const areSetsEqual = (left: Set<number>, right: Set<number>) => {
  if (left.size !== right.size) return false;
  for (const value of left) {
    if (!right.has(value)) return false;
  }
  return true;
};

const mapQuoteRelationToRow = (relation: any): QuoteRelationRow => {
  const pair = relation?.pair ?? {};
  const pool = pair?.pool ?? {};
  return {
    id: Number(relation?.pairQuoteRelationId ?? relation?.pair_quote_relation_id ?? relation?.id),
    quoteId: relation?.quote?.quoteId ?? relation?.quote?.id ?? '-',
    dexName: pool?.dex?.name ?? '-',
    dexVersion: String(pool?.version ?? '-'),
    tokenInSymbol: pair?.tokenIn?.symbol ?? '-',
    tokenOutSymbol: pair?.tokenOut?.symbol ?? '-',
    tokenIn: pair?.tokenIn?.tokenId ?? '-',
    tokenOut: pair?.tokenOut?.tokenId ?? '-',
    amount: String(relation?.quote?.amount ?? '-'),
    fee: String(pool?.fee ?? '-'),
    pairId: pair?.pairId ?? '-',
    chainName: pool?.chain?.name ?? '-',
  };
};

export function DexJobRelationsPage({ jobId, jobName, language, onBack }: DexJobRelationsPageProps) {
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [allRelations, setAllRelations] = useState<QuoteRelationRow[]>([]);
  const [activeRelationIds, setActiveRelationIds] = useState<Set<number>>(new Set());
  const [initialActiveRelationIds, setInitialActiveRelationIds] = useState<Set<number>>(new Set());
  const [jobRelationIdByQuoteRelationId, setJobRelationIdByQuoteRelationId] = useState<Map<number, number>>(new Map());
  const [selectedInRelations, setSelectedInRelations] = useState<Set<number>>(new Set());
  const [selectedNotInRelations, setSelectedNotInRelations] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const t = {
    en: {
      back: 'Back to DEX jobs',
      inRelations: `Job ID:${jobId} relations table`,
      notInRelations: 'Is not relations',
      quoteId: 'Quote ID',
      dexName: 'Dex Name',
      dexVersion: 'Dex version',
      tokenInSymbol: 'Token In Symbol',
      tokenOutSymbol: 'Token Out Symbol',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      amount: 'Amount',
      fee: 'Fee',
      pairId: 'Pair ID',
      chainName: 'Chain Name',
      addSelected: 'Add selected',
      removeSelected: 'Remove selected',
      saveChanges: 'Save changes',
      loading: 'Loading job relations…',
    },
    ru: {
      back: 'К списку DEX задач',
      inRelations: `Job ID:${jobId} таблица связей`,
      notInRelations: 'Не в связях',
      quoteId: 'ID котировки',
      dexName: 'DEX',
      dexVersion: 'Версия DEX',
      tokenInSymbol: 'Символ токена входа',
      tokenOutSymbol: 'Символ токена выхода',
      tokenIn: 'Токен входа',
      tokenOut: 'Токен выхода',
      amount: 'Сумма',
      fee: 'Комиссия',
      pairId: 'ID пары',
      chainName: 'Сеть',
      addSelected: 'Добавить выбранные',
      removeSelected: 'Удалить выбранные',
      saveChanges: 'Сохранить',
      loading: 'Загрузка связей задачи…',
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allQuoteRelationsRaw, activeJobRelationsRaw] = await Promise.all([
        apiService.getQuoteRelations(jobId),
        apiService.getJobRelationsByJobId(jobId),
      ]);

      const rowById = new Map<number, QuoteRelationRow>();
      (allQuoteRelationsRaw ?? []).forEach((relation: any) => {
        const row = mapQuoteRelationToRow(relation);
        if (Number.isFinite(row.id)) rowById.set(row.id, row);
      });

      const nextActiveRelationIds = new Set<number>();
      const nextJobRelationMap = new Map<number, number>();

      (activeJobRelationsRaw ?? []).forEach((jobRelation: any) => {
        const quoteRelation = jobRelation?.quoteRelation;
        if (!quoteRelation) return;

        const quoteRelationId = Number(
          quoteRelation?.pairQuoteRelationId ?? quoteRelation?.pair_quote_relation_id ?? quoteRelation?.id,
        );
        const jobRelationId = Number(
          jobRelation?.quoteJobRelationId ?? jobRelation?.quote_job_relation_id ?? jobRelation?.id,
        );

        if (Number.isFinite(quoteRelationId)) {
          nextActiveRelationIds.add(quoteRelationId);
          if (Number.isFinite(jobRelationId)) nextJobRelationMap.set(quoteRelationId, jobRelationId);
          if (!rowById.has(quoteRelationId)) {
            rowById.set(quoteRelationId, mapQuoteRelationToRow(quoteRelation));
          }
        }
      });

      const rows = Array.from(rowById.values());
      setAllRelations(rows);
      setActiveRelationIds(nextActiveRelationIds);
      setInitialActiveRelationIds(new Set(nextActiveRelationIds));
      setJobRelationIdByQuoteRelationId(nextJobRelationMap);
      setSelectedInRelations(new Set());
      setSelectedNotInRelations(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const inRelations = useMemo(
    () => allRelations.filter((row) => activeRelationIds.has(row.id)),
    [activeRelationIds, allRelations],
  );
  const notInRelations = useMemo(
    () => allRelations.filter((row) => !activeRelationIds.has(row.id)),
    [activeRelationIds, allRelations],
  );
  const hasChanges = useMemo(
    () => !areSetsEqual(activeRelationIds, initialActiveRelationIds),
    [activeRelationIds, initialActiveRelationIds],
  );

  const toggleSelected = (setState: (value: Set<number> | ((prev: Set<number>) => Set<number>)) => void, id: number) => {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const moveSingle = (relationId: number, toActive: boolean) => {
    setActiveRelationIds((prev) => {
      const next = new Set(prev);
      if (toActive) next.add(relationId);
      else next.delete(relationId);
      return next;
    });
    setSelectedInRelations((prev) => {
      const next = new Set(prev);
      next.delete(relationId);
      return next;
    });
    setSelectedNotInRelations((prev) => {
      const next = new Set(prev);
      next.delete(relationId);
      return next;
    });
  };

  const handleRemoveSelected = () => {
    setActiveRelationIds((prev) => {
      const next = new Set(prev);
      selectedInRelations.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedInRelations(new Set());
  };

  const handleAddSelected = () => {
    setActiveRelationIds((prev) => {
      const next = new Set(prev);
      selectedNotInRelations.forEach((id) => next.add(id));
      return next;
    });
    setSelectedNotInRelations(new Set());
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const currentIds = activeRelationIds;
      const initialIds = initialActiveRelationIds;
      const toCreate = Array.from(currentIds).filter((id) => !initialIds.has(id));
      const removedQuoteRelationIds = Array.from(initialIds).filter((id) => !currentIds.has(id));
      const toDelete = removedQuoteRelationIds
        .map((quoteRelationId) => jobRelationIdByQuoteRelationId.get(quoteRelationId))
        .filter((id): id is number => Number.isFinite(Number(id)));

      if (toCreate.length > 0) {
        await apiService.createJobRelations(
          toCreate.map((quoteRelationId) => ({
            jobId,
            quoteRelationId,
          })),
        );
      }

      if (toDelete.length > 0) {
        await apiService.deleteJobRelations(toDelete);
      }

      await fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  const relationColumns: Column[] = [
    { key: 'quoteId', label: t[language].quoteId, sortable: true, filterable: true },
    { key: 'dexName', label: t[language].dexName, sortable: true, filterable: true },
    { key: 'dexVersion', label: t[language].dexVersion, sortable: true, filterable: true },
    { key: 'tokenInSymbol', label: t[language].tokenInSymbol, sortable: true, filterable: true },
    { key: 'tokenOutSymbol', label: t[language].tokenOutSymbol, sortable: true, filterable: true },
    { key: 'tokenIn', label: t[language].tokenIn, sortable: true, filterable: true },
    { key: 'tokenOut', label: t[language].tokenOut, sortable: true, filterable: true },
    { key: 'amount', label: t[language].amount, sortable: true, filterable: true },
    { key: 'fee', label: t[language].fee, sortable: true, filterable: true },
    { key: 'pairId', label: t[language].pairId, sortable: true, filterable: true },
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
  ];

  const renderTable = (
    data: QuoteRelationRow[],
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
      <div className="h-full min-h-[260px] min-w-0 flex flex-col">
        <DataTable
          title={title}
          columns={columnsWithCheckbox}
          data={data}
          language={language}
          isLoading={isLoading}
          loadingText={t[language].loading}
          onFilteredDataChange={onFilteredDataChange}
          getRowId={(params) => String(params.data?.id ?? '')}
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
                selectedInRelations,
                (id) => toggleSelected(setSelectedInRelations, id),
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
                selectedNotInRelations,
                (id) => toggleSelected(setSelectedNotInRelations, id),
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
