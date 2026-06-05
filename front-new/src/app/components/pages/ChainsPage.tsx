import { ChevronDown, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, Column } from '../DataTable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChainForm } from '../forms/ChainForm';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { apiService } from '../../services/api-service';
import {
  selectCexChainsDataResponse,
  selectCexChainsMeta,
  selectChainsDataResponse,
  selectChainsMeta,
} from '../../store/db-config/dbConfig.selectors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const DELETE_UNDO_MS = 5000;

export function ChainsPage({ language, type }: { language: 'en' | 'ru'; type: 'dex' | 'cex' }) {
  const dispatch = useAppDispatch();
  const dexChainsFromStore = useAppSelector(selectChainsDataResponse);
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<{ id: string; name: string } | null>(null);
  /** Raw entity from API when editing (DEX: chain row, CEX: cex-chain row). */
  const [editingRaw, setEditingRaw] = useState<any>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(new Set());
  const [selectedChainIds, setSelectedChainIds] = useState<Set<number>>(new Set());
  const deleteTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const bulkDeleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingBulkDeleteRef = useRef<{ id: number; name: string }[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (type === 'cex') {
      if ((!cexChainsMeta.isLoaded || cexChainsMeta.error) && !cexChainsMeta.isLoading) {
        dispatch(dbConfigActions.setCexChainsData());
      }
      return;
    }

    if ((!chainsMeta.isLoaded || chainsMeta.error) && !chainsMeta.isLoading) {
      dispatch(dbConfigActions.setChainsData());
    }
  }, [
    cexChainsMeta.error,
    cexChainsMeta.isLoaded,
    cexChainsMeta.isLoading,
    chainsMeta.error,
    chainsMeta.isLoaded,
    chainsMeta.isLoading,
    dispatch,
    type,
  ]);

  useEffect(() => {
    return () => {
      deleteTimeoutsRef.current.forEach(clearTimeout);
      deleteTimeoutsRef.current.clear();
      if (bulkDeleteTimeoutRef.current) clearTimeout(bulkDeleteTimeoutRef.current);
    };
  }, []);

  const chains = useMemo(() => {
    const chainsFromStore = type === 'cex' ? cexChainsFromStore : dexChainsFromStore;
    return chainsFromStore
      .map((chain: any) => ({
        id: chain.chainId ?? chain.id,
        name: chain.name ?? chain.chainName ?? '',
        raw: chain,
      }))
      .filter((chain) => !pendingDeleteIds.has(chain.id));
  }, [cexChainsFromStore, dexChainsFromStore, pendingDeleteIds, type]);

  const allChainIds = useMemo(() => chains.map((chain) => chain.id), [chains]);
  const allSelected =
    type === 'cex' && allChainIds.length > 0 && allChainIds.every((id) => selectedChainIds.has(id));
  const someSelected = type === 'cex' && allChainIds.some((id) => selectedChainIds.has(id));

  useEffect(() => {
    if (type !== 'cex') return;
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected, type]);

  const toggleChain = useCallback((id: number) => {
    setSelectedChainIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllChains = useCallback(() => {
    setSelectedChainIds(allSelected ? new Set() : new Set(allChainIds));
  }, [allChainIds, allSelected]);

  const t = {
    en: {
      add: 'Add Chain',
      id: 'ID',
      name: 'Name',
      tableTitle: 'Chains',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
    },
    ru: {
      add: 'Добавить сеть',
      id: 'ID',
      name: 'Название',
      tableTitle: 'Цепочки',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
    },
  };

  const scheduleDelete = useCallback(
    (row: { id: number; name: string }) => {
      setPendingDeleteIds((prev) => new Set(prev).add(row.id));
      setSelectedChainIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const existing = deleteTimeoutsRef.current.get(row.id);
      if (existing) clearTimeout(existing);

      const tid = setTimeout(async () => {
        deleteTimeoutsRef.current.delete(row.id);
        try {
          if (type === 'cex') {
            const result = await apiService.bulkDeleteCexChains([row.id]);
            dispatch(dbConfigActions.removeCexChainsByIds(result.deletedIds ?? [row.id]));
          } else {
            await apiService.deletingChain(row.id);
            dispatch(dbConfigActions.refetchChainsData());
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          toast.error(message);
        } finally {
          setPendingDeleteIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        }
      }, DELETE_UNDO_MS);
      deleteTimeoutsRef.current.set(row.id, tid);

      showDeleteToast({
        itemName: row.name,
        itemType: language === 'en' ? 'Chain' : 'Сеть',
        onUndo: () => {
          const scheduled = deleteTimeoutsRef.current.get(row.id);
          if (scheduled) clearTimeout(scheduled);
          deleteTimeoutsRef.current.delete(row.id);
          setPendingDeleteIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, type],
  );

  const handleDeleteSelected = useCallback(() => {
    if (type !== 'cex' || selectedChainIds.size === 0) return;

    const toDelete = chains.filter((chain) => selectedChainIds.has(chain.id));
    const deleteIds = toDelete.map((row) => row.id);

    setPendingDeleteIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedChainIds(new Set());

    pendingBulkDeleteRef.current = toDelete;

    if (bulkDeleteTimeoutRef.current) clearTimeout(bulkDeleteTimeoutRef.current);

    bulkDeleteTimeoutRef.current = setTimeout(async () => {
      bulkDeleteTimeoutRef.current = null;
      const rows = pendingBulkDeleteRef.current;
      const rowIds = rows.map((row) => row.id);
      pendingBulkDeleteRef.current = [];

      try {
        const result = await apiService.bulkDeleteCexChains(rowIds);
        if (!result?.success) {
          throw new Error(language === 'ru' ? 'Не удалось удалить сети' : 'Failed to delete chains');
        }
        dispatch(dbConfigActions.removeCexChainsByIds(result.deletedIds ?? rowIds));
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message);
      } finally {
        setPendingDeleteIds((prev) => {
          const next = new Set(prev);
          rowIds.forEach((id) => next.delete(id));
          return next;
        });
      }
    }, DELETE_UNDO_MS);

    showBulkDeleteToast({
      count: toDelete.length,
      itemType: language === 'en' ? 'chains' : 'сетей',
      onUndo: () => {
        if (bulkDeleteTimeoutRef.current) {
          clearTimeout(bulkDeleteTimeoutRef.current);
          bulkDeleteTimeoutRef.current = null;
        }
        pendingBulkDeleteRef.current = [];
        setPendingDeleteIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [chains, dispatch, language, selectedChainIds, type]);

  const baseColumns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

  const columns: Column[] =
    type === 'cex'
      ? [
          {
            key: 'checkbox',
            label: '',
            headerRender: () => (
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllChains}
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
                checked={selectedChainIds.has(row.id)}
                onChange={() => toggleChain(row.id)}
                className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
                onClick={(event) => event.stopPropagation()}
              />
            ),
          },
          ...baseColumns,
        ]
      : baseColumns;

  const handleSave = async (data: { id: string; name: string }) => {
    try {
      const isEdit = Boolean(editingRaw);

      if (type === 'cex') {
        if (isEdit) {
          const id = Number(editingRaw.id ?? editingRaw.chainId);
          await apiService.editCexChain(id, { name: data.name });
        } else {
          await apiService.createCexChain({ name: data.name });
        }
        dispatch(dbConfigActions.refetchCexChainsData());
      } else {
        const newChainId = Number(data.id);
        if (!Number.isFinite(newChainId)) {
          return;
        }

        if (isEdit) {
          const currentId = Number(editingRaw.chainId ?? editingRaw.id);
          await apiService.editChain(currentId, { name: data.name, newChainId });
        } else {
          await apiService.createChain({ name: data.name, newChainId });
        }
        dispatch(dbConfigActions.refetchChainsData());
      }
    } finally {
      setFormInitial(null);
      setEditingRaw(null);
    }
  };

  const headerActions =
    type === 'cex' ? (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setEditingRaw(null);
            setFormInitial(null);
            setFormOpen(true);
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
              className="flex items-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded hover:bg-accent transition-colors"
            >
              <span className="text-sm">{t[language].actions}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={selectedChainIds.size === 0}
              variant="destructive"
              onClick={handleDeleteSelected}
            >
              {t[language].deleteSelected}
              {selectedChainIds.size > 0 ? ` (${selectedChainIds.size})` : ''}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ) : (
      <button
        onClick={() => {
          setEditingRaw(null);
          setFormInitial(null);
          setFormOpen(true);
        }}
        className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">{t[language].add}</span>
      </button>
    );

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={headerActions}
        columns={columns}
        data={chains}
        language={language}
        isLoading={type === 'cex' ? cexChainsMeta.isLoading : chainsMeta.isLoading}
        loadingText={type === 'cex' ? 'Loading CEX Chains…' : 'Loading DEX Chains…'}
        actionsColumnPosition={type === 'cex' ? 'last' : 'first'}
        getRowId={type === 'cex' ? (params) => String(params.data?.id ?? '') : undefined}
        onEdit={(row) => {
          setEditingRaw(row.raw ?? row);
          setFormInitial({ id: String(row.id ?? ''), name: row.name ?? '' });
          setFormOpen(true);
        }}
        onDelete={(row) => scheduleDelete(row)}
      />

      <ChainForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setFormInitial(null);
          setEditingRaw(null);
        }}
        onSave={handleSave}
        initialData={formInitial ?? undefined}
        language={language}
        chainKind={type === 'cex' ? 'cex' : 'dex'}
      />
    </div>
  );
}
