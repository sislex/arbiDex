import { DataTable, Column } from '../DataTable';
import { useState } from 'react';

const mockBots = [
  { id: 1, name: 'Arbitrage Bot #1', strategy: 'DEX-CEX', status: 'Running', uptime: '24h 15m' },
  { id: 2, name: 'Arbitrage Bot #2', strategy: 'Multi-DEX', status: 'Stopped', uptime: '0h 0m' },
  { id: 3, name: 'Market Maker #1', strategy: 'Grid Trading', status: 'Running', uptime: '156h 42m' },
];

export function BotsPage({ language, onBotClick }: { language: 'en' | 'ru'; onBotClick?: (bot: any) => void }) {
  const [selectedBot, setSelectedBot] = useState<any>(null);

  const t = {
    en: {
      title: 'Bots',
      name: 'Name',
      strategy: 'Strategy',
      status: 'Status',
      uptime: 'Uptime',
      getConfig: 'Get Config',
      running: 'Running',
      stopped: 'Stopped',
    },
    ru: {
      title: 'Боты',
      name: 'Название',
      strategy: 'Стратегия',
      status: 'Статус',
      uptime: 'Время работы',
      getConfig: 'Получить конфигурацию',
      running: 'Работает',
      stopped: 'Остановлен',
    },
  };

  const columns: Column[] = [
    { key: 'name', label: t[language].name, sortable: true },
    { key: 'strategy', label: t[language].strategy, sortable: true },
    {
      key: 'status',
      label: t[language].status,
      render: (value) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            value === 'Running'
              ? 'bg-success/20 text-success'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {value === 'Running' ? t[language].running : t[language].stopped}
        </span>
      ),
    },
    {
      key: 'uptime',
      label: t[language].uptime,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 border-b border-border">
        <DataTable
          columns={columns}
          data={mockBots}
          onRowClick={(row) => {
            setSelectedBot(row);
            if (onBotClick) {
              onBotClick(row);
            }
          }}
          selectedRow={selectedBot}
          selectionMode="single"
        />
      </div>
    </div>
  );
}
