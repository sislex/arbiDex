import { DataTable, Column } from '../DataTable';
import { RefreshCw } from 'lucide-react';
import { showDeleteToast } from '../../utils/toast';
import { useState } from 'react';

const mockServers = [
  { id: 1, name: 'Server-US-1', ip: '192.168.1.10', cpu: '45%', memory: '62%', status: 'Online' },
  { id: 2, name: 'Server-EU-1', ip: '192.168.1.11', cpu: '78%', memory: '84%', status: 'Online' },
  { id: 3, name: 'Server-AS-1', ip: '192.168.1.12', cpu: '12%', memory: '31%', status: 'Offline' },
];

export function ServersPage({ language }: { language: 'en' | 'ru' }) {
  const [servers, setServers] = useState(mockServers);
  const t = {
    en: {
      title: 'Servers',
      name: 'Name',
      ip: 'IP Address',
      cpu: 'CPU',
      memory: 'Memory',
      status: 'Status',
      getConfig: 'Get Config',
      restart: 'Restart',
      online: 'Online',
      offline: 'Offline',
    },
    ru: {
      title: 'Серверы',
      name: 'Название',
      ip: 'IP-адрес',
      cpu: 'CPU',
      memory: 'Память',
      status: 'Статус',
      getConfig: 'Получить конфигурацию',
      restart: 'Перезапустить',
      online: 'Онлайн',
      offline: 'Оффлайн',
    },
  };

  const columns: Column[] = [
    { key: 'name', label: t[language].name, sortable: true },
    {
      key: 'ip',
      label: t[language].ip,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'cpu',
      label: t[language].cpu,
      render: (value) => {
        const percent = parseInt(value);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  percent > 70 ? 'bg-destructive' : percent > 50 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: value }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-10">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'memory',
      label: t[language].memory,
      render: (value) => {
        const percent = parseInt(value);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  percent > 70 ? 'bg-destructive' : percent > 50 ? 'bg-warning' : 'bg-success'
                }`}
                style={{ width: value }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-10">{value}</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: t[language].status,
      render: (value) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            value === 'Online'
              ? 'bg-success/20 text-success'
              : 'bg-destructive/20 text-destructive'
          }`}
        >
          {value === 'Online' ? t[language].online : t[language].offline}
        </span>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 border-b border-border">
        <DataTable
          columns={columns}
          data={servers}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => {
            const deletedServer = { ...row };
            setServers(servers.filter((s) => s.id !== row.id));
            showDeleteToast({
              itemName: row.name,
              itemType: language === 'en' ? 'Server' : 'Сервер',
              onUndo: () => setServers([...servers]),
              language,
            });
          }}
        />
      </div>

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity">
          {t[language].getConfig}
        </button>
        <button className="px-6 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          {t[language].restart}
        </button>
      </div>
    </div>
  );
}
