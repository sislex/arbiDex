import { DataTable, Column } from '../DataTable';
import { RefreshCw } from 'lucide-react';
import { showDeleteToast } from '../../utils/toast';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectServersDataResponse } from '../../store/db-config/dbConfig.selectors';

export function ServersPage({ language }: { language: 'en' | 'ru' }) {
  const dispatch = useAppDispatch();
  const serversFromStore = useAppSelector(selectServersDataResponse);
  const [deletedServerIds, setDeletedServerIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    dispatch(dbConfigActions.setServersData());
  }, [dispatch]);

  const servers = useMemo(() => {
    return serversFromStore
      .map((server: any) => ({
        id: server.serverId ?? server.id,
        status: server.status ?? '',
        ip: server.ip ?? '',
        port: server.port ?? '',
        name: server.serverName ?? server.name ?? '',
        raw: server,
      }))
      .filter((server) => !deletedServerIds.has(server.id));
  }, [deletedServerIds, serversFromStore]);

  const t = {
    en: {
      serverId: 'Server ID',
      status: 'Status',
      ip: 'IP',
      port: 'Port',
      serverName: 'Server Name',
      getConfig: 'Get Config',
      restart: 'Restart',
    },
    ru: {
      serverId: 'Server ID',
      status: 'Status',
      ip: 'IP',
      port: 'Port',
      serverName: 'Server Name',
      getConfig: 'Получить конфигурацию',
      restart: 'Перезапустить',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].serverId, sortable: true, filterable: true },
    { key: 'status', label: t[language].status, sortable: true, filterable: true },
    {
      key: 'ip',
      label: t[language].ip,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    { key: 'port', label: t[language].port, sortable: true, filterable: true },
    { key: 'name', label: t[language].serverName, sortable: true, filterable: true },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="flex-1 border-b border-border">
        <DataTable
          columns={columns}
          data={servers}
          onEdit={(row) => console.log('Edit', row)}
          onDelete={(row) => {
            setDeletedServerIds(new Set([...deletedServerIds, row.id]));
            showDeleteToast({
              itemName: row.name,
              itemType: language === 'en' ? 'Server' : 'Сервер',
              onUndo: () => {
                const next = new Set(deletedServerIds);
                next.delete(row.id);
                setDeletedServerIds(next);
              },
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
