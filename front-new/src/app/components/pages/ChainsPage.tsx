import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, Column } from '../DataTable';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChainForm } from '../forms/ChainForm';
import { showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { apiService } from '../../services/api-service';
import {
  selectCexChainsDataResponse,
  selectCexChainsMeta,
  selectChainsDataResponse,
  selectChainsMeta,
} from '../../store/db-config/dbConfig.selectors';

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
  const deleteTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

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

  const t = {
    en: {
      add: 'Add Chain',
      id: 'ID',
      name: 'Name',
      tableTitle: 'Chains',
    },
    ru: {
      add: 'Добавить сеть',
      id: 'ID',
      name: 'Название',
      tableTitle: 'Цепочки',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

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

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
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
        }
        columns={columns}
        data={chains}
        language={language}
        isLoading={type === 'cex' ? cexChainsMeta.isLoading : chainsMeta.isLoading}
        loadingText={type === 'cex' ? 'Loading CEX Chains…' : 'Loading DEX Chains…'}
        onEdit={(row) => {
          setEditingRaw(row.raw ?? row);
          setFormInitial({ id: String(row.id ?? ''), name: row.name ?? '' });
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setPendingDeleteIds((prev) => new Set(prev).add(row.id));
          const existing = deleteTimeoutsRef.current.get(row.id);
          if (existing) clearTimeout(existing);

          const tid = setTimeout(async () => {
            deleteTimeoutsRef.current.delete(row.id);
            try {
              if (type === 'cex') {
                await apiService.deletingCexChain(row.id);
                dispatch(dbConfigActions.refetchCexChainsData());
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
        }}
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
