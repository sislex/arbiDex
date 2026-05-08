import { Plus } from 'lucide-react';
import { DataTable, Column } from '../DataTable';
import { useState } from 'react';
import { showDeleteToast } from '../../utils/toast';

const mockTokens = [
  { id: 1, symbol: 'BTC', name: 'Bitcoin', address: '0x123...abc', decimals: 8, active: true },
  { id: 2, symbol: 'ETH', name: 'Ethereum', address: '0x456...def', decimals: 18, active: true },
  { id: 3, symbol: 'USDT', name: 'Tether USD', address: '0x789...ghi', decimals: 6, active: true },
  { id: 4, symbol: 'BNB', name: 'Binance Coin', address: '0xabc...123', decimals: 18, active: false },
  { id: 5, symbol: 'SOL', name: 'Solana', address: '0xdef...456', decimals: 9, active: true },
];

export function TokensPage({ language }: { language: 'en' | 'ru' }) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [tokens, setTokens] = useState(mockTokens);

  const t = {
    en: {
      title: 'Tokens',
      add: 'Add Token',
      symbol: 'Symbol',
      name: 'Name',
      address: 'Address',
      decimals: 'Decimals',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
    },
    ru: {
      title: 'Токены',
      add: 'Добавить токен',
      symbol: 'Символ',
      name: 'Название',
      address: 'Адрес',
      decimals: 'Decimals',
      status: 'Статус',
      active: 'Активен',
      inactive: 'Неактивен',
    },
  };

  const columns: Column[] = [
    { key: 'symbol', label: t[language].symbol, sortable: true, filterable: true },
    { key: 'name', label: t[language].name, sortable: true, filterable: true },
    {
      key: 'address',
      label: t[language].address,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    { key: 'decimals', label: t[language].decimals, sortable: true },
    {
      key: 'active',
      label: t[language].status,
      render: (value) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            value
              ? 'bg-success/20 text-success'
              : 'bg-destructive/20 text-destructive'
          }`}
        >
          {value ? t[language].active : t[language].inactive}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center justify-end px-4">
        <button className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span className="text-sm">{t[language].add}</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={tokens}
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => {
          const deletedToken = { ...row };
          setTokens(tokens.filter((t) => t.id !== row.id));
          showDeleteToast({
            itemName: row.symbol,
            itemType: language === 'en' ? 'Token' : 'Токен',
            onUndo: () => setTokens([...tokens]),
            language,
          });
        }}
        onRowClick={setSelectedRow}
        selectedRow={selectedRow}
      />
    </div>
  );
}
