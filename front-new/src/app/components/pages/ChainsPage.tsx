import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useMemo, useState } from 'react';
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

export function ChainsPage({ language, type }: { language: 'en' | 'ru'; type: 'dex' | 'cex' }) {
  const dispatch = useAppDispatch();
  const dexChainsFromStore = useAppSelector(selectChainsDataResponse);
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deletedChainIds, setDeletedChainIds] = useState<Set<number>>(new Set());

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
      .filter((chain) => !deletedChainIds.has(chain.id));
  }, [cexChainsFromStore, deletedChainIds, dexChainsFromStore, type]);

  const t = {
    en: {
      add: 'Add Chain',
      id: 'ID',
      name: 'Name',
    },
    ru: {
      add: 'Добавить сеть',
      id: 'ID',
      name: 'Название',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

  const handleSave = async (data: any) => {
    try {
      const raw = editData?.__raw;
      const idFromRaw = raw?.chainId ?? raw?.id;
      const idParsed = Number(data?.id);
      const hasNumericId = Number.isFinite(idFromRaw) || Number.isFinite(idParsed);
      const editId = Number.isFinite(idFromRaw) ? Number(idFromRaw) : Number(idParsed);

      if (type === 'cex') {
        if (raw || (hasNumericId && editId)) {
          await apiService.editCexChain(editId, { name: data?.name });
        } else {
          await apiService.createCexChain(Number.isFinite(idParsed) ? { chainId: idParsed, name: data?.name } : { id: data?.id, name: data?.name });
        }
        dispatch(dbConfigActions.setCexChainsData());
      } else {
        if (raw || (hasNumericId && editId)) {
          await apiService.editChain(editId, { name: data?.name });
        } else {
          await apiService.createChain(Number.isFinite(idParsed) ? { chainId: idParsed, name: data?.name } : { id: data?.id, name: data?.name });
        }
        dispatch(dbConfigActions.setChainsData());
      }
    } finally {
      setEditData(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center justify-end px-4">
        <button
          onClick={() => {
            setEditData(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t[language].add}</span>
        </button>
      </div>

      <DataTable
        title="Chains"
        columns={columns}
        data={chains}
        isLoading={type === 'cex' ? cexChainsMeta.isLoading : chainsMeta.isLoading}
        loadingText={type === 'cex' ? 'Loading CEX Chains…' : 'Loading DEX Chains…'}
        onEdit={(row) => {
          setEditData({ id: String(row.id ?? ''), name: row.name ?? '', __raw: row.raw ?? row });
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setDeletedChainIds(new Set([...deletedChainIds, row.id]));
          showDeleteToast({
            itemName: row.name,
            itemType: language === 'en' ? 'Chain' : 'Сеть',
            onUndo: () => {
              const next = new Set(deletedChainIds);
              next.delete(row.id);
              setDeletedChainIds(next);
            },
            language,
          });
        }}
      />

      <ChainForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialData={editData}
        language={language}
      />
    </div>
  );
}
