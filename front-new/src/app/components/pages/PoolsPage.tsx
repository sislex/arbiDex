import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PoolForm } from '../forms/PoolForm';
import { showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsMeta,
  selectDexesMeta,
  selectFullPoolsData,
  selectPoolsMeta,
  selectTokensMeta,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';

const DELETE_UNDO_MS = 5000;

export function PoolsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const poolsFromStore = useAppSelector(selectFullPoolsData);
  const poolsMeta = useAppSelector(selectPoolsMeta);
  const tokensMeta = useAppSelector(selectTokensMeta);
  const dexesMeta = useAppSelector(selectDexesMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [pendingDeletePoolIds, setPendingDeletePoolIds] = useState<Set<number>>(new Set());
  const deletePoolTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

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

  const pools = useMemo(() => {
    return poolsFromStore
      .map((pool: any) => ({
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
        raw: pool,
      }))
      .filter((pool) => !pendingDeletePoolIds.has(pool.id));
  }, [pendingDeletePoolIds, poolsFromStore]);

  useEffect(() => {
    return () => {
      deletePoolTimeoutsRef.current.forEach(clearTimeout);
      deletePoolTimeoutsRef.current.clear();
    };
  }, []);

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
    },
  };

  const renderAddress = (value: string) => (
    <span className="font-mono text-xs text-muted-foreground">{value}</span>
  );

  const columns: Column[] = [
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
          <button
            onClick={() => {
              setEditData(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{t[language].add}</span>
          </button>
        }
        columns={columns}
        data={pools}
        language={language}
        isLoading={isPageLoading}
        loadingText={language === 'ru' ? 'Загрузка пулов…' : 'Loading Pools…'}
        onEdit={(row) => {
          setEditData(row.raw ?? row);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setPendingDeletePoolIds((prev) => new Set(prev).add(row.id));
          const existing = deletePoolTimeoutsRef.current.get(row.id);
          if (existing) clearTimeout(existing);

          const tid = setTimeout(async () => {
            deletePoolTimeoutsRef.current.delete(row.id);
            try {
              await apiService.deletingPool(row.id);
              dispatch(dbConfigActions.refetchPoolsPageResources());
            } finally {
              setPendingDeletePoolIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            }
          }, DELETE_UNDO_MS);
          deletePoolTimeoutsRef.current.set(row.id, tid);

          showDeleteToast({
            itemName: `${row.token0Symbol}/${row.token1Symbol}`,
            itemType: language === 'en' ? 'Pool' : 'Пул',
            onUndo: () => {
              const scheduled = deletePoolTimeoutsRef.current.get(row.id);
              if (scheduled) clearTimeout(scheduled);
              deletePoolTimeoutsRef.current.delete(row.id);
              setPendingDeletePoolIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            },
            language,
          });
        }}
      />

      <PoolForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditData(null);
        }}
        onSave={async (data) => {
          const poolId = editData?.poolId ?? editData?.id;
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

          if (poolId !== undefined && poolId !== null && Number.isFinite(Number(poolId))) {
            const id = Number(poolId);
            await apiService.editPool(id, { poolId: id, ...base });
          } else {
            await apiService.createPool(base);
          }

          dispatch(dbConfigActions.refetchPoolsPageResources());
        }}
        initialData={editData}
        language={language}
      />
    </div>
  );
}
