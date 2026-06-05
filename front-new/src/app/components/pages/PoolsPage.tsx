import { Copy, Menu, Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PoolForm } from '../forms/PoolForm';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectChainsMeta,
  selectDexesDataResponse,
  selectDexesMeta,
  selectPoolsDataResponse,
  selectPoolsMeta,
  selectTokensDataResponse,
  selectTokensMeta,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { normalizeDexPoolForStore } from '../../utils/dexPool';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const POOLS_DELETE_SCOPE = 'pools';

function mapPoolRow(pool: any, rawPool?: any) {
  return {
    id: pool.poolId ?? pool.id,
    address: pool.poolAddress ?? pool.address ?? '',
    chainName: pool.chainName ?? pool.chainId ?? '',
    dexName: pool.dexName ?? pool.dexId ?? '',
    dexVersion: pool.version ?? pool.dexVersion ?? pool.dex_version ?? '',
    fee: pool.fee ?? '',
    token0Symbol: pool.token0Symbol ?? pool.token0Name ?? pool.token0Id ?? '',
    token1Symbol: pool.token1Symbol ?? pool.token1Name ?? pool.token1Id ?? '',
    token0Address: pool.token0Address ?? '',
    token1Address: pool.token1Address ?? '',
    reserve0: pool.reserve0 ?? pool.reserve_0 ?? pool.token0Reserve ?? '',
    reserve1: pool.reserve1 ?? pool.reserve_1 ?? pool.token1Reserve ?? '',
    raw: rawPool ?? pool,
  };
}

