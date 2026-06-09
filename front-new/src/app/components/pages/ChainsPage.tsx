import { Menu, Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChainForm } from '../forms/ChainForm';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
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

export function ChainsPage({ language, type }: { language: 'en' | 'ru'; type: 'dex' | 'cex' }) {
  const deleteScope = type === 'cex' ? 'cex-chains' : 'chains';
  const dispatch = useAppDispatch();
  const dexChainsFromStore = useAppSelector(selectChainsDataResponse);
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitial, setFormInitial] = useState<{ id: string; name: string } | null>(null);
  const [editingRaw, setEditingRaw] = useState<any>(null);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<Set<number>>(new Set());
  const [selectedChainIds, setSelectedChainIds] = useState<Set<number>>(new Set());
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
  const allSelected = allChainIds.length > 0 && allChainIds.every((id) => selectedChainIds.has(id));
  const someSelected = allChainIds.some((id) => selectedChainIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

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
      tableTitle: type === 'cex' ? 'CEX Chains' : 'DEX Chains',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      chainType: 'Chain',
      bulkType: 'chains',
      deleteFailed: 'Failed to delete chains',
    },
    ru: {
      add: 'Добавить сеть',
      id: 'ID',
      name: 'Название',
      tableTitle: type === 'cex' ? 'CEX-сети' : 'DEX-сети',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      chainType: 'Сеть',
      bulkType: 'сетей',
      deleteFailed: 'Не удалось удалить сети',
    },
  };

  const removeChainsFromStore = useCallback(
    (ids: number[]) => {
      if (type === 'cex') {
        dispatch(dbConfigActions.removeCexChainsByIds(ids));
      } else {
        dispatch(dbConfigActions.removeChainsByIds(ids));
      }
    },
    [dispatch, type],
  );

  const bulkDeleteChains = useCallback(
    async (ids: number[]) => {
      if (type === 'cex') {
        return apiService.bulkDeleteCexChains(ids);
      }
      return apiService.bulkDeleteChains(ids);
    },
    [type],
  );

  const scheduleDelete = useCallback(
    (row: { id: number; name: string }) => {
      setPendingDeleteIds((prev) => new Set(prev).add(row.id));
      setSelectedChainIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${deleteScope}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await bulkDeleteChains([row.id]);
        removeChainsFromStore(result.deletedIds ?? [row.id]);
        setPendingDeleteIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: row.name,
        itemType: t[language].chainType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          setPendingDeleteIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [bulkDeleteChains, deleteScope, language, removeChainsFromStore, t],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedChainIds.size === 0) return;

    const toDelete = chains.filter((chain) => selectedChainIds.has(chain.id));
    const deleteIds = toDelete.map((row) => row.id);

    setPendingDeleteIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedChainIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(deleteScope, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await bulkDeleteChains(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      removeChainsFromStore(result.deletedIds ?? deleteIds);
      setPendingDeleteIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: toDelete.length,
      itemType: t[language].bulkType,
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        setPendingDeleteIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [bulkDeleteChains, chains, deleteScope, language, removeChainsFromStore, selectedChainIds, t]);

  const columns: Column[] = [
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
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

  const handleSave = async (data: { id: string; name: string }) => {
    try {
      const isEdit = Boolean(editingRaw);

      if (type === 'cex') {
        const saved = isEdit
          ? await apiService.editCexChain(Number(editingRaw.id ?? editingRaw.chainId), {
              name: data.name,
            })
          : await apiService.createCexChain({ name: data.name });
        dispatch(dbConfigActions.upsertCexChain({ chain: saved }));
      } else {
        const newChainId = Number(data.id);
        if (!Number.isFinite(newChainId)) {
          return;
        }

        const previousId = isEdit ? Number(editingRaw.chainId ?? editingRaw.id) : undefined;
        const saved = isEdit
          ? await apiService.editChain(previousId!, { name: data.name, newChainId })
          : await apiService.createChain({ name: data.name, newChainId });
        dispatch(dbConfigActions.upsertChain({ chain: saved, previousId }));
      }
    } finally {
      setFormInitial(null);
      setEditingRaw(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
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
                  className="flex items-center justify-center p-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
                  aria-label={t[language].actions}
                  title={t[language].actions}
                >
                  <Menu className="w-4 h-4" />
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
        }
        columns={columns}
        data={chains}
        language={language}
        isLoading={type === 'cex' ? cexChainsMeta.isLoading : chainsMeta.isLoading}
        loadingText={type === 'cex' ? 'Loading CEX Chains…' : 'Loading DEX Chains…'}
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
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
