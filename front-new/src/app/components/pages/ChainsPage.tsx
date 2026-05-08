import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useState } from 'react';
import { ChainForm } from '../forms/ChainForm';
import { showDeleteToast } from '../../utils/toast';

const mockChains = [
  { id: 'ethereum', name: 'Ethereum', rpc: 'https://eth.llamarpc.com', chainId: 1 },
  { id: 'bsc', name: 'Binance Smart Chain', rpc: 'https://bsc-dataseed.binance.org', chainId: 56 },
  { id: 'polygon', name: 'Polygon', rpc: 'https://polygon-rpc.com', chainId: 137 },
  { id: 'arbitrum', name: 'Arbitrum', rpc: 'https://arb1.arbitrum.io/rpc', chainId: 42161 },
];

export function ChainsPage({ language }: { language: 'en' | 'ru' }) {
  const [chains, setChains] = useState(mockChains);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const t = {
    en: {
      add: 'Add Chain',
      id: 'ID',
      name: 'Name',
      rpc: 'RPC URL',
      chainId: 'Chain ID',
    },
    ru: {
      add: 'Добавить сеть',
      id: 'ID',
      name: 'Название',
      rpc: 'RPC URL',
      chainId: 'Chain ID',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].id, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
    {
      key: 'rpc',
      label: t[language].rpc,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    { key: 'chainId', label: t[language].chainId, sortable: true },
  ];

  const handleSave = (data: any) => {
    if (editData) {
      setChains(chains.map((c) => (c.id === editData.id ? { ...c, ...data } : c)));
    } else {
      setChains([...chains, { ...data, rpc: '', chainId: 0 }]);
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
        data={chains}
        onEdit={(row) => {
          setEditData(row);
          setFormOpen(true);
        }}
        onDelete={(row) => {
          const deletedChain = { ...row };
          setChains(chains.filter((c) => c.id !== row.id));
          showDeleteToast({
            itemName: row.name,
            itemType: language === 'en' ? 'Chain' : 'Сеть',
            onUndo: () => setChains([...chains]),
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
