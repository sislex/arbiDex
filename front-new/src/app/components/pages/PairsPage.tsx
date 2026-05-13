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
  const [pendingDeleteCexPairIds, setPendingDeleteCexPairIds] = useState<Set<number>>(new Set());
  const deleteCexPairTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

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
    },
    {
      key: 'tokenOutSymbol',
      label: t[language].tokenOut,
      sortable: true,
    },
    {
      key: 'tokenInAddress',
      label: t[language].tokenInAddress,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'tokenOutAddress',
      label: t[language].tokenOutAddress,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'count',
      label: t[language].count,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm text-foreground">{value}</span>
      ),
    },
  ];

  const tableData =
    type === 'cex'
      ? cexPairs.filter((p) => !pendingDeleteCexPairIds.has(p.id))
      : dexPairs;
  const tableColumns = type === 'cex' ? cexPairsColumns : dexPairsColumns;
  const showPairsTable = type === 'cex' || activeTab === 'pairs';
  const isTableLoading = type === 'cex' ? cexPairsMeta.isLoading : pairsMeta.isLoading;

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
            title={type === 'cex' ? 'CEX Pairs' : 'DEX Pairs'}
            columns={tableColumns}
            data={tableData}
            isLoading={isTableLoading}
            loadingText={type === 'cex' ? 'Loading CEX Pairs…' : 'Loading DEX Pairs…'}
            onEdit={(row) => {
              if (type === 'cex') {
                setEditingCexPairRaw(row.raw);
                setAddDialogOpen(true);
              }
            }}
            onDelete={(row) => {
              if (type !== 'cex') return;

              setPendingDeleteCexPairIds((prev) => new Set(prev).add(row.id));
              const existing = deleteCexPairTimeoutsRef.current.get(row.id);
              if (existing) clearTimeout(existing);

              const tid = setTimeout(async () => {
                deleteCexPairTimeoutsRef.current.delete(row.id);
                try {
                  await apiService.deletingCexPair(row.id);
                  dispatch(dbConfigActions.initCexPairsPage());
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
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-border">
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
            {pairRatingData.length > 0 ? (
              <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-muted z-10">
                    <tr>
                      {ratingColumns.map((column) => (
                        <th
                          key={column.key}
                          className="text-left px-3 py-2 border-b border-border text-xs text-muted-foreground uppercase tracking-wider"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pairRatingData.map((row, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-muted/50">
                        {ratingColumns.map((column) => (
                          <td key={column.key} className="px-3 py-2">
                            {column.render
                              ? column.render(row[column.key as keyof typeof row], row)
                              : row[column.key as keyof typeof row]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                  {selectedTokenIn
                    ? 'No pairs found for selected token'
                    : 'Select a token to view pair rating'}
                </p>
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
            dispatch(dbConfigActions.initCexPairsPage());
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
          onClose={() => setAddDialogOpen(false)}
          onSave={async (data) => {
            await apiService.createPair({
              poolId: Number(data.poolId),
              tokenIn: Number(data.tokenInId),
              tokenOut: Number(data.tokenOutId),
            });
            dispatch(dbConfigActions.initPairsPage());
          }}
          language={language}
        />
      )}
    </div>
  );
}
