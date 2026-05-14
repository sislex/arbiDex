import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectChainsMeta,
  selectRpcUrlDataResponse,
  selectRpcUrlsMeta,
} from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';
import { apiService } from '../../services/api-service';
import { RpcUrlForm } from '../forms/RpcUrlForm';

const DELETE_UNDO_MS = 5000;

export function RpcUrlsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const rpcUrlsFromStore = useAppSelector(selectRpcUrlDataResponse);
  const chains = useAppSelector(selectChainsDataResponse);
  const rpcUrlsMeta = useAppSelector(selectRpcUrlsMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRpcRaw, setEditingRpcRaw] = useState<any>(null);
  const [pendingDeleteRpcIds, setPendingDeleteRpcIds] = useState<Set<number>>(new Set());
  const deleteRpcTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if ((!rpcUrlsMeta.isLoaded || rpcUrlsMeta.error) && !rpcUrlsMeta.isLoading) {
      dispatch(dbConfigActions.setRpcUrlsData());
    }
    if ((!chainsMeta.isLoaded || chainsMeta.error) && !chainsMeta.isLoading) {
      dispatch(dbConfigActions.setChainsData());
    }
  }, [chainsMeta.error, chainsMeta.isLoaded, chainsMeta.isLoading, dispatch, rpcUrlsMeta.error, rpcUrlsMeta.isLoaded, rpcUrlsMeta.isLoading]);

  const chainById = useMemo(() => {
    return new Map(chains.map((chain: any) => [chain.chainId ?? chain.id, chain.name]));
  }, [chains]);

  const rpcUrls = useMemo(() => {
    return rpcUrlsFromStore
      .map((rpcUrl: any) => ({
      id: rpcUrl.rpcUrlId ?? rpcUrl.id,
      rpcUrl: rpcUrl.rpcUrl ?? rpcUrl.url ?? '',
      chainName: rpcUrl.chainName ?? chainById.get(rpcUrl.chainId) ?? rpcUrl.chainId ?? '',
      raw: rpcUrl,
      }))
      .filter((row) => !pendingDeleteRpcIds.has(row.id));
  }, [chainById, pendingDeleteRpcIds, rpcUrlsFromStore]);

  useEffect(() => {
    return () => {
      deleteRpcTimeoutsRef.current.forEach(clearTimeout);
      deleteRpcTimeoutsRef.current.clear();
    };
  }, []);

  const t = {
    en: {
      rpcUrlId: 'Rpc Url ID',
      rpcUrl: 'Rpc Url',
      chainName: 'Chain Name',
      tableTitle: 'RPC URLs',
    },
    ru: {
      rpcUrlId: 'ID RPC',
      rpcUrl: 'RPC URL',
      chainName: 'Сеть',
      tableTitle: 'RPC URL',
    },
  };

  const columns: Column[] = [
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
          <button
            onClick={() => {
              setEditingRpcRaw(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Add RPC Url' : 'Добавить RPC Url'}</span>
          </button>
        }
        columns={columns}
        data={rpcUrls}
        language={language}
        isLoading={rpcUrlsMeta.isLoading || chainsMeta.isLoading}
        loadingText="Loading RPC URLs…"
        onEdit={(row) => {
          setEditingRpcRaw(row.raw ?? row);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setPendingDeleteRpcIds((prev) => new Set(prev).add(row.id));
          const existing = deleteRpcTimeoutsRef.current.get(row.id);
          if (existing) clearTimeout(existing);

          const tid = setTimeout(async () => {
            deleteRpcTimeoutsRef.current.delete(row.id);
            try {
              await apiService.deletingRpcUrl(row.id);
              dispatch(dbConfigActions.refetchRpcUrlsData());
            } finally {
              setPendingDeleteRpcIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            }
          }, DELETE_UNDO_MS);
          deleteRpcTimeoutsRef.current.set(row.id, tid);

          showDeleteToast({
            itemName: row.rpcUrl,
            itemType: language === 'en' ? 'Rpc Url' : 'Rpc Url',
            onUndo: () => {
              const scheduled = deleteRpcTimeoutsRef.current.get(row.id);
              if (scheduled) clearTimeout(scheduled);
              deleteRpcTimeoutsRef.current.delete(row.id);
              setPendingDeleteRpcIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            },
            language,
          });
        }}
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
          if (editingRpcRaw) {
            const id = Number(editingRpcRaw.rpcUrlId ?? editingRpcRaw.id);
            await apiService.editRpcUrl(id, payload);
          } else {
            await apiService.createRpcUrl(payload);
          }
          dispatch(dbConfigActions.refetchRpcUrlsData());
          dispatch(dbConfigActions.refetchChainsData());
        }}
        initialData={
          editingRpcRaw
            ? {
                chainId: String(editingRpcRaw.chainId ?? ''),
                rpcUrl: editingRpcRaw.rpcUrl ?? editingRpcRaw.url ?? '',
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
