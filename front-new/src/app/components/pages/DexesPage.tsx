import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectDexesDataResponse, selectDexesMeta } from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';

export function DexesPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const dexesFromStore = useAppSelector(selectDexesDataResponse);
  const dexesMeta = useAppSelector(selectDexesMeta);
  const [deletedDexIds, setDeletedDexIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if ((!dexesMeta.isLoaded || dexesMeta.error) && !dexesMeta.isLoading) {
      dispatch(dbConfigActions.setDexesData());
    }
  }, [dexesMeta.error, dexesMeta.isLoaded, dexesMeta.isLoading, dispatch]);

  const dexes = useMemo(() => {
    return dexesFromStore
      .map((dex: any) => ({
        id: dex.dexId ?? dex.id,
        name: dex.name ?? dex.dexName ?? '',
        raw: dex,
      }))
      .filter((dex) => !deletedDexIds.has(dex.id));
  }, [deletedDexIds, dexesFromStore]);

  const t = {
    en: {
      id: 'ID',
      name: 'Name',
    },
    ru: {
      id: 'ID',
      name: 'Name',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title="DEXes"
        columns={columns}
        data={dexes}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => {
          setDeletedDexIds(new Set([...deletedDexIds, row.id]));
          showDeleteToast({
            itemName: row.name,
            itemType: 'DEX',
            onUndo: () => {
              const next = new Set(deletedDexIds);
              next.delete(row.id);
              setDeletedDexIds(next);
            },
            language,
          });
        }}
      />
    </div>
  );
}