export function PoolsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const poolsRaw = useAppSelector(selectPoolsDataResponse);
  const tokensRaw = useAppSelector(selectTokensDataResponse);
  const dexesRaw = useAppSelector(selectDexesDataResponse);
  const chainsRaw = useAppSelector(selectChainsDataResponse);
  const poolsMeta = useAppSelector(selectPoolsMeta);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const dexesMeta = useAppSelector(selectDexesMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPoolRaw, setEditingPoolRaw] = useState<any>(null);
  const [copiedPoolInitialData, setCopiedPoolInitialData] = useState<any>(null);
  const [pendingDeletePoolIds, setPendingDeletePoolIds] = useState<Set<number>>(new Set());
  const [selectedPoolIds, setSelectedPoolIds] = useState<Set<number>>(new Set());
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapPoolRow>[]>([]);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const poolsFromStoreRef = useRef(poolsRaw);

  const lookupMaps = useMemo(() => {
    const chain = new Map<number, string>();
    chainsRaw.forEach((item: any) => {
      const id = Number(item.chainId ?? item.id);
      if (Number.isFinite(id)) chain.set(id, item.name ?? item.chainName ?? String(id));
    });

    const dex = new Map<number, string>();
    dexesRaw.forEach((item: any) => {
      const id = Number(item.dexId ?? item.id);
      if (Number.isFinite(id)) dex.set(id, item.name ?? item.dexName ?? String(id));
    });

    const token = new Map<number, any>();
    tokensRaw.forEach((item: any) => {
      const id = Number(item.tokenId ?? item.id);
      if (Number.isFinite(id)) token.set(id, item);
    });

    return { chain, dex, token };
  }, [chainsRaw, dexesRaw, tokensRaw]);

  const enrichPoolRow = useCallback(
    (pool: any) => {
      const token0 = lookupMaps.token.get(Number(pool.token0Id));
      const token1 = lookupMaps.token.get(Number(pool.token1Id));
      return mapPoolRow(
        {
          ...pool,
          chainName: lookupMaps.chain.get(Number(pool.chainId)) ?? pool.chainId,
          dexName: lookupMaps.dex.get(Number(pool.dexId)) ?? pool.dexId,
          token0Symbol: token0?.symbol,
          token1Symbol: token1?.symbol,
          token0Address: token0?.address,
          token1Address: token1?.address,
          token0Name: token0?.tokenName,
          token1Name: token1?.tokenName,
        },
        pool,
      );
    },
    [lookupMaps],
  );

  useEffect(() => {
    const shouldInit =
      !poolsMeta.isLoaded ||
      !tokensMeta.isLoaded ||
      !dexesMeta.isLoaded ||
      !chainsMeta.isLoaded ||
      Boolean(poolsMeta.error || tokensMeta.error || dexesMeta.error || chainsMeta.error);

    const isAnyLoading =
      poolsMeta.isLoading || tokensMeta.isLoading || dexesMeta.isLoading || chainsMeta.isLoading;

    if (shouldInit && !isAnyLoading) {
      dispatch(dbConfigActions.initPoolsPage());
    }
  }, [
    chainsMeta.error,
    chainsMeta.isLoaded,
    chainsMeta.isLoading,
    dexesMeta.error,
    dexesMeta.isLoaded,
    dexesMeta.isLoading,
    dispatch,
    poolsMeta.error,
    poolsMeta.isLoaded,
    poolsMeta.isLoading,
    tokensMeta.error,
    tokensMeta.isLoaded,
    tokensMeta.isLoading,
  ]);

  const isPageLoading =
    poolsMeta.isLoading || tokensMeta.isLoading || dexesMeta.isLoading || chainsMeta.isLoading;

  useEffect(() => {
    const prevStore = poolsFromStoreRef.current;
    const nextStore = poolsRaw;
    poolsFromStoreRef.current = nextStore;

    const prevLen = prevStore.length;
    const nextLen = nextStore.length;

    if (prevLen > 0 && nextLen < prevLen) {
      const nextIds = new Set(nextStore.map((pool: any) => Number(pool.poolId ?? pool.id)));
      setTableRows((current) => current.filter((row) => nextIds.has(row.id)));
      return;
    }

    if (prevLen === nextLen && prevStore === nextStore) {
      return;
    }

    setTableRows(nextStore.map(enrichPoolRow));
  }, [enrichPoolRow, poolsRaw]);

  const visiblePoolIds = useMemo(() => {
    if (pendingDeletePoolIds.size === 0) {
      return tableRows.map((pool) => pool.id);
    }
    const ids: number[] = [];
    for (const pool of tableRows) {
      if (!pendingDeletePoolIds.has(pool.id)) {
        ids.push(pool.id);
      }
    }
    return ids;
  }, [pendingDeletePoolIds, tableRows]);

  const allPoolIds = visiblePoolIds;
  const allSelected = allPoolIds.length > 0 && allPoolIds.every((id) => selectedPoolIds.has(id));
  const someSelected = allPoolIds.some((id) => selectedPoolIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const togglePool = useCallback((id: number) => {
    setSelectedPoolIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllPools = useCallback(() => {
    setSelectedPoolIds(allSelected ? new Set() : new Set(allPoolIds));
  }, [allPoolIds, allSelected]);

  const t = {
    en: {
      add: 'Add Pool',
      tableTitle: 'Pools',
      id: 'ID',
      address: 'Address',
      chainName: 'Chain Name',
      dexName: 'Dex Name',
      dexVersion: 'Dex Version',
      fee: 'Fee',
      token0Symbol: 'Token 0 (symbol)',
      token1Symbol: 'Token 1 (symbol)',
      token0Address: 'Token 0 Address',
      token1Address: 'Token 1 Address',
      reserve0: 'Reserve 0',
      reserve1: 'Reserve 1',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      deleteFailed: 'Failed to delete pools',
      deleteType: 'Pool',
    },
    ru: {
      add: 'Добавить пул',
      tableTitle: 'Пулы',
      id: 'ID',
      address: 'Адрес',
      chainName: 'Сеть',
      dexName: 'DEX',
      dexVersion: 'Версия DEX',
      fee: 'Комиссия',
      token0Symbol: 'Токен 0 (символ)',
      token1Symbol: 'Токен 1 (символ)',
      token0Address: 'Адрес токена 0',
      token1Address: 'Адрес токена 1',
      reserve0: 'Резерв 0',
      reserve1: 'Резерв 1',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      deleteFailed: 'Не удалось удалить пулы',
      deleteType: 'Пул',
    },
  };

  const renderAddress = (value: string) => (
    <span className="font-mono text-xs text-muted-foreground">{value}</span>
  );

  const updatePendingDeletePoolIds = useCallback((updater: (prev: Set<number>) => Set<number>) => {
    startTransition(() => {
      setPendingDeletePoolIds(updater);
    });
  }, []);

  const scheduleDelete = useCallback(
    (row: { id: number; token0Symbol: string; token1Symbol: string }) => {
      updatePendingDeletePoolIds((prev) => new Set(prev).add(row.id));
      setSelectedPoolIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${POOLS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeletePools([row.id]);
        dispatch(dbConfigActions.removePoolsByIds(result.deletedIds ?? [row.id]));
        updatePendingDeletePoolIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: `${row.token0Symbol}/${row.token1Symbol}`,
        itemType: t[language].deleteType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          updatePendingDeletePoolIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t, updatePendingDeletePoolIds],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedPoolIds.size === 0) return;

    const deleteIds = [...selectedPoolIds];

    updatePendingDeletePoolIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedPoolIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(POOLS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeletePools(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      dispatch(dbConfigActions.removePoolsByIds(result.deletedIds ?? deleteIds));
      updatePendingDeletePoolIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: deleteIds.length,
      itemType: language === 'en' ? 'pools' : 'пулов',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        updatePendingDeletePoolIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dispatch, language, selectedPoolIds, t, updatePendingDeletePoolIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllPools}
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
          checked={selectedPoolIds.has(row.id)}
          onChange={() => togglePool(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    {
      key: 'address',
      label: t[language].address,
      sortable: true,
      filterable: true,
      render: renderAddress,
    },
    { key: 'chainName', label: t[language].chainName, sortable: true, filterable: true },
    { key: 'dexName', label: t[language].dexName, sortable: true, filterable: true },
    { key: 'dexVersion', label: t[language].dexVersion, sortable: true, filterable: true },
    { key: 'fee', label: t[language].fee, sortable: true, filterable: true },
    { key: 'token0Symbol', label: t[language].token0Symbol, sortable: true, filterable: true },
    { key: 'token1Symbol', label: t[language].token1Symbol, sortable: true, filterable: true },
    {
      key: 'token0Address',
      label: t[language].token0Address,
      sortable: true,
      filterable: true,
      render: renderAddress,
    },
    {
      key: 'token1Address',
      label: t[language].token1Address,
      sortable: true,
      filterable: true,
      render: renderAddress,
    },
    { key: 'reserve0', label: t[language].reserve0, sortable: true, filterable: true },
    { key: 'reserve1', label: t[language].reserve1, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={t[language].tableTitle}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingPoolRaw(null);
                setCopiedPoolInitialData(null);
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
                  disabled={selectedPoolIds.size === 0}
                  variant="destructive"
                  onClick={handleDeleteSelected}
                >
                  {t[language].deleteSelected}
                  {selectedPoolIds.size > 0 ? ` (${selectedPoolIds.size})` : ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        columns={columns}
        data={tableRows}
        excludeRowIds={pendingDeletePoolIds}
        getExcludeRowId={(row) => row.id}
        language={language}
        isLoading={isPageLoading}
        loadingText={language === 'ru' ? 'Загрузка пулов…' : 'Loading Pools…'}
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
        onEdit={(row) => {
          setEditingPoolRaw(row.raw ?? row);
          setCopiedPoolInitialData(null);
          setFormOpen(true);
        }}
        extraActions={(row) => (
          <button
            onClick={(event) => {
              event.stopPropagation();
              setEditingPoolRaw(null);
              setCopiedPoolInitialData(row.raw ?? row);
              setFormOpen(true);
            }}
            className="p-1.5 hover:bg-accent rounded transition-colors"
            title={language === 'ru' ? 'Копировать' : 'Copy'}
          >
            <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
        onDelete={scheduleDelete}
      />

      <PoolForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPoolRaw(null);
          setCopiedPoolInitialData(null);
        }}
        onSave={async (data) => {
          const poolId = editingPoolRaw?.poolId ?? editingPoolRaw?.id;
          const fee = Number(data.fee);
          const base = {
            chainId: Number(data.chainId),
            token0: Number(data.token0Id),
            token1: Number(data.token1Id),
            dexId: Number(data.dexId),
            version: data.version as 'v2' | 'v3' | 'v4',
            fee,
            poolAddress: data.poolAddress,
          };

          const saved =
            editingPoolRaw && poolId !== undefined && poolId !== null && Number.isFinite(Number(poolId))
              ? await apiService.editPool(Number(poolId), { poolId: Number(poolId), ...base })
              : await apiService.createPool(base);

          dispatch(dbConfigActions.upsertPool({ pool: normalizeDexPoolForStore(saved) }));
        }}
        initialData={copiedPoolInitialData ?? editingPoolRaw ?? undefined}
        language={language}
      />
    </div>
  );
}
