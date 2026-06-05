import { DataTable, Column } from '../DataTable';
import { Copy, Play, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { showDeleteToast } from '../../utils/toast';
import { cancelPendingDelete, schedulePendingDelete } from '../../utils/pendingDeleteScheduler';
import { resolveBotDexJobId } from '../../utils/botJobId';
import { apiService } from '../../services/api-service';
import { BotForm, type BotFormValues } from '../forms/BotForm';

const BOTS_DELETE_SCOPE = 'bots';

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
  const botsFromStore = useAppSelector(selectBotsDataResponse);
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

  const bots = useMemo(() => {
    return botsFromStore
      .map((bot: any) => {
        const id = bot.botId ?? bot.id;
        const jobId = resolveBotDexJobId(bot);
        const cexJobId = bot.cexJobId ?? bot.cex_job_id;
        const job = jobId != null ? jobById.get(jobId) : cexJobById.get(cexJobId);
        const serverId = Number(bot.serverId ?? bot.server_id);
        const server = serverById.get(serverId);

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
      })
      .filter((bot) => !pendingDeleteBotIds.has(bot.id));
  }, [botsFromStore, cexJobById, jobById, pendingDeleteBotIds, serverById]);

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
    },
  };

  const columns: Column[] = [
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
            <button
              onClick={() => {
                setEditingBotRaw(null);
                setCopiedBotInitialData(undefined);
                setFormOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{language === 'en' ? 'Add Bot' : 'Добавить Bot'}</span>
            </button>
          }
          columns={columns}
          data={bots}
          language={language}
          isLoading={
            botsMeta.isLoading ||
            jobsMeta.isLoading ||
            cexJobsMeta.isLoading ||
            serversMeta.isLoading
          }
          loadingText="Loading Bots…"
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
                  <Play className="w-3.5 h-3.5 text-success" />
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
                <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </>
          )}
          onDelete={(row) => {
            setPendingDeleteBotIds((prev) => new Set(prev).add(row.id));
            const deleteKey = `${BOTS_DELETE_SCOPE}:${row.id}`;

            schedulePendingDelete(deleteKey, async () => {
              await apiService.deletingBot(row.id);
              dispatch(dbConfigActions.refetchBotsListPageResources());
              setPendingDeleteBotIds((prev) => {
                const next = new Set(prev);
                next.delete(row.id);
                return next;
              });
            });

            showDeleteToast({
              itemName: row.name,
              itemType: language === 'en' ? 'Bot' : 'Bot',
              onUndo: () => {
                cancelPendingDelete(deleteKey);
                setPendingDeleteBotIds((prev) => {
                  const next = new Set(prev);
                  next.delete(row.id);
                  return next;
                });
              },
              language,
            });
          }}
          onRowDoubleClick={(row) => {
            setSelectedBot(row);
            onBotClick?.(row);
          }}
          selectedRow={selectedBot}
          selectionMode="single"
        />
      </div>

      <BotForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingBotRaw(null);
          setCopiedBotInitialData(undefined);
        }}
        onSave={async (data) => {
          const payload = {
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
          };

          if (editingBotRaw) {
            const id = Number(editingBotRaw.botId ?? editingBotRaw.id);
            await apiService.editBot(id, payload);
          } else {
            await apiService.createBot(payload);
          }
          dispatch(dbConfigActions.refetchBotsListPageResources());
        }}
        initialData={
          copiedBotInitialData ?? (editingBotRaw ? buildBotInitialData(editingBotRaw) : undefined)
        }
        language={language}
      />
    </div>
  );
}
