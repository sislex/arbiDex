import { DataTable, Column } from '../DataTable';
import { useState } from 'react';

const mockRelations = [
  { id: 1, pair: 'BTC/USDT', exchange: 'Binance', enabled: true },
  { id: 2, pair: 'ETH/USDT', exchange: 'Kraken', enabled: true },
  { id: 3, pair: 'SOL/USDT', exchange: 'Coinbase', enabled: false },
];

const mockNoRelations = [
  { id: 4, pair: 'BNB/USDT', exchange: 'Gate.io' },
  { id: 5, pair: 'ADA/USDT', exchange: 'Huobi' },
];

export function QuotesPage({ language }: { language: 'en' | 'ru' }) {
  const [relations, setRelations] = useState(mockRelations);

  const t = {
    en: {
      title: 'Quotes',
      relations: 'Relations',
      noRelations: 'No Relations',
      pair: 'Pair',
      exchange: 'Exchange',
      enabled: 'Enabled',
      save: 'Save Changes',
    },
    ru: {
      title: 'Котировки',
      relations: 'Связи',
      noRelations: 'Без связей',
      pair: 'Пара',
      exchange: 'Биржа',
      enabled: 'Включено',
      save: 'Сохранить',
    },
  };

  const relationsColumns: Column[] = [
    {
      key: 'enabled',
      label: '',
      render: (value, row) => (
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => {
            setRelations(
              relations.map((r) =>
                r.id === row.id ? { ...r, enabled: e.target.checked } : r
              )
            );
          }}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
        />
      ),
    },
    { key: 'pair', label: t[language].pair, sortable: true },
    { key: 'exchange', label: t[language].exchange, sortable: true },
  ];

  const noRelationsColumns: Column[] = [
    { key: 'pair', label: t[language].pair, sortable: true },
    { key: 'exchange', label: t[language].exchange, sortable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 flex flex-col gap-4 p-4 overflow-auto">
        <div className="flex-1 flex flex-col border border-border rounded">
          <div className="h-10 bg-muted border-b border-border flex items-center px-4">
            <span className="text-sm text-foreground">{t[language].relations}</span>
          </div>
          <DataTable title={t[language].relations} columns={relationsColumns} data={relations} />
        </div>

        <div className="flex-1 flex flex-col border border-border rounded">
          <div className="h-10 bg-muted border-b border-border flex items-center px-4">
            <span className="text-sm text-foreground">{t[language].noRelations}</span>
          </div>
          <DataTable title={t[language].noRelations} columns={noRelationsColumns} data={mockNoRelations} />
        </div>
      </div>

      <div className="h-16 border-t border-border bg-card flex items-center justify-end px-4">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
          {t[language].save}
        </button>
      </div>
    </div>
  );
}
