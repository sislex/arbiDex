import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectDexesDataResponse, selectDexesMeta } from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';
import { apiService } from '../../services/api-service';
import { DexForm } from '../forms/DexForm';

const DELETE_UNDO_MS = 5000;

export function DexesPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const dexesFromStore = useAppSelector(selectDexesDataResponse);
  const dexesMeta = useAppSelector(selectDexesMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editingDexRaw, setEditingDexRaw] = useState<any>(null);
  const [pendingDeleteDexIds, setPendingDeleteDexIds] = useState<Set<number>>(new Set());
  const deleteDexTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

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
      .filter((dex) => !pendingDeleteDexIds.has(dex.id));
  }, [dexesFromStore, pendingDeleteDexIds]);

  useEffect(() => {
    return () => {
      deleteDexTimeoutsRef.current.forEach(clearTimeout);
      deleteDexTimeoutsRef.current.clear();
    };
  }, []);

  const t = {
    en: {
      id: 'ID',
      name: 'Name',
      tableTitle: 'DEXes',
    },
    ru: {
      id: 'ID',
      name: 'Название',
      tableTitle: 'DEX',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
          <button
            onClick={() => {
              setEditingDexRaw(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{language === 'en' ? 'Add DEX' : 'Добавить DEX'}</span>
          </button>
        }
        columns={columns}
        data={dexes}
        language={language}
        isLoading={dexesMeta.isLoading}
        loadingText="Loading DEXes…"
        onEdit={(row) => {
          // Keep normalized row (with guaranteed `id`) to avoid losing identifier on save.
          setEditingDexRaw(row);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setPendingDeleteDexIds((prev) => new Set(prev).add(row.id));
          const existing = deleteDexTimeoutsRef.current.get(row.id);
          if (existing) clearTimeout(existing);

          const tid = setTimeout(async () => {
            deleteDexTimeoutsRef.current.delete(row.id);
            try {
              await apiService.deletingDex(row.id);
              dispatch(dbConfigActions.refetchDexesData());
            } finally {
              setPendingDeleteDexIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            }
          }, DELETE_UNDO_MS);
          deleteDexTimeoutsRef.current.set(row.id, tid);

          showDeleteToast({
            itemName: row.name,
            itemType: 'DEX',
            onUndo: () => {
              const scheduled = deleteDexTimeoutsRef.current.get(row.id);
              if (scheduled) clearTimeout(scheduled);
              deleteDexTimeoutsRef.current.delete(row.id);
              setPendingDeleteDexIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            },
            language,
          });
        }}
      />

      <DexForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingDexRaw(null);
        }}
        onSave={async (data) => {
          const id = Number(editingDexRaw?.id ?? editingDexRaw?.dexId);
          if (Number.isFinite(id)) {
            const payload = { dexId: id, name: data.name.trim() };
            await apiService.editDex(id, payload);
          } else {
            const payload = { name: data.name.trim() };
            await apiService.createDex(payload);
          }
          dispatch(dbConfigActions.refetchDexesData());
        }}
        initialData={
          editingDexRaw
            ? {
                name: editingDexRaw.name ?? editingDexRaw.raw?.name ?? editingDexRaw.raw?.dexName ?? '',
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
