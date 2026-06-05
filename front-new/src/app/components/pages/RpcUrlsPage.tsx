import { Menu, Plus } from 'lucide-react';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectChainsMeta,
  selectRpcUrlDataResponse,
  selectRpcUrlsMeta,
} from '../../store/db-config/dbConfig.selectors';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { apiService } from '../../services/api-service';
import { normalizeRpcUrlForStore } from '../../utils/rpcUrl';
import { RpcUrlForm } from '../forms/RpcUrlForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const RPC_URLS_DELETE_SCOPE = 'rpc-urls';

function mapRpcUrlRow(rpcUrl: any, rawRpcUrl?: any) {
  return {
    id: rpcUrl.rpcUrlId ?? rpcUrl.id,
    rpcUrl: rpcUrl.rpcUrl ?? rpcUrl.url ?? '',
    chainName: rpcUrl.chainName ?? rpcUrl.chainId ?? '',
    raw: rawRpcUrl ?? rpcUrl,
  };
}

export function RpcUrlsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const rpcUrlsRaw = useAppSelector(selectRpcUrlDataResponse);
  const chainsRaw = useAppSelector(selectChainsDataResponse);
  const rpcUrlsMeta = useAppSelector(selectRpcUrlsMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRpcRaw, setEditingRpcRaw] = useState<any>(null);
  const [pendingDeleteRpcIds, setPendingDeleteRpcIds] = useState<Set<number>>(new Set());
  const [selectedRpcIds, setSelectedRpcIds] = useState<Set<number>>(new Set());
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapRpcUrlRow>[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const rpcUrlsFromStoreRef = useRef<any[] | null>(null);

  useEffect(() => {
    if ((!rpcUrlsMeta.isLoaded || rpcUrlsMeta.error) && !rpcUrlsMeta.isLoading) {
      dispatch(dbConfigActions.setRpcUrlsData());
    }
    if ((!chainsMeta.isLoaded || chainsMeta.error) && !chainsMeta.isLoading) {
      dispatch(dbConfigActions.setChainsData());
    }
  }, [
    chainsMeta.error,
    chainsMeta.isLoaded,
    chainsMeta.isLoading,
    dispatch,
    rpcUrlsMeta.error,
    rpcUrlsMeta.isLoaded,
    rpcUrlsMeta.isLoading,
  ]);

  const chainNameById = useMemo(() => {
    const map = new Map<number, string>();
    chainsRaw.forEach((chain: any) => {
      const id = Number(chain.chainId ?? chain.id);
      if (Number.isFinite(id)) {
        map.set(id, chain.name ?? chain.chainName ?? String(id));
      }
    });
    return map;
  }, [chainsRaw]);

  const enrichRpcUrlRow = useCallback(
    (rpcUrl: any) =>
      mapRpcUrlRow(
        {
          ...rpcUrl,
          chainName: chainNameById.get(Number(rpcUrl.chainId ?? rpcUrl.chain?.chainId)) ?? rpcUrl.chainId,
        },
        rpcUrl,
      ),
    [chainNameById],
  );

  useEffect(() => {
    const prevStore = rpcUrlsFromStoreRef.current;
    const nextStore = rpcUrlsRaw;
    rpcUrlsFromStoreRef.current = nextStore;

    if (!prevStore) {
      setTableRows(nextStore.map(enrichRpcUrlRow));
      return;
    }

    const prevLen = prevStore.length;
    const nextLen = nextStore.length;

    if (prevLen > 0 && nextLen < prevLen) {
      const nextIds = new Set(nextStore.map((rpc: any) => Number(rpc.rpcUrlId ?? rpc.id)));
      setTableRows((current) => current.filter((row) => nextIds.has(row.id)));
      return;
    }

    if (prevLen === nextLen && prevStore === nextStore) {
      return;
    }

    setTableRows(nextStore.map(enrichRpcUrlRow));
  }, [enrichRpcUrlRow, rpcUrlsRaw]);

  const visibleRpcIds = useMemo(() => {
    if (pendingDeleteRpcIds.size === 0) {
      return tableRows.map((row) => row.id);
    }
    const ids: number[] = [];
    for (const row of tableRows) {
      if (!pendingDeleteRpcIds.has(row.id)) {
        ids.push(row.id);
      }
    }
    return ids;
  }, [pendingDeleteRpcIds, tableRows]);

  const allRpcIds = visibleRpcIds;
  const allSelected = allRpcIds.length > 0 && allRpcIds.every((id) => selectedRpcIds.has(id));
  const someSelected = allRpcIds.some((id) => selectedRpcIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const updatePendingDeleteRpcIds = useCallback((updater: (prev: Set<number>) => Set<number>) => {
    startTransition(() => {
      setPendingDeleteRpcIds(updater);
    });
  }, []);

  const toggleRpc = useCallback((id: number) => {
    setSelectedRpcIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllRpcUrls = useCallback(() => {
    setSelectedRpcIds(allSelected ? new Set() : new Set(allRpcIds));
  }, [allRpcIds, allSelected]);

  const t = {
    en: {
      rpcUrlId: 'Rpc Url ID',
      rpcUrl: 'Rpc Url',
      chainName: 'Chain Name',
      tableTitle: 'RPC URLs',
      add: 'Add RPC Url',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      deleteFailed: 'Failed to delete RPC URLs',
      deleteType: 'Rpc Url',
    },
    ru: {
      rpcUrlId: 'ID RPC',
      rpcUrl: 'RPC URL',
      chainName: 'Сеть',
      tableTitle: 'RPC URL',
      add: 'Добавить RPC Url',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      deleteFailed: 'Не удалось удалить RPC URL',
      deleteType: 'Rpc Url',
    },
  };

  const scheduleDelete = useCallback(
    (row: { id: number; rpcUrl: string }) => {
      updatePendingDeleteRpcIds((prev) => new Set(prev).add(row.id));
      setSelectedRpcIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${RPC_URLS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteRpcUrls([row.id]);
        dispatch(dbConfigActions.removeRpcUrlsByIds(result.deletedIds ?? [row.id]));
        updatePendingDeleteRpcIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: row.rpcUrl,
        itemType: t[language].deleteType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          updatePendingDeleteRpcIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t, updatePendingDeleteRpcIds],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedRpcIds.size === 0) return;

    const deleteIds = [...selectedRpcIds];

    updatePendingDeleteRpcIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedRpcIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(RPC_URLS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteRpcUrls(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      dispatch(dbConfigActions.removeRpcUrlsByIds(result.deletedIds ?? deleteIds));
      updatePendingDeleteRpcIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: deleteIds.length,
      itemType: language === 'en' ? 'RPC URLs' : 'RPC URL',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        updatePendingDeleteRpcIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dispatch, language, selectedRpcIds, t, updatePendingDeleteRpcIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllRpcUrls}
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
          checked={selectedRpcIds.has(row.id)}
          onChange={() => toggleRpc(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    { key: 'id', label: t[language].rpcUrlId, sortable: true, filterable: true },
    {
      key: 'rpcUrl',
      label: t[language].rpcUrl,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingRpcRaw(null);
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
                  disabled={selectedRpcIds.size === 0}
                  variant="destructive"
                  onClick={handleDeleteSelected}
                >
                  {t[language].deleteSelected}
                  {selectedRpcIds.size > 0 ? ` (${selectedRpcIds.size})` : ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        columns={columns}
        data={tableRows}
        excludeRowIds={pendingDeleteRpcIds}
        getExcludeRowId={(row) => row.id}
        language={language}
        isLoading={rpcUrlsMeta.isLoading || chainsMeta.isLoading}
        loadingText="Loading RPC URLs…"
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
        onEdit={(row) => {
          setEditingRpcRaw(row.raw ?? row);
          setFormOpen(true);
        }}
        onDelete={scheduleDelete}
      />

      <RpcUrlForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingRpcRaw(null);
        }}
        onSave={async (data) => {
          const payload = {
            chainId: Number(data.chainId),
            rpcUrl: data.rpcUrl.trim(),
          };
          const saved = editingRpcRaw
            ? await apiService.editRpcUrl(Number(editingRpcRaw.rpcUrlId ?? editingRpcRaw.id), payload)
            : await apiService.createRpcUrl(payload);
          dispatch(dbConfigActions.upsertRpcUrl({ rpcUrl: normalizeRpcUrlForStore(saved) }));
        }}
        initialData={
          editingRpcRaw
            ? {
                chainId: String(editingRpcRaw.chainId ?? editingRpcRaw.chain?.chainId ?? ''),
                rpcUrl: editingRpcRaw.rpcUrl ?? editingRpcRaw.url ?? '',
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
