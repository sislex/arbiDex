import { Menu, Plus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { CexPairForm } from '../forms/CexPairForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { apiService } from '../../services/api-service';
import { buildCexChainNameById, resolveCexPairSourceLabel } from '../../utils/cexPairSource';
import {
  selectCexChainsDataResponse,
  selectCexChainsMeta,
  selectCexPairsMeta,
  selectCexPairsDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const CEX_PAIRS_DELETE_SCOPE = 'cex-pairs';

interface PairsPageProps {
  language: 'en' | 'ru';
}

export function PairsPage({ language }: PairsPageProps) {
  const dispatch = useAppDispatch();
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const cexPairsFromStore = useAppSelector(selectCexPairsDataResponse);
  const cexPairsMeta = useAppSelector(selectCexPairsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCexPairRaw, setEditingCexPairRaw] = useState<any>(null);
  const [pendingDeleteCexPairIds, setPendingDeleteCexPairIds] = useState<Set<number>>(new Set());
  const [selectedPairIds, setSelectedPairIds] = useState<Set<number>>(new Set());
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((!cexPairsMeta.isLoaded || cexPairsMeta.error) && !cexPairsMeta.isLoading) {
      dispatch(dbConfigActions.initCexPairsPage());
    }
  }, [cexPairsMeta.error, cexPairsMeta.isLoaded, cexPairsMeta.isLoading, dispatch]);

  const cexChainNameById = useMemo(() => buildCexChainNameById(cexChainsFromStore), [cexChainsFromStore]);

  const cexPairs = useMemo(() => {
    return cexPairsFromStore
      .map((pair: any) => ({
        id: pair.id ?? pair.pairId ?? pair.cexPairId ?? pair.cex_pair_id,
        source: resolveCexPairSourceLabel(pair, cexChainNameById),
        token0: pair.token0 ?? pair.token0Symbol ?? pair.baseToken ?? '',
        token1: pair.token1 ?? pair.token1Symbol ?? pair.quoteToken ?? '',
        raw: pair,
      }))
      .filter((pair) => !pendingDeleteCexPairIds.has(pair.id));
  }, [cexChainNameById, cexPairsFromStore, pendingDeleteCexPairIds]);

  const allPairIds = useMemo(() => cexPairs.map((pair) => pair.id), [cexPairs]);
  const allSelected = allPairIds.length > 0 && allPairIds.every((id) => selectedPairIds.has(id));
  const someSelected = allPairIds.some((id) => selectedPairIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const togglePair = useCallback((id: number) => {
    setSelectedPairIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllPairs = useCallback(() => {
    setSelectedPairIds(allSelected ? new Set() : new Set(allPairIds));
  }, [allPairIds, allSelected]);

  const t = {
    en: {
      add: 'Add CEX Pair',
      pairId: 'Pair ID',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      tableTitle: 'CEX pairs',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
    },
    ru: {
      add: 'Добавить CEX пару',
      pairId: 'ID пары',
      source: 'Источник',
      token0: 'Токен 0',
      token1: 'Токен 1',
      tableTitle: 'CEX пары',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
    },
  };

  const scheduleDelete = useCallback(
    (row: { id: number; token0: string; token1: string }) => {
      setPendingDeleteCexPairIds((prev) => new Set(prev).add(row.id));
      setSelectedPairIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${CEX_PAIRS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteCexPairs([row.id]);
        dispatch(dbConfigActions.removeCexPairsByIds(result.deletedIds ?? [row.id]));
        setPendingDeleteCexPairIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: `${row.token0}/${row.token1}`,
        itemType: language === 'en' ? 'Pair' : 'Пара',
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          setPendingDeleteCexPairIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedPairIds.size === 0) return;

    const toDelete = cexPairs.filter((pair) => selectedPairIds.has(pair.id));
    const deleteIds = toDelete.map((row) => row.id);

    setPendingDeleteCexPairIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedPairIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(CEX_PAIRS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteCexPairs(deleteIds);
      if (!result?.success) {
        throw new Error(language === 'ru' ? 'Не удалось удалить пары' : 'Failed to delete pairs');
      }
      dispatch(dbConfigActions.removeCexPairsByIds(result.deletedIds ?? deleteIds));
      setPendingDeleteCexPairIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: toDelete.length,
      itemType: language === 'en' ? 'pairs' : 'пар',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        setPendingDeleteCexPairIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [cexPairs, dispatch, language, selectedPairIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllPairs}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
          title={
            allSelected
              ? language === 'ru'
                ? 'Снять все'
                : 'Deselect all'
              : language === 'ru'
                ? 'Отметить все'
                : 'Select all'
          }
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedPairIds.has(row.id)}
          onChange={() => togglePair(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    { key: 'id', label: t[language].pairId, sortable: true, filterable: true },
    { key: 'source', label: t[language].source, sortable: true, filterable: true },
    { key: 'token0', label: t[language].token0, sortable: true, filterable: true },
    { key: 'token1', label: t[language].token1, sortable: true, filterable: true },
  ];

  const isTableLoading = cexPairsMeta.isLoading || cexChainsMeta.isLoading;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingCexPairRaw(null);
                setAddDialogOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{t[language].add}</span>
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center p-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
                  aria-label={t[language].actions}
                  title={t[language].actions}
                >
                  <Menu className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  disabled={selectedPairIds.size === 0}
                  variant="destructive"
                  onClick={handleDeleteSelected}
                >
                  {t[language].deleteSelected}
                  {selectedPairIds.size > 0 ? ` (${selectedPairIds.size})` : ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        columns={columns}
        data={cexPairs}
        language={language}
        isLoading={isTableLoading}
        loadingText={language === 'ru' ? 'Загрузка CEX пар…' : 'Loading CEX Pairs…'}
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
        onEdit={(row) => {
          setEditingCexPairRaw(row.raw);
          setAddDialogOpen(true);
        }}
        onDelete={(row) => scheduleDelete(row)}
      />

      <CexPairForm
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setEditingCexPairRaw(null);
        }}
        onSave={async (data) => {
          const payload = {
            source: Number(data.sourceId),
            token0: data.token0Symbol,
            token1: data.token1Symbol,
          };
          const saved = editingCexPairRaw
            ? await apiService.editCexPair(
                Number(
                  editingCexPairRaw.id ??
                    editingCexPairRaw.pairId ??
                    editingCexPairRaw.cexPairId ??
                    editingCexPairRaw.cex_pair_id,
                ),
                payload,
              )
            : await apiService.createCexPair(payload);
          dispatch(dbConfigActions.upsertCexPair({ pair: saved }));
        }}
        initialData={
          editingCexPairRaw
            ? {
                sourceId: String(editingCexPairRaw.source ?? ''),
                token0Symbol: editingCexPairRaw.token0 ?? editingCexPairRaw.token0Symbol ?? '',
                token1Symbol: editingCexPairRaw.token1 ?? editingCexPairRaw.token1Symbol ?? '',
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
