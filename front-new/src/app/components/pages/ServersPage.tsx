import { DataTable, Column } from '../DataTable';
import { Plus } from 'lucide-react';
import { showDeleteToast } from '../../utils/toast';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectServersDataResponse, selectServersMeta } from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { ServerForm } from '../forms/ServerForm';

const DELETE_UNDO_MS = 5000;
const STATUS_REFRESH_MS = 15000;

function buildServerBaseUrl(ip: string, port: string): string {
  const normalizedIp = String(ip ?? '').trim();
  const normalizedPort = String(port ?? '').trim();
  return normalizedPort ? `http://${normalizedIp}:${normalizedPort}` : `http://${normalizedIp}`;
}

export function ServersPage({
  language,
  onServerClick,
}: {
  language: 'en' | 'ru';
  onServerClick?: (server: { id: number; name: string }) => void;
}) {
  const dispatch = useAppDispatch();
  const serversFromStore = useAppSelector(selectServersDataResponse);
  const serversMeta = useAppSelector(selectServersMeta);
  const [pendingDeleteServerIds, setPendingDeleteServerIds] = useState<Set<number>>(new Set());
  const [selectedServer, setSelectedServer] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingServerRaw, setEditingServerRaw] = useState<any>(null);
  const deleteServerTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const [statusByServerId, setStatusByServerId] = useState<Record<number, 'pending' | 'success' | 'error'>>({});

  useEffect(() => {
    if ((!serversMeta.isLoaded || serversMeta.error) && !serversMeta.isLoading) {
      dispatch(dbConfigActions.setServersData());
    }
  }, [dispatch, serversMeta.error, serversMeta.isLoaded, serversMeta.isLoading]);

  useEffect(() => {
    return () => {
      deleteServerTimeoutsRef.current.forEach(clearTimeout);
      deleteServerTimeoutsRef.current.clear();
    };
  }, []);

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
      .filter((server) => !pendingDeleteServerIds.has(server.id));
  }, [pendingDeleteServerIds, serversFromStore]);

  useEffect(() => {
    if (!servers.length) {
      setStatusByServerId({});
      return;
    }

    let cancelled = false;
    const activeIds = new Set(servers.map((server) => server.id));

    setStatusByServerId((current) => {
      const next: Record<number, 'pending' | 'success' | 'error'> = {};
      servers.forEach((server) => {
        next[server.id] = current[server.id] ?? 'pending';
      });
      return next;
    });

    const checkServer = async (server: { id: number; ip: string; port: string }) => {
      try {
        const response = await fetch(`${buildServerBaseUrl(server.ip, server.port)}/bots/get-all`);
        const nextStatus: 'success' | 'error' = response.ok ? 'success' : 'error';
        if (!cancelled && activeIds.has(server.id)) {
          setStatusByServerId((current) => ({ ...current, [server.id]: nextStatus }));
        }
      } catch {
        if (!cancelled && activeIds.has(server.id)) {
          setStatusByServerId((current) => ({ ...current, [server.id]: 'error' }));
        }
      }
    };

    const runChecks = () => {
      servers.forEach((server) => {
        setStatusByServerId((current) => ({ ...current, [server.id]: 'pending' }));
        void checkServer(server);
      });
    };

    runChecks();
    const timer = setInterval(runChecks, STATUS_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [servers]);

  const t = {
    en: {
      serverId: 'Server ID',
      status: 'Status',
      ip: 'IP',
      port: 'Port',
      serverName: 'Server Name',
      tableTitle: 'Servers',
      add: 'Add Server',
      pending: 'Waiting',
      success: 'OK',
      error: 'Error',
    },
    ru: {
      serverId: 'ID сервера',
      status: 'Статус',
      ip: 'IP',
      port: 'Порт',
      serverName: 'Имя сервера',
      tableTitle: 'Серверы',
      add: 'Добавить сервер',
      pending: 'Ожидание',
      success: 'Успех',
      error: 'Ошибка',
    },
  };

  const renderStatus = (row: any) => {
    const requestStatus = statusByServerId[Number(row.id)] ?? 'pending';

    if (requestStatus === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-500">
          <span className="size-1.5 rounded-full bg-yellow-500" />
          {t[language].pending}
        </span>
      );
    }
    if (requestStatus === 'error') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-destructive/20 text-destructive">
          <span className="size-1.5 rounded-full bg-destructive" />
          {t[language].error}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs bg-success/20 text-success">
        <span className="size-1.5 rounded-full bg-success" />
        {t[language].success}
      </span>
    );
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].serverId, sortable: true, filterable: true },
    {
      key: 'status',
      label: t[language].status,
      sortable: true,
      filterable: true,
      render: (_, row) => renderStatus(row),
    },
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
      <div className="flex-1 flex flex-col border-b border-border overflow-hidden">
        <DataTable
          title={t[language].tableTitle}
          headerActions={
            <button
              onClick={() => {
                setEditingServerRaw(null);
                setFormOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{t[language].add}</span>
            </button>
          }
          columns={columns}
          data={servers}
          language={language}
          isLoading={serversMeta.isLoading}
          loadingText={language === 'ru' ? 'Загрузка серверов…' : 'Loading Servers…'}
          onEdit={(row) => {
            setEditingServerRaw(row.raw ?? row);
            setFormOpen(true);
          }}
          onDelete={(row) => {
            setPendingDeleteServerIds((prev) => new Set(prev).add(row.id));
            const existing = deleteServerTimeoutsRef.current.get(row.id);
            if (existing) clearTimeout(existing);

            const tid = setTimeout(async () => {
              deleteServerTimeoutsRef.current.delete(row.id);
              try {
                await apiService.deletingServer(row.id);
                dispatch(dbConfigActions.refetchServersData());
              } finally {
                setPendingDeleteServerIds((prev) => {
                  const next = new Set(prev);
                  next.delete(row.id);
                  return next;
                });
              }
            }, DELETE_UNDO_MS);
            deleteServerTimeoutsRef.current.set(row.id, tid);

            showDeleteToast({
              itemName: row.name,
              itemType: language === 'en' ? 'Server' : 'Сервер',
              onUndo: () => {
                const scheduled = deleteServerTimeoutsRef.current.get(row.id);
                if (scheduled) clearTimeout(scheduled);
                deleteServerTimeoutsRef.current.delete(row.id);
                setPendingDeleteServerIds((prev) => {
                  const next = new Set(prev);
                  next.delete(row.id);
                  return next;
                });
              },
              language,
            });
          }}
          onRowDoubleClick={(row) => {
            setSelectedServer(row);
            onServerClick?.({ id: Number(row.id), name: row.name || `Server #${row.id}` });
          }}
          onRowClick={(row) => setSelectedServer(row)}
          selectedRow={selectedServer}
          selectionMode="single"
        />
      </div>

      <ServerForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingServerRaw(null);
        }}
        onSave={async (data) => {
          const payload = {
            ip: data.ip,
            port: data.port,
            serverName: data.serverName,
          };
          if (editingServerRaw) {
            const id = Number(editingServerRaw.serverId ?? editingServerRaw.id);
            await apiService.editServer(id, payload);
          } else {
            await apiService.createServer(payload);
          }
          dispatch(dbConfigActions.refetchServersData());
        }}
        initialData={
          editingServerRaw
            ? {
                ip: String(editingServerRaw.ip ?? ''),
                port: String(editingServerRaw.port ?? ''),
                serverName: String(editingServerRaw.serverName ?? editingServerRaw.name ?? ''),
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
