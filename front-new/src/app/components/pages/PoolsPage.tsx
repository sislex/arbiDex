import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useState } from 'react';
import { PoolForm } from '../forms/PoolForm';
import { showDeleteToast } from '../../utils/toast';

const mockPools = [
  {
    id: 1,
    chain: 'ethereum',
    token0: 'eth',
    token1: 'usdt',
    dex: 'uniswap-v3',
    fee: '0.3',
    poolAddress: '0x1d42064Fc4Beb5F8aAF85F4617AE8b3b5B8Bd801',
  },
  {
    id: 2,
    chain: 'bsc',
    token0: 'bnb',
    token1: 'busd',
    dex: 'pancakeswap',
    fee: '0.25',
    poolAddress: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
  },
];

export function PoolsPage({ language }: { language: 'en' | 'ru' }) {
  const [pools, setPools] = useState(mockPools);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const t = {
    en: {
      add: 'Add Pool',
      chain: 'Chain',
      pair: 'Pair',
      dex: 'DEX',
      fee: 'Fee',
      poolAddress: 'Pool Address',
    },
    ru: {
      add: 'Добавить пул',
      chain: 'Сеть',
      pair: 'Пара',
      dex: 'DEX',
      fee: 'Комиссия',
      poolAddress: 'Адрес пула',
    },
  };

  const columns: Column[] = [
    {
      key: 'chain',
      label: t[language].chain,
      sortable: true,
      render: (value) => <span className="capitalize">{value}</span>,
    },
    {
      key: 'pair',
      label: t[language].pair,
      render: (_, row) => (
        <span className="uppercase">
          {row.token0}/{row.token1}
        </span>
      ),
    },
    { key: 'dex', label: t[language].dex, sortable: true },
    {
      key: 'fee',
      label: t[language].fee,
      render: (value) => <span>{value}%</span>,
    },
    {
      key: 'poolAddress',
      label: t[language].poolAddress,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">
          {value.slice(0, 10)}...{value.slice(-8)}
        </span>
      ),
    },
  ];

  const handleSave = (data: any) => {
    if (editData) {
      setPools(pools.map((p) => (p.id === editData.id ? { ...p, ...data } : p)));
    } else {
      setPools([...pools, { ...data, id: pools.length + 1 }]);
    }
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
        columns={columns}
        data={pools}
        onEdit={(row) => {
          setEditData(row);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          const deletedPool = { ...row };
          setPools(pools.filter((p) => p.id !== row.id));
          showDeleteToast({
            itemName: `${row.token0.toUpperCase()}/${row.token1.toUpperCase()}`,
            itemType: language === 'en' ? 'Pool' : 'Пул',
            onUndo: () => setPools([...pools]),
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
        onSave={handleSave}
        initialData={editData}
        language={language}
      />
    </div>
  );
}
