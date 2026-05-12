import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useMemo, useState } from 'react';
import { ChainForm } from '../forms/ChainForm';
import { showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectChainsDataResponse, selectChainsMeta } from '../../store/db-config/dbConfig.selectors';

export function ChainsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const chainsFromStore = useAppSelector(selectChainsDataResponse);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deletedChainIds, setDeletedChainIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if ((!chainsMeta.isLoaded || chainsMeta.error) && !chainsMeta.isLoading) {
      dispatch(dbConfigActions.setChainsData());
    }
  }, [chainsMeta.error, chainsMeta.isLoaded, chainsMeta.isLoading, dispatch]);

  const chains = useMemo(() => {
    return chainsFromStore
      .map((chain: any) => ({
        id: chain.chainId ?? chain.id,
        name: chain.name ?? chain.chainName ?? '',
        raw: chain,
      }))
      .filter((chain) => !deletedChainIds.has(chain.id));
  }, [chainsFromStore, deletedChainIds]);

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

  const handleSave = (data: any) => {
    console.log('Chain saved', data);
    setEditData(null);
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
        onEdit={(row) => {
          setEditData(row.raw ?? row);
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
