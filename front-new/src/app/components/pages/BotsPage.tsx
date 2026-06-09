import { ArrowRight, Copy, Menu, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectBotsMeta,
  selectBotsDataResponse,
  selectCexJobsMeta,
  selectCexJobsDataResponse,
  selectJobsMeta,
  selectJobsDataResponse,
  selectServersMeta,
  selectServersDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import { resolveBotDexJobId } from '../../utils/botJobId';
import { apiService } from '../../services/api-service';
import { buildBotEditPayload, normalizeBotForStore } from '../../utils/bot';
import { BotForm, type BotFormValues } from '../forms/BotForm';
import {
  BulkSetBotsServerForm,
  type BulkSetBotsServerFormValues,
} from '../forms/BulkSetBotsServerForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const BOTS_DELETE_SCOPE = 'bots';

function mapBotRow(
  bot: any,
  lookup: {
    jobById: Map<number, any>;
    cexJobById: Map<number, any>;
    serverById: Map<number, any>;
  },
) {
  const id = Number(bot.botId ?? bot.id);
  const jobId = resolveBotDexJobId(bot);
  const cexJobId = bot.cexJobId ?? bot.cex_job_id;
  const job = jobId != null ? lookup.jobById.get(jobId) : lookup.cexJobById.get(Number(cexJobId));
  const serverId = Number(bot.serverId ?? bot.server_id);
  const server = lookup.serverById.get(serverId);

  return {
    id,
    name: bot.botName ?? bot.name ?? '',
    description: bot.description ?? '',
    job: bot.jobName ?? job?.jobType ?? job?.job_type ?? jobId ?? cexJobId ?? '',
    server: bot.serverName ?? server?.serverName ?? server?.name ?? String(serverId),
    serverId,
    poolsCount:
      bot.poolsCount ??
      bot.pools_count ??
      job?.poolsCount ??
      job?.pools_count ??
      0,
    raw: bot,
  };
}

export function BotsPage({
  language,
  onBotClick,
  onBotServerClick,
}: {
  language: 'en' | 'ru';
  onBotClick?: (bot: any) => void;
  onBotServerClick?: (bot: {
    id: number;
    name: string;
    serverId: number;
    serverName: string;
  }) => void;
}) {
  const dispatch = useAppDispatch();
  const botsRaw = useAppSelector(selectBotsDataResponse);
  const botsMeta = useAppSelector(selectBotsMeta);
  const jobsMeta = useAppSelector(selectJobsMeta);
  const cexJobsMeta = useAppSelector(selectCexJobsMeta);
  const serversMeta = useAppSelector(selectServersMeta);
  const jobs = useAppSelector(selectJobsDataResponse);
  const cexJobs = useAppSelector(selectCexJobsDataResponse);
  const servers = useAppSelector(selectServersDataResponse);
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBotRaw, setEditingBotRaw] = useState<any>(null);
  const [copiedBotInitialData, setCopiedBotInitialData] = useState<BotFormValues | undefined>(undefined);
  const [pendingDeleteBotIds, setPendingDeleteBotIds] = useState<Set<number>>(new Set());
  const [selectedBotIds, setSelectedBotIds] = useState<Set<number>>(new Set());
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapBotRow>[]>([]);
  const [setServerFormOpen, setSetServerFormOpen] = useState(false);
  const [isSettingServer, setIsSettingServer] = useState(false);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const botsFromStoreRef = useRef<any[] | null>(null);

  const buildBotInitialData = (bot: any): BotFormValues => ({
    botName: String(bot.botName ?? bot.name ?? ''),
    description: String(bot.description ?? ''),
    mode: bot.cexJobId || bot.cex_job_id ? 'CEX' : 'DEX',
    dexJobId: bot.jobId ? String(bot.jobId) : '',
    cexJobId: bot.cexJobId || bot.cex_job_id ? String(bot.cexJobId ?? bot.cex_job_id) : '',
    serverId: String(bot.serverId ?? bot.server_id ?? ''),
    paused: Boolean(bot.paused),
    isRepeat: Boolean(bot.isRepeat),
    delayBetweenRepeat: String(bot.delayBetweenRepeat ?? 5000),
    maxJobs: String(bot.maxJobs ?? 99999999),
    maxErrors: String(bot.maxErrors ?? 10),
    timeoutMs: String(bot.timeoutMs ?? 99999999),
  });

  useEffect(() => {
    if (
      (!botsMeta.isLoaded || botsMeta.error) &&
      !botsMeta.isLoading &&
      !jobsMeta.isLoading &&
      !cexJobsMeta.isLoading &&
      !serversMeta.isLoading
    ) {
      dispatch(dbConfigActions.initBotsListPage());
    }
  }, [
    botsMeta.error,
    botsMeta.isLoaded,
    botsMeta.isLoading,
    cexJobsMeta.isLoading,
    dispatch,
    jobsMeta.isLoading,
    serversMeta.isLoading,
  ]);

  const jobById = useMemo(() => {
    return new Map(jobs.map((job: any) => [Number(job.jobId ?? job.id), job]));
  }, [jobs]);

  const cexJobById = useMemo(() => {
    return new Map(cexJobs.map((job: any) => [job.id ?? job.cexJobId ?? job.cex_job_id, job]));
  }, [cexJobs]);

  const serverById = useMemo(() => {
    return new Map(servers.map((server: any) => [server.serverId ?? server.id, server]));
  }, [servers]);

  const lookupMaps = useMemo(
    () => ({ jobById, cexJobById, serverById }),
    [cexJobById, jobById, serverById],
  );

  const enrichBotRow = useCallback((bot: any) => mapBotRow(bot, lookupMaps), [lookupMaps]);

  useEffect(() => {
    const prevStore = botsFromStoreRef.current;
    const nextStore = Array.isArray(botsRaw) ? botsRaw : [];
    botsFromStoreRef.current = nextStore;

    if (!prevStore) {
      setTableRows(nextStore.map(enrichBotRow));
      return;
    }

    const prevLen = prevStore.length;
    const nextLen = nextStore.length;

    if (prevLen > 0 && nextLen < prevLen) {
      const nextIds = new Set(nextStore.map((bot: any) => Number(bot.botId ?? bot.id)));
      setTableRows((current) => current.filter((row) => nextIds.has(row.id)));
      return;
    }

    if (prevLen === nextLen && prevStore === nextStore) {
      return;
    }

    setTableRows(nextStore.map(enrichBotRow));
  }, [botsRaw, enrichBotRow]);

  const visibleBotIds = useMemo(() => {
    if (pendingDeleteBotIds.size === 0) {
      return tableRows.map((bot) => bot.id);
    }
    const ids: number[] = [];
    for (const bot of tableRows) {
      if (!pendingDeleteBotIds.has(bot.id)) {
        ids.push(bot.id);
      }
    }
    return ids;
  }, [pendingDeleteBotIds, tableRows]);

  const allBotIds = visibleBotIds;
  const allSelected = allBotIds.length > 0 && allBotIds.every((id) => selectedBotIds.has(id));
  const someSelected = allBotIds.some((id) => selectedBotIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const updatePendingDeleteBotIds = useCallback((updater: (prev: Set<number>) => Set<number>) => {
    startTransition(() => {
      setPendingDeleteBotIds(updater);
    });
  }, []);

  const toggleBot = useCallback((id: number) => {
    setSelectedBotIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllBots = useCallback(() => {
    setSelectedBotIds(allSelected ? new Set() : new Set(allBotIds));
  }, [allBotIds, allSelected]);

  const t = {
    en: {
      botId: 'Bot ID',
      botName: 'Bot Name',
      description: 'Description',
      job: 'Job',
      server: 'Server',
      poolsCount: 'Pools count',
      tableTitle: 'Bots',
      openServer: 'Open server',
      add: 'Add Bot',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      deleteFailed: 'Failed to delete bots',
      deleteType: 'Bot',
      setServer: 'Set server',
      setServerFailed: 'Failed to set server for bots',
      setServerSuccess: (count: number) => `Server updated for ${count} bot(s)`,
    },
    ru: {
      botId: 'ID бота',
      botName: 'Имя бота',
      description: 'Описание',
      job: 'Задача',
      server: 'Сервер',
      poolsCount: 'Кол-во пулов',
      tableTitle: 'Боты',
      openServer: 'Открыть сервер',
      add: 'Добавить Bot',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      deleteFailed: 'Не удалось удалить ботов',
      deleteType: 'Bot',
      setServer: 'Задать сервер',
      setServerFailed: 'Не удалось задать сервер для ботов',
      setServerSuccess: (count: number) => `Сервер обновлён для ${count} бот(ов)`,
    },
  };

  const botRawById = useMemo(() => {
    const map = new Map<number, any>();
    (Array.isArray(botsRaw) ? botsRaw : []).forEach((bot: any) => {
      const id = Number(bot.botId ?? bot.id);
      if (Number.isFinite(id)) map.set(id, bot);
    });
    return map;
  }, [botsRaw]);

  const selectedBotsForServer = useMemo(() => {
    return [...selectedBotIds].map((id) => {
      const row = tableRows.find((bot) => bot.id === id);
      return { id, name: row?.name ?? `Bot #${id}` };
    });
  }, [selectedBotIds, tableRows]);

  const handleSetServerForSelected = useCallback(
    async ({ serverId }: BulkSetBotsServerFormValues) => {
      const ids = [...selectedBotIds];
      const nextServerId = Number(serverId);
      if (!Number.isFinite(nextServerId) || ids.length === 0) return;

      const botsPayload = ids
        .map((id) => {
          const bot = botRawById.get(id);
          if (!bot) return null;
          return buildBotEditPayload(bot, { serverId: nextServerId });
        })
        .filter((bot): bot is NonNullable<typeof bot> => bot != null);

      if (botsPayload.length === 0) return;

      setIsSettingServer(true);
      try {
        const result = await apiService.bulkUpdateBots(botsPayload);
        if (!result?.success) {
          throw new Error(t[language].setServerFailed);
        }
        dispatch(
          dbConfigActions.upsertBots({
            bots: (result.bots ?? botsPayload).map((bot) => normalizeBotForStore(bot)),
          }),
        );
        toast.success(t[language].setServerSuccess(botsPayload.length));
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message || t[language].setServerFailed);
        throw error;
      } finally {
        setIsSettingServer(false);
      }
    },
    [botRawById, dispatch, language, selectedBotIds, t],
  );

  const scheduleDelete = useCallback(
    (row: { id: number; name: string }) => {
      updatePendingDeleteBotIds((prev) => new Set(prev).add(row.id));
      setSelectedBotIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${BOTS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteBots([row.id]);
        dispatch(dbConfigActions.removeBotsByIds(result.deletedIds ?? [row.id]));
        updatePendingDeleteBotIds((prev) => {
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
          updatePendingDeleteBotIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t, updatePendingDeleteBotIds],
  );

  const handleDeleteSelected = useCallback(() => {
    if (selectedBotIds.size === 0) return;

    const deleteIds = [...selectedBotIds];

    updatePendingDeleteBotIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedBotIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(BOTS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteBots(deleteIds);
      if (!result?.success) {
        throw new Error(t[language].deleteFailed);
      }
      dispatch(dbConfigActions.removeBotsByIds(result.deletedIds ?? deleteIds));
      updatePendingDeleteBotIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: deleteIds.length,
      itemType: language === 'en' ? 'bots' : 'ботов',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        updatePendingDeleteBotIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dispatch, language, selectedBotIds, t, updatePendingDeleteBotIds]);

  const columns: Column[] = [
    {
      key: 'checkbox',
      label: '',
      headerRender: () => (
        <input
          ref={headerCheckboxRef}
          type="checkbox"
          checked={allSelected}
          onChange={toggleAllBots}
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
          checked={selectedBotIds.has(row.id)}
          onChange={() => toggleBot(row.id)}
          className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
          onClick={(event) => event.stopPropagation()}
        />
      ),
    },
    { key: 'id', label: t[language].botId, sortable: true, filterable: true },
    { key: 'name', label: t[language].botName, sortable: true, filterable: true },
    { key: 'description', label: t[language].description, sortable: true, filterable: true },
    { key: 'job', label: t[language].job, sortable: true, filterable: true },
    { key: 'server', label: t[language].server, sortable: true, filterable: true },
    { key: 'poolsCount', label: t[language].poolsCount, sortable: true, filterable: true },
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
                  setEditingBotRaw(null);
                  setCopiedBotInitialData(undefined);
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
                    disabled={selectedBotIds.size === 0}
                    onClick={() => setSetServerFormOpen(true)}
                  >
                    {t[language].setServer}
                    {selectedBotIds.size > 0 ? ` (${selectedBotIds.size})` : ''}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={selectedBotIds.size === 0}
                    variant="destructive"
                    onClick={handleDeleteSelected}
                  >
                    {t[language].deleteSelected}
                    {selectedBotIds.size > 0 ? ` (${selectedBotIds.size})` : ''}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          }
          columns={columns}
          data={tableRows}
          excludeRowIds={pendingDeleteBotIds}
          getExcludeRowId={(row) => row.id}
          language={language}
          isLoading={
            botsMeta.isLoading ||
            jobsMeta.isLoading ||
            cexJobsMeta.isLoading ||
            serversMeta.isLoading
          }
          loadingText="Loading Bots…"
          actionsColumnPosition="last"
          getRowId={(params) => String(params.data?.id ?? '')}
          onEdit={(row) => {
            setEditingBotRaw(row.raw ?? row);
            setCopiedBotInitialData(undefined);
            setFormOpen(true);
          }}
          extraActions={(row) => (
            <>
              {onBotServerClick && Number.isFinite(row.serverId) ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onBotServerClick({
                      id: row.id,
                      name: row.name,
                      serverId: row.serverId,
                      serverName: row.server,
                    });
                  }}
                  className="p-1.5 hover:bg-success/10 rounded transition-colors"
                  title={t[language].openServer}
                >
                  <ArrowRight className="w-3.5 h-3.5 text-success" />
                </button>
              ) : null}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingBotRaw(null);
                  setCopiedBotInitialData(buildBotInitialData(row.raw ?? row));
                  setFormOpen(true);
                }}
                className="p-1.5 hover:bg-accent rounded transition-colors"
                title={language === 'ru' ? 'Копировать' : 'Copy'}
              >
                <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            </>
          )}
          onDelete={scheduleDelete}
          onRowClick={(row) => setSelectedBot(row)}
          onRowDoubleClick={(row) => {
            setSelectedBot(row);
            onBotClick?.(row);
          }}
          selectedRow={selectedBot}
        />
      </div>

      <BulkSetBotsServerForm
        open={setServerFormOpen}
        onClose={() => {
          if (isSettingServer) return;
          setSetServerFormOpen(false);
        }}
        onSave={handleSetServerForSelected}
        bots={selectedBotsForServer}
        language={language}
        isSaving={isSettingServer}
      />

      <BotForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingBotRaw(null);
          setCopiedBotInitialData(undefined);
        }}
        onSave={async (data) => {
          const base = editingBotRaw ?? {};
          const payload = buildBotEditPayload(
            {
              ...base,
              botName: data.botName.trim(),
              description: data.description.trim(),
              jobId: data.mode === 'DEX' ? Number(data.dexJobId) : null,
              cexJobId: data.mode === 'CEX' ? Number(data.cexJobId) : null,
              serverId: Number(data.serverId),
              paused: data.paused,
              isRepeat: data.isRepeat,
              delayBetweenRepeat: Number(data.delayBetweenRepeat),
              maxJobs: Number(data.maxJobs),
              maxErrors: Number(data.maxErrors),
              timeoutMs: Number(data.timeoutMs),
            },
            { serverId: Number(data.serverId) },
          );

          if (editingBotRaw) {
            const id = Number(editingBotRaw.botId ?? editingBotRaw.id);
            const saved = await apiService.editBot(id, payload);
            dispatch(
              dbConfigActions.upsertBot({
                bot: normalizeBotForStore({ ...saved, ...payload, botId: id }),
              }),
            );
          } else {
            const saved = await apiService.createBot(payload);
            dispatch(
              dbConfigActions.upsertBot({
                bot: normalizeBotForStore({ ...saved, ...payload }),
              }),
            );
          }
        }}
        initialData={
          copiedBotInitialData ?? (editingBotRaw ? buildBotInitialData(editingBotRaw) : undefined)
        }
        language={language}
      />
    </div>
  );
}
