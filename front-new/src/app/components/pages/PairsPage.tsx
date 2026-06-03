import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { showDeleteToast } from '../../utils/toast';
import { CexPairForm } from '../forms/CexPairForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { apiService } from '../../services/api-service';
import { buildCexChainNameById, resolveCexPairSourceLabel } from '../../utils/cexPairSource';
import {
  selectCexChainsDataResponse,
  selectCexChainsMeta,
  selectCexPairsMeta,
  selectCexPairsDataResponse,
} from '../../store/db-config/dbConfig.selectors';

const DELETE_UNDO_MS = 5000;

interface PairsPageProps {
  language: 'en' | 'ru';
}

export function PairsPage({ language }: PairsPageProps) {
  const dispatch = useAppDispatch();
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const cexPairsFromStore = useAppSelector(selectCexPairsDataResponse);
  const cexPairsMeta = useAppSelector(selectCexPairsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCexPairRaw, setEditingCexPairRaw] = useState<any>(null);
  const [pendingDeleteCexPairIds, setPendingDeleteCexPairIds] = useState<Set<number>>(new Set());
  const deleteCexPairTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if ((!cexPairsMeta.isLoaded || cexPairsMeta.error) && !cexPairsMeta.isLoading) {
      dispatch(dbConfigActions.initCexPairsPage());
    }
  }, [cexPairsMeta.error, cexPairsMeta.isLoaded, cexPairsMeta.isLoading, dispatch]);

  useEffect(() => {
    return () => {
      deleteCexPairTimeoutsRef.current.forEach(clearTimeout);
      deleteCexPairTimeoutsRef.current.clear();
    };
  }, []);

  const cexChainNameById = useMemo(() => buildCexChainNameById(cexChainsFromStore), [cexChainsFromStore]);

  const cexPairs = useMemo(() => {
    return cexPairsFromStore.map((pair: any) => ({
      id: pair.id ?? pair.pairId ?? pair.cexPairId ?? pair.cex_pair_id,
      source: resolveCexPairSourceLabel(pair, cexChainNameById),
      token0: pair.token0 ?? pair.token0Symbol ?? pair.baseToken ?? '',
      token1: pair.token1 ?? pair.token1Symbol ?? pair.quoteToken ?? '',
      raw: pair,
    }));
  }, [cexChainNameById, cexPairsFromStore]);

  const t = {
    en: {
      add: 'Add CEX Pair',
      pairId: 'Pair ID',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      tableTitle: 'CEX pairs',
    },
    ru: {
      add: 'Добавить CEX пару',
      pairId: 'ID пары',
      source: 'Источник',
      token0: 'Токен 0',
      token1: 'Токен 1',
      tableTitle: 'CEX пары',
    },
  };

  const cexPairsColumns: Column[] = [
    {
      key: 'id',
      label: t[language].pairId,
      sortable: true,
      filterable: true,
    },
    {
      key: 'source',
      label: t[language].source,
      sortable: true,
      filterable: true,
    },
    {
      key: 'token0',
      label: t[language].token0,
      sortable: true,
      filterable: true,
    },
    {
      key: 'token1',
      label: t[language].token1,
      sortable: true,
      filterable: true,
    },
  ];

  const tableData = cexPairs.filter((p) => !pendingDeleteCexPairIds.has(p.id));
  const isTableLoading = cexPairsMeta.isLoading || cexChainsMeta.isLoading;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="text-foreground" />
        <button
          onClick={() => {
            setEditingCexPairRaw(null);
            setAddDialogOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t[language].add}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <DataTable
          title={t[language].tableTitle}
          columns={cexPairsColumns}
          data={tableData}
          language={language}
          isLoading={isTableLoading}
          loadingText={language === 'ru' ? 'Загрузка CEX пар…' : 'Loading CEX Pairs…'}
          onEdit={(row) => {
            setEditingCexPairRaw(row.raw);
            setAddDialogOpen(true);
          }}
          onDelete={(row) => {
            setPendingDeleteCexPairIds((prev) => new Set(prev).add(row.id));
            const existing = deleteCexPairTimeoutsRef.current.get(row.id);
            if (existing) clearTimeout(existing);

            const tid = setTimeout(async () => {
              deleteCexPairTimeoutsRef.current.delete(row.id);
              try {
                await apiService.deletingCexPair(row.id);
                dispatch(dbConfigActions.refetchCexPairsPageResources());
              } finally {
                setPendingDeleteCexPairIds((prev) => {
                  const next = new Set(prev);
                  next.delete(row.id);
                  return next;
                });
              }
            }, DELETE_UNDO_MS);
            deleteCexPairTimeoutsRef.current.set(row.id, tid);

            showDeleteToast({
              itemName: `${row.token0}/${row.token1}`,
              itemType: language === 'en' ? 'Pair' : 'Пара',
              onUndo: () => {
                const scheduled = deleteCexPairTimeoutsRef.current.get(row.id);
                if (scheduled) clearTimeout(scheduled);
                deleteCexPairTimeoutsRef.current.delete(row.id);
                setPendingDeleteCexPairIds((prev) => {
                  const next = new Set(prev);
                  next.delete(row.id);
                  return next;
                });
              },
              language,
            });
          }}
        />
      </div>

      <CexPairForm
        open={addDialogOpen}
        onClose={() => {
          setAddDialogOpen(false);
          setEditingCexPairRaw(null);
        }}
        onSave={async (data) => {
          const payload = {
            source: Number(data.sourceId),
            token0: data.token0Symbol,
            token1: data.token1Symbol,
          };
          if (editingCexPairRaw) {
            const id = Number(
              editingCexPairRaw.id ?? editingCexPairRaw.pairId ?? editingCexPairRaw.cexPairId ?? editingCexPairRaw.cex_pair_id,
            );
            await apiService.editCexPair(id, payload);
          } else {
            await apiService.createCexPair(payload);
          }
          dispatch(dbConfigActions.refetchCexPairsPageResources());
        }}
        initialData={
          editingCexPairRaw
            ? {
                sourceId: String(editingCexPairRaw.source ?? ''),
                token0Symbol: editingCexPairRaw.token0 ?? editingCexPairRaw.token0Symbol ?? '',
                token1Symbol: editingCexPairRaw.token1 ?? editingCexPairRaw.token1Symbol ?? '',
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
