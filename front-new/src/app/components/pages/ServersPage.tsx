import { ArrowRight, Menu, Plus } from 'lucide-react';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { selectServersDataResponse, selectServersMeta } from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { buildServerControlPanelUrl, normalizeServerForStore } from '../../utils/server';
import { ServerForm } from '../forms/ServerForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const SERVERS_DELETE_SCOPE = 'servers';
const STATUS_REFRESH_MS = 15000;

function buildServerBaseUrl(ip: string, port: string): string {
  const normalizedIp = String(ip ?? '').trim();
  const normalizedPort = String(port ?? '').trim();
  return normalizedPort ? `http://${normalizedIp}:${normalizedPort}` : `http://${normalizedIp}`;
}

function mapServerRow(server: any) {
  return {
    id: Number(server.serverId ?? server.id),
    status: server.status ?? '',
    ip: server.ip ?? '',
    port: server.port ?? '',
    name: server.serverName ?? server.name ?? '',
    raw: server,
  };
}

export function ServersPage({
  language,
  onServerClick,
}: {
  language: 'en' | 'ru';
  onServerClick?: (server: { id: number; name: string }) => void;
}) {
  const dispatch = useAppDispatch();
  const serversRaw = useAppSelector(selectServersDataResponse);
  const serversMeta = useAppSelector(selectServersMeta);
  const [pendingDeleteServerIds, setPendingDeleteServerIds] = useState<Set<number>>(new Set());
  const [selectedServerIds, setSelectedServerIds] = useState<Set<number>>(new Set());
  const [highlightedServer, setHighlightedServer] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingServerRaw, setEditingServerRaw] = useState<any>(null);
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapServerRow>[]>([]);
  const [statusByServerId, setStatusByServerId] = useState<Record<number, 'pending' | 'success' | 'error'>>({});
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const serversFromStoreRef = useRef<any[] | null>(null);

  useEffect(() => {
    if ((!serversMeta.isLoaded || serversMeta.error) && !serversMeta.isLoading) {
      dispatch(dbConfigActions.setServersData());
    }
  }, [dispatch, serversMeta.error, serversMeta.isLoaded, serversMeta.isLoading]);

  useEffect(() => {
    const prevStore = serversFromStoreRef.current;
    const nextStore = Array.isArray(serversRaw) ? serversRaw : [];
    serversFromStoreRef.current = nextStore;

    if (!prevStore) {
      setTableRows(nextStore.map(mapServerRow));
      return;
    }

    const prevLen = prevStore.length;
    const nextLen = nextStore.length;

    if (prevLen > 0 && nextLen < prevLen) {
      const nextIds = new Set(nextStore.map((server: any) => Number(server.serverId ?? server.id)));
      setTableRows((current) => current.filter((row) => nextIds.has(row.id)));
      return;
    }

    if (prevLen === nextLen && prevStore === nextStore) {
      return;
    }

    setTableRows(nextStore.map(mapServerRow));
  }, [serversRaw]);

  const visibleServerIds = useMemo(() => {
    if (pendingDeleteServerIds.size === 0) {
      return tableRows.map((server) => server.id);
    }
    const ids: number[] = [];
    for (const server of tableRows) {
      if (!pendingDeleteServerIds.has(server.id)) {
        ids.push(server.id);
      }
    }
    return ids;
  }, [pendingDeleteServerIds, tableRows]);

  const visibleServersForStatus = useMemo(() => {
    return tableRows.filter((server) => !pendingDeleteServerIds.has(server.id));
  }, [pendingDeleteServerIds, tableRows]);

  const allServerIds = visibleServerIds;
  const allSelected = allServerIds.length > 0 && allServerIds.every((id) => selectedServerIds.has(id));
  const someSelected = allServerIds.some((id) => selectedServerIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const updatePendingDeleteServerIds = useCallback((updater: (prev: Set<number>) => Set<number>) => {
    startTransition(() => {
      setPendingDeleteServerIds(updater);
    });
  }, []);

  const toggleServer = useCallback((id: number) => {
    setSelectedServerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllServers = useCallback(() => {
    setSelectedServerIds(allSelected ? new Set() : new Set(allServerIds));
  }, [allServerIds, allSelected]);

  useEffect(() => {
    if (!visibleServersForStatus.length) {
      setStatusByServerId({});
      return;
    }

    let cancelled = false;
    const activeIds = new Set(visibleServersForStatus.map((server) => server.id));

    setStatusByServerId((current) => {
      const next: Record<number, 'pending' | 'success' | 'error'> = {};
      visibleServersForStatus.forEach((server) => {
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
      visibleServersForStatus.forEach((server) => {
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
  }, [visibleServersForStatus]);

  const t = {
    en: {
      serverId: 'Server ID',
      status: 'Status',
      ip: 'IP',
      port: 'Port',
      serverName: 'Server Name',
      tableTitle: 'Servers',
      add: 'Add Server',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      deleteFailed: 'Failed to delete servers',
      deleteType: 'Server',
      pending: 'Waiting',
      success: 'OK',
      error: 'Error',
      toControl: 'To control',
    },
    ru: {
      serverId: 'ID сервера',
      status: 'Статус',
      ip: 'IP',
      port: 'Порт',
      serverName: 'Имя сервера',
      tableTitle: 'Серверы',
      add: 'Добавить сервер',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      deleteFailed: 'Не удалось удалить серверы',
      deleteType: 'Сервер',
      pending: 'Ожидание',
      success: 'Успех',
      error: 'Ошибка',
      toControl: 'К control',
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

  const scheduleDelete = useCallback(
    (row: { id: number; name: string }) => {
      updatePendingDeleteServerIds((prev) => new Set(prev).add(row.id));
      setSelectedServerIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${SERVERS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteServers([row.id]);
        dispatch(dbConfigActions.removeServersByIds(result.deletedIds ?? [row.id]));
        updatePendingDeleteServerIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: row.name,
        itemType: t[language].deleteType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          updatePendingDeleteServerIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t, updatePendingDeleteServerIds],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedServerIds.size === 0) return;

    const deleteIds = [...selectedServerIds];

    updatePendingDeleteServerIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedServerIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(SERVERS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteServers(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      dispatch(dbConfigActions.removeServersByIds(result.deletedIds ?? deleteIds));
      updatePendingDeleteServerIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: deleteIds.length,
      itemType: language === 'en' ? 'servers' : 'серверов',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        updatePendingDeleteServerIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dispatch, language, selectedServerIds, t, updatePendingDeleteServerIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllServers}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
          title={
            allSelected
              ? language === 'ru'
                ? 'Снять все'
                : 'Deselect all'
              : language === 'ru'
                ? 'Отметить все'
                : 'Select all'
          }
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedServerIds.has(row.id)}
          onChange={() => toggleServer(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
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
      <div className="flex-1 flex flex-col overflow-hidden">
        <DataTable
          title={t[language].tableTitle}
          headerActions={
            <div className="flex items-center gap-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center justify-center p-2 bg-muted text-foreground rounded hover:bg-accent transition-colors"
                    aria-label={t[language].actions}
                    title={t[language].actions}
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={selectedServerIds.size === 0}
                    variant="destructive"
                    onClick={handleDeleteSelected}
                  >
                    {t[language].deleteSelected}
                    {selectedServerIds.size > 0 ? ` (${selectedServerIds.size})` : ''}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
          columns={columns}
          data={tableRows}
          excludeRowIds={pendingDeleteServerIds}
          getExcludeRowId={(row) => row.id}
          language={language}
          isLoading={serversMeta.isLoading}
          loadingText={language === 'ru' ? 'Загрузка серверов…' : 'Loading Servers…'}
          actionsColumnPosition="last"
          getRowId={(params) => String(params.data?.id ?? '')}
          onEdit={(row) => {
            setEditingServerRaw(row.raw ?? row);
            setFormOpen(true);
          }}
          onDelete={scheduleDelete}
          extraActions={(row) => {
            const controlUrl = buildServerControlPanelUrl(row.ip, row.port);
            if (!controlUrl) return null;

            return (
              <a
                href={controlUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="p-1.5 hover:bg-success/10 rounded transition-colors inline-flex"
                title={t[language].toControl}
              >
                <ArrowRight className="w-3.5 h-3.5 text-success" />
              </a>
            );
          }}
          onRowDoubleClick={(row) => {
            setHighlightedServer(row);
            onServerClick?.({ id: Number(row.id), name: row.name || `Server #${row.id}` });
          }}
          onRowClick={(row) => setHighlightedServer(row)}
          selectedRow={highlightedServer}
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
            const saved = await apiService.editServer(id, payload);
            dispatch(dbConfigActions.upsertServer({ server: normalizeServerForStore(saved) }));
          } else {
            const saved = await apiService.createServer(payload);
            dispatch(dbConfigActions.upsertServer({ server: normalizeServerForStore(saved) }));
          }
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
