import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tabs } from '../Tabs';
import { DataTable, Column } from '../DataTable';
import { Autocomplete } from '../Autocomplete';
import { showDeleteToast } from '../../utils/toast';
import { CexPairForm } from '../forms/CexPairForm';
import { DexPairForm } from '../forms/DexPairForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { apiService } from '../../services/api-service';
import { buildCexChainNameById, resolveCexPairSourceLabel } from '../../utils/cexPairSource';
import {
  selectCexChainsDataResponse,
  selectCexPairsMeta,
  selectCexPairsDataResponse,
  selectPairsMeta,
  selectPairsFullData,
  selectPairsRating,
  selectTokenInList,
} from '../../store/db-config/dbConfig.selectors';

const DELETE_UNDO_MS = 5000;

interface PairsPageProps {
  language: 'en' | 'ru';
  type: 'dex' | 'cex';
}

export function PairsPage({ language, type }: PairsPageProps) {
  const dispatch = useAppDispatch();
  const dexPairsFromStore = useAppSelector(selectPairsFullData);
  const cexChainsFromStore = useAppSelector(selectCexChainsDataResponse);
  const cexPairsFromStore = useAppSelector(selectCexPairsDataResponse);
  const pairsMeta = useAppSelector(selectPairsMeta);
  const cexPairsMeta = useAppSelector(selectCexPairsMeta);
  const pairRatingData = useAppSelector(selectPairsRating);
  const tokenInList = useAppSelector(selectTokenInList);
  const [activeTab, setActiveTab] = useState('pairs');
  const [selectedTokenIn, setSelectedTokenIn] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingCexPairRaw, setEditingCexPairRaw] = useState<any>(null);
  const [editingDexPairRaw, setEditingDexPairRaw] = useState<any>(null);
  const [pendingDeleteCexPairIds, setPendingDeleteCexPairIds] = useState<Set<number>>(new Set());
  const [pendingDeleteDexPairIds, setPendingDeleteDexPairIds] = useState<Set<number>>(new Set());
  const deleteCexPairTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const deleteDexPairTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    if (type === 'cex') {
      if ((!cexPairsMeta.isLoaded || cexPairsMeta.error) && !cexPairsMeta.isLoading) {
        dispatch(dbConfigActions.initCexPairsPage());
      }
      return;
    }

    if ((!pairsMeta.isLoaded || pairsMeta.error) && !pairsMeta.isLoading) {
      dispatch(dbConfigActions.initPairsPage());
    }
  }, [cexPairsMeta.error, cexPairsMeta.isLoaded, cexPairsMeta.isLoading, dispatch, pairsMeta.error, pairsMeta.isLoaded, pairsMeta.isLoading, type]);

  useEffect(() => {
    return () => {
      deleteCexPairTimeoutsRef.current.forEach(clearTimeout);
      deleteCexPairTimeoutsRef.current.clear();
      deleteDexPairTimeoutsRef.current.forEach(clearTimeout);
      deleteDexPairTimeoutsRef.current.clear();
    };
  }, []);

  const dexPairs = useMemo(() => {
    return dexPairsFromStore.map((pair: any) => ({
      id: pair.pairId,
      tokenInId: pair.tokenInId,
      tokenOutId: pair.tokenOutId,
      tokenInSymbol: pair.tokenInSymbol,
      tokenOutSymbol: pair.tokenOutSymbol,
      tokenInAddress: pair.tokenInAddress,
      tokenOutAddress: pair.tokenOutAddress,
      raw: pair,
    }));
  }, [dexPairsFromStore]);

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
      pairs: 'Pairs',
      pairRating: 'Pair Rating',
      add: type === 'dex' ? 'Add DEX Pair' : 'Add CEX Pair',
      pairId: 'Pair ID',
      tokenIn: 'Token In',
      tokenOut: 'Token Out',
      tokenInAddress: 'Token In Address',
      tokenOutAddress: 'Token Out Address',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      count: 'Count',
      selectToken: 'Select Token In...',
      tableTitleCex: 'CEX pairs',
      tableTitleDex: 'DEX pairs',
      ratingTableTitle: 'Pair rating',
      ratingPickToken: 'Select a token to view pair rating',
      ratingNoPairs: 'No pairs found for selected token',
    },
    ru: {
      pairs: 'Пары',
      pairRating: 'Рейтинг пар',
      add: type === 'dex' ? 'Добавить DEX пару' : 'Добавить CEX пару',
      pairId: 'ID пары',
      tokenIn: 'Токен входа',
      tokenOut: 'Токен выхода',
      tokenInAddress: 'Адрес входа',
      tokenOutAddress: 'Адрес выхода',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      count: 'Кол-во',
      selectToken: 'Выберите токен входа...',
      tableTitleCex: 'CEX пары',
      tableTitleDex: 'DEX пары',
      ratingTableTitle: 'Рейтинг пар',
      ratingPickToken: 'Выберите токен входа для рейтинга пар',
      ratingNoPairs: 'Для выбранного токена нет пар',
    },
  };

  const tabs = [
    { id: 'pairs', label: t[language].pairs },
    { id: 'rating', label: t[language].pairRating },
  ];

  const dexPairsColumns: Column[] = [
    {
      key: 'id',
      label: t[language].pairId,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenInSymbol',
      label: t[language].tokenIn,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenOutSymbol',
      label: t[language].tokenOut,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenInAddress',
      label: t[language].tokenInAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">
          {value ? `${value.slice(0, 10)}...${value.slice(-8)}` : ''}
        </span>
      ),
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">
          {value ? `${value.slice(0, 10)}...${value.slice(-8)}` : ''}
        </span>
      ),
    },
  ];

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

  const tokenOptions = useMemo(() => {
    return tokenInList.map((token) => ({
      value: String(token.tokenInId),
      label: `${token.tokenInSymbol} (${token.tokenInAddress.slice(0, 6)}...${token.tokenInAddress.slice(-4)})`,
    }));
  }, [tokenInList]);

  const ratingColumns: Column[] = [
    {
      key: 'tokenInSymbol',
      label: t[language].tokenIn,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenOutSymbol',
      label: t[language].tokenOut,
      sortable: true,
      filterable: true,
    },
    {
      key: 'tokenInAddress',
      label: t[language].tokenInAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'count',
      label: t[language].count,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-sm text-foreground">{value}</span>
      ),
    },
  ];

  const ratingTableRows = useMemo(
    () =>
      pairRatingData.map((row: any, idx: number) => ({
        rowId: `${row.tokenInId}-${row.tokenOutId}-${idx}`,
        tokenInSymbol: row.tokenInSymbol,
        tokenInAddress: row.tokenInAddress,
        tokenOutSymbol: row.tokenOutSymbol,
        tokenOutAddress: row.tokenOutAddress,
        count: row.count,
      })),
    [pairRatingData],
  );

  const tableData =
    type === 'cex'
      ? cexPairs.filter((p) => !pendingDeleteCexPairIds.has(p.id))
      : dexPairs.filter((p) => !pendingDeleteDexPairIds.has(p.id));
  const tableColumns = type === 'cex' ? cexPairsColumns : dexPairsColumns;
  const showPairsTable = type === 'cex' || activeTab === 'pairs';
  const isTableLoading = type === 'cex' ? cexPairsMeta.isLoading : pairsMeta.isLoading;
  const isRatingLoading = type === 'dex' && activeTab === 'rating' && pairsMeta.isLoading;

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <h2 className="text-foreground">
          {showPairsTable ? '' : `${t[language].pairRating} ${pairRatingData.length > 0 ? `(${pairRatingData.length})` : ''}`}
        </h2>
        {showPairsTable && (
          <button
            onClick={() => {
              setEditingCexPairRaw(null);
              setEditingDexPairRaw(null);
              setAddDialogOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{t[language].add}</span>
          </button>
        )}
      </div>

      {type === 'dex' && <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />}

      <div className="flex-1 flex flex-col overflow-hidden">
        {showPairsTable ? (
          <DataTable
            title={type === 'cex' ? t[language].tableTitleCex : t[language].tableTitleDex}
            columns={tableColumns}
            data={tableData}
            language={language}
            isLoading={isTableLoading}
            loadingText={type === 'cex' ? 'Loading CEX Pairs…' : 'Loading DEX Pairs…'}
            onEdit={(row) => {
              if (type === 'cex') {
                setEditingCexPairRaw(row.raw);
                setAddDialogOpen(true);
              } else {
                setEditingDexPairRaw(row.raw);
                setAddDialogOpen(true);
              }
            }}
            onDelete={(row) => {
              if (type === 'cex') {
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
                return;
              }

              setPendingDeleteDexPairIds((prev) => new Set(prev).add(row.id));
              const existingDex = deleteDexPairTimeoutsRef.current.get(row.id);
              if (existingDex) clearTimeout(existingDex);

              const tidDex = setTimeout(async () => {
                deleteDexPairTimeoutsRef.current.delete(row.id);
                try {
                  await apiService.deletingPair(row.id);
                  dispatch(dbConfigActions.refetchPairsPageResources());
                } finally {
                  setPendingDeleteDexPairIds((prev) => {
                    const next = new Set(prev);
                    next.delete(row.id);
                    return next;
                  });
                }
              }, DELETE_UNDO_MS);
              deleteDexPairTimeoutsRef.current.set(row.id, tidDex);

              showDeleteToast({
                itemName: `${row.tokenInSymbol}/${row.tokenOutSymbol}`,
                itemType: language === 'en' ? 'Pair' : 'Пара',
                onUndo: () => {
                  const scheduled = deleteDexPairTimeoutsRef.current.get(row.id);
                  if (scheduled) clearTimeout(scheduled);
                  deleteDexPairTimeoutsRef.current.delete(row.id);
                  setPendingDeleteDexPairIds((prev) => {
                    const next = new Set(prev);
                    next.delete(row.id);
                    return next;
                  });
                },
                language,
              });
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="shrink-0 p-4 border-b border-border">
              <Autocomplete
                label={t[language].tokenIn}
                options={tokenOptions}
                value={selectedTokenIn}
                onChange={(value) => {
                  setSelectedTokenIn(value);
                  const tokenId = value ? Number(value) : null;
                  dispatch(dbConfigActions.setPairsRatingData(Number.isNaN(tokenId) ? null : tokenId));
                }}
                placeholder={t[language].selectToken}
              />
            </div>
            {!selectedTokenIn ? (
              <div className="flex-1 min-h-0 flex items-center justify-center p-4">
                <p className="text-muted-foreground text-sm text-center">{t[language].ratingPickToken}</p>
              </div>
            ) : pairRatingData.length === 0 && !isRatingLoading ? (
              <div className="flex-1 min-h-0 flex items-center justify-center p-4">
                <p className="text-muted-foreground text-sm text-center">{t[language].ratingNoPairs}</p>
              </div>
            ) : (
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <DataTable
                  title={t[language].ratingTableTitle}
                  columns={ratingColumns}
                  data={ratingTableRows}
                  language={language}
                  isLoading={isRatingLoading}
                  loadingText={language === 'ru' ? 'Загрузка рейтинга…' : 'Loading pair rating…'}
                  getRowId={(params) => String(params.data?.rowId ?? '')}
                />
              </div>
            )}
          </div>
        )}
      </div>
      {type === 'cex' ? (
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
      ) : (
        <DexPairForm
          open={addDialogOpen}
          onClose={() => {
            setAddDialogOpen(false);
            setEditingDexPairRaw(null);
          }}
          onSave={async (data) => {
            const payload = {
              poolId: Number(data.poolId),
              tokenIn: Number(data.tokenInId),
              tokenOut: Number(data.tokenOutId),
            };
            if (editingDexPairRaw) {
              const id = Number(editingDexPairRaw.pairId ?? editingDexPairRaw.id);
              await apiService.editPair(id, payload);
            } else {
              await apiService.createPair(payload);
            }
            dispatch(dbConfigActions.refetchPairsPageResources());
          }}
          initialData={
            editingDexPairRaw
              ? {
                  poolId: String(editingDexPairRaw.poolId ?? ''),
                  tokenInId: String(editingDexPairRaw.tokenInId ?? ''),
                  tokenOutId: String(editingDexPairRaw.tokenOutId ?? ''),
                }
              : undefined
          }
          language={language}
        />
      )}
    </div>
  );
}
