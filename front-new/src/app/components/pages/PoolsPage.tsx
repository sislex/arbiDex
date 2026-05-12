import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useEffect, useMemo, useState } from 'react';
import { PoolForm } from '../forms/PoolForm';
import { showDeleteToast } from '../../utils/toast';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectFullPoolsData } from '../../store/db-config/dbConfig.selectors';

export function PoolsPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const poolsFromStore = useAppSelector(selectFullPoolsData);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deletedPoolIds, setDeletedPoolIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(dbConfigActions.initPoolsPage());
  }, [dispatch]);

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
      .filter((pool) => !deletedPoolIds.has(pool.id));
  }, [deletedPoolIds, poolsFromStore]);

  const t = {
    en: {
      add: 'Add Pool',
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
        title="Pools"
        columns={columns}
        data={pools}
        onEdit={(row) => {
          setEditData(row.raw ?? row);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          setDeletedPoolIds(new Set([...deletedPoolIds, row.id]));
          showDeleteToast({
            itemName: `${row.token0Symbol}/${row.token1Symbol}`,
            itemType: language === 'en' ? 'Pool' : 'Пул',
            onUndo: () => {
              const next = new Set(deletedPoolIds);
              next.delete(row.id);
              setDeletedPoolIds(next);
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
        onSave={(data) => console.log('Pool saved', data)}
        initialData={editData}
        language={language}
      />
    </div>
  );
}
