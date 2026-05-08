import { DataTable, Column } from '../DataTable';
import { ChevronRight } from 'lucide-react';

const mockQuotes = [
  { id: 1, name: 'Binance Spot', type: 'CEX', pairs: 242, status: 'Active', lastUpdate: '2026-05-04 10:23' },
  { id: 2, name: 'Uniswap V3', type: 'DEX', pairs: 189, status: 'Active', lastUpdate: '2026-05-04 10:22' },
  { id: 3, name: 'Kraken', type: 'CEX', pairs: 156, status: 'Active', lastUpdate: '2026-05-04 10:21' },
  { id: 4, name: 'PancakeSwap', type: 'DEX', pairs: 312, status: 'Active', lastUpdate: '2026-05-04 10:20' },
  { id: 5, name: 'Coinbase Pro', type: 'CEX', pairs: 201, status: 'Inactive', lastUpdate: '2026-05-04 09:15' },
  { id: 6, name: 'SushiSwap', type: 'DEX', pairs: 98, status: 'Active', lastUpdate: '2026-05-04 10:19' },
];

interface QuotesListPageProps {
  language: 'en' | 'ru';
  onQuoteClick: (quoteId: number, quoteName: string) => void;
}

export function QuotesListPage({ language, onQuoteClick }: QuotesListPageProps) {
  const t = {
    en: {
      name: 'Quote Name',
      type: 'Type',
      pairs: 'Pairs',
      status: 'Status',
      lastUpdate: 'Last Update',
      active: 'Active',
      inactive: 'Inactive',
    },
    ru: {
      name: 'Название',
      type: 'Тип',
      pairs: 'Пары',
      status: 'Статус',
      lastUpdate: 'Обновление',
      active: 'Активна',
      inactive: 'Неактивна',
    },
  };

  const columns: Column[] = [
    {
      key: 'name',
      label: t[language].name,
      sortable: true,
      filterable: true,
    },
    {
      key: 'type',
      label: t[language].type,
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-0.5 rounded text-xs ${
          value === 'CEX' ? 'bg-secondary/20 text-secondary' : 'bg-accent/50 text-accent-foreground'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'pairs',
      label: t[language].pairs,
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'status',
      label: t[language].status,
      render: (value) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            value === 'Active'
              ? 'bg-success/20 text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {value === 'Active' ? t[language].active : t[language].inactive}
        </span>
      ),
    },
    {
      key: 'lastUpdate',
      label: t[language].lastUpdate,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuoteClick(row.id, row.name);
          }}
          className="p-1.5 hover:bg-accent rounded transition-colors"
          title="Edit Relations"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        columns={columns}
        data={mockQuotes}
        onRowClick={(row) => onQuoteClick(row.id, row.name)}
      />
    </div>
  );
}
