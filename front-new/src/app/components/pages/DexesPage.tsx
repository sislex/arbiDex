import { Menu, Plus } from 'lucide-react';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectDexesDataResponse, selectDexesMeta } from '../../store/db-config/dbConfig.selectors';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { apiService } from '../../services/api-service';
import { normalizeDexForStore } from '../../utils/dex';
import { DexForm } from '../forms/DexForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const DEXES_DELETE_SCOPE = 'dexes';

function mapDexRow(dex: any) {
  return {
    id: dex.dexId ?? dex.id,
    name: dex.name ?? dex.dexName ?? '',
    raw: dex,
  };
}

export function DexesPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const dexesRaw = useAppSelector(selectDexesDataResponse);
  const dexesMeta = useAppSelector(selectDexesMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDexRaw, setEditingDexRaw] = useState<any>(null);
  const [pendingDeleteDexIds, setPendingDeleteDexIds] = useState<Set<number>>(new Set());
  const [selectedDexIds, setSelectedDexIds] = useState<Set<number>>(new Set());
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapDexRow>[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const dexesFromStoreRef = useRef<any[] | null>(null);

  useEffect(() => {
    if ((!dexesMeta.isLoaded || dexesMeta.error) && !dexesMeta.isLoading) {
      dispatch(dbConfigActions.setDexesData());
    }
  }, [dexesMeta.error, dexesMeta.isLoaded, dexesMeta.isLoading, dispatch]);

  useEffect(() => {
    const prevStore = dexesFromStoreRef.current;
    const nextStore = dexesRaw;
    dexesFromStoreRef.current = nextStore;

    if (!prevStore) {
      setTableRows(nextStore.map(mapDexRow));
      return;
    }

    const prevLen = prevStore.length;
    const nextLen = nextStore.length;

    if (prevLen > 0 && nextLen < prevLen) {
      const nextIds = new Set(nextStore.map((dex: any) => Number(dex.dexId ?? dex.id)));
      setTableRows((current) => current.filter((row) => nextIds.has(row.id)));
      return;
    }

    if (prevLen === nextLen && prevStore === nextStore) {
      return;
    }

    setTableRows(nextStore.map(mapDexRow));
  }, [dexesRaw]);

  const visibleDexIds = useMemo(() => {
    if (pendingDeleteDexIds.size === 0) {
      return tableRows.map((dex) => dex.id);
    }
    const ids: number[] = [];
    for (const dex of tableRows) {
      if (!pendingDeleteDexIds.has(dex.id)) {
        ids.push(dex.id);
      }
    }
    return ids;
  }, [pendingDeleteDexIds, tableRows]);

  const allDexIds = visibleDexIds;
  const allSelected = allDexIds.length > 0 && allDexIds.every((id) => selectedDexIds.has(id));
  const someSelected = allDexIds.some((id) => selectedDexIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const updatePendingDeleteDexIds = useCallback((updater: (prev: Set<number>) => Set<number>) => {
    startTransition(() => {
      setPendingDeleteDexIds(updater);
    });
  }, []);

  const toggleDex = useCallback((id: number) => {
    setSelectedDexIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllDexes = useCallback(() => {
    setSelectedDexIds(allSelected ? new Set() : new Set(allDexIds));
  }, [allDexIds, allSelected]);

  const t = {
    en: {
      id: 'ID',
      name: 'Name',
      tableTitle: 'DEXes',
      add: 'Add DEX',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      deleteFailed: 'Failed to delete DEXes',
      deleteType: 'DEX',
    },
    ru: {
      id: 'ID',
      name: 'Название',
      tableTitle: 'DEX',
      add: 'Добавить DEX',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      deleteFailed: 'Не удалось удалить DEX',
      deleteType: 'DEX',
    },
  };

  const scheduleDelete = useCallback(
    (row: { id: number; name: string }) => {
      updatePendingDeleteDexIds((prev) => new Set(prev).add(row.id));
      setSelectedDexIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${DEXES_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteDexes([row.id]);
        dispatch(dbConfigActions.removeDexesByIds(result.deletedIds ?? [row.id]));
        updatePendingDeleteDexIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: row.name,
        itemType: t[language].deleteType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          updatePendingDeleteDexIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t, updatePendingDeleteDexIds],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedDexIds.size === 0) return;

    const deleteIds = [...selectedDexIds];

    updatePendingDeleteDexIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedDexIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(DEXES_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteDexes(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      dispatch(dbConfigActions.removeDexesByIds(result.deletedIds ?? deleteIds));
      updatePendingDeleteDexIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: deleteIds.length,
      itemType: language === 'en' ? 'DEXes' : 'DEX',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        updatePendingDeleteDexIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dispatch, language, selectedDexIds, t, updatePendingDeleteDexIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllDexes}
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
          checked={selectedDexIds.has(row.id)}
          onChange={() => toggleDex(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingDexRaw(null);
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
                  disabled={selectedDexIds.size === 0}
                  variant="destructive"
                  onClick={handleDeleteSelected}
                >
                  {t[language].deleteSelected}
                  {selectedDexIds.size > 0 ? ` (${selectedDexIds.size})` : ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        columns={columns}
        data={tableRows}
        excludeRowIds={pendingDeleteDexIds}
        getExcludeRowId={(row) => row.id}
        language={language}
        isLoading={dexesMeta.isLoading}
        loadingText="Loading DEXes…"
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
        onEdit={(row) => {
          setEditingDexRaw(row.raw ?? row);
          setFormOpen(true);
        }}
        onDelete={scheduleDelete}
      />

      <DexForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingDexRaw(null);
        }}
        onSave={async (data) => {
          const id = Number(editingDexRaw?.dexId ?? editingDexRaw?.id);
          const saved = Number.isFinite(id)
            ? await apiService.editDex(id, { dexId: id, name: data.name.trim() })
            : await apiService.createDex({ name: data.name.trim() });
          dispatch(dbConfigActions.upsertDex({ dex: normalizeDexForStore(saved) }));
        }}
        initialData={
          editingDexRaw
            ? {
                name: editingDexRaw.name ?? editingDexRaw.dexName ?? '',
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
