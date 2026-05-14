import { DataTable, Column } from '../DataTable';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectBotsMeta,
  selectBotsDataResponse,
  selectCexJobsMeta,
  selectCexJobsDataResponse,
  selectJobsMeta,
  selectJobsDataResponse,
  selectPairsMeta,
  selectPairsDataResponse,
  selectServersMeta,
  selectServersDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';
import { apiService } from '../../services/api-service';
import { BotForm } from '../forms/BotForm';

const DELETE_UNDO_MS = 5000;

export function BotsPage({ language, onBotClick }: { language: 'en' | 'ru'; onBotClick?: (bot: any) => void }) {
  const dispatch = useAppDispatch();
  const botsFromStore = useAppSelector(selectBotsDataResponse);
  const botsMeta = useAppSelector(selectBotsMeta);
  const jobsMeta = useAppSelector(selectJobsMeta);
  const cexJobsMeta = useAppSelector(selectCexJobsMeta);
  const serversMeta = useAppSelector(selectServersMeta);
  const pairsMeta = useAppSelector(selectPairsMeta);
  const jobs = useAppSelector(selectJobsDataResponse);
  const cexJobs = useAppSelector(selectCexJobsDataResponse);
  const servers = useAppSelector(selectServersDataResponse);
  const pairs = useAppSelector(selectPairsDataResponse);
  const [selectedBot, setSelectedBot] = useState<any>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingBotRaw, setEditingBotRaw] = useState<any>(null);
  const [pendingDeleteBotIds, setPendingDeleteBotIds] = useState<Set<number>>(new Set());
  const deleteBotTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

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

    if ((!pairsMeta.isLoaded || pairsMeta.error) && !pairsMeta.isLoading) {
      dispatch(dbConfigActions.setPairsData());
    }
  }, [
    botsMeta.error,
    botsMeta.isLoaded,
    botsMeta.isLoading,
    cexJobsMeta.isLoading,
    dispatch,
    jobsMeta.isLoading,
    pairsMeta.error,
    pairsMeta.isLoaded,
    pairsMeta.isLoading,
    serversMeta.isLoading,
  ]);

  const jobById = useMemo(() => {
    return new Map(jobs.map((job: any) => [job.jobId ?? job.id, job]));
  }, [jobs]);

  const cexJobById = useMemo(() => {
    return new Map(cexJobs.map((job: any) => [job.id ?? job.cexJobId ?? job.cex_job_id, job]));
  }, [cexJobs]);

  const serverById = useMemo(() => {
    return new Map(servers.map((server: any) => [server.serverId ?? server.id, server]));
  }, [servers]);

  const pairCountByJobId = useMemo(() => {
    const counts = new Map<number, number>();
    pairs.forEach((pair: any) => {
      const jobId = pair.jobId ?? pair.job_id;
      if (jobId !== undefined && jobId !== null) {
        counts.set(jobId, (counts.get(jobId) ?? 0) + 1);
      }
    });
    return counts;
  }, [pairs]);

  const bots = useMemo(() => {
    return botsFromStore
      .map((bot: any) => {
        const id = bot.botId ?? bot.id;
        const jobId = bot.jobId ?? bot.job_id;
        const cexJobId = bot.cexJobId ?? bot.cex_job_id;
        const job = jobId ? jobById.get(jobId) : cexJobById.get(cexJobId);
        const server = serverById.get(bot.serverId ?? bot.server_id);

        return {
          id,
          name: bot.botName ?? bot.name ?? '',
          description: bot.description ?? '',
          job: bot.jobName ?? job?.jobType ?? job?.job_type ?? jobId ?? cexJobId ?? '',
          server: bot.serverName ?? server?.serverName ?? server?.name ?? bot.serverId ?? '',
          pairsCount: bot.pairsCount ?? bot.pairs_count ?? (jobId ? pairCountByJobId.get(jobId) : 0) ?? 0,
          raw: bot,
        };
      })
      .filter((bot) => !pendingDeleteBotIds.has(bot.id));
  }, [botsFromStore, cexJobById, jobById, pairCountByJobId, pendingDeleteBotIds, serverById]);

  useEffect(() => {
    return () => {
      deleteBotTimeoutsRef.current.forEach(clearTimeout);
      deleteBotTimeoutsRef.current.clear();
    };
  }, []);

  const t = {
    en: {
      botId: 'Bot ID',
      botName: 'Bot Name',
      description: 'Description',
      job: 'Job',
      server: 'Server',
      pairsCount: 'Pairs count',
      tableTitle: 'Bots',
    },
    ru: {
      botId: 'ID бота',
      botName: 'Имя бота',
      description: 'Описание',
      job: 'Джоба',
      server: 'Сервер',
      pairsCount: 'Кол-во пар',
      tableTitle: 'Боты',
    },
  };

  const columns: Column[] = [
    { key: 'id', label: t[language].botId, sortable: true, filterable: true },
    { key: 'name', label: t[language].botName, sortable: true, filterable: true },
    { key: 'description', label: t[language].description, sortable: true, filterable: true },
    { key: 'job', label: t[language].job, sortable: true, filterable: true },
    { key: 'server', label: t[language].server, sortable: true, filterable: true },
    { key: 'pairsCount', label: t[language].pairsCount, sortable: true, filterable: true },
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
            serversMeta.isLoading ||
            pairsMeta.isLoading
          }
          loadingText="Loading Bots…"
          onEdit={(row) => {
            setEditingBotRaw(row.raw ?? row);
            setFormOpen(true);
          }}
          onDelete={(row) => {
            setPendingDeleteBotIds((prev) => new Set(prev).add(row.id));
            const existing = deleteBotTimeoutsRef.current.get(row.id);
            if (existing) clearTimeout(existing);

            const tid = setTimeout(async () => {
              deleteBotTimeoutsRef.current.delete(row.id);
              try {
                await apiService.deletingBot(row.id);
                dispatch(dbConfigActions.refetchBotsListPageResources());
              } finally {
                setPendingDeleteBotIds((prev) => {
                  const next = new Set(prev);
                  next.delete(row.id);
                  return next;
                });
              }
            }, DELETE_UNDO_MS);
            deleteBotTimeoutsRef.current.set(row.id, tid);

            showDeleteToast({
              itemName: row.name,
              itemType: language === 'en' ? 'Bot' : 'Bot',
              onUndo: () => {
                const scheduled = deleteBotTimeoutsRef.current.get(row.id);
                if (scheduled) clearTimeout(scheduled);
                deleteBotTimeoutsRef.current.delete(row.id);
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
          editingBotRaw
            ? {
                botName: editingBotRaw.botName ?? editingBotRaw.name ?? '',
                description: editingBotRaw.description ?? '',
                mode: editingBotRaw.cexJobId ? 'CEX' : 'DEX',
                dexJobId: editingBotRaw.jobId ? String(editingBotRaw.jobId) : '',
                cexJobId: editingBotRaw.cexJobId ? String(editingBotRaw.cexJobId) : '',
                serverId: String(editingBotRaw.serverId ?? ''),
                paused: Boolean(editingBotRaw.paused),
                isRepeat: Boolean(editingBotRaw.isRepeat),
                delayBetweenRepeat: String(editingBotRaw.delayBetweenRepeat ?? 5000),
                maxJobs: String(editingBotRaw.maxJobs ?? 99999999),
                maxErrors: String(editingBotRaw.maxErrors ?? 10),
                timeoutMs: String(editingBotRaw.timeoutMs ?? 99999999),
              }
            : undefined
        }
        language={language}
      />
    </div>
  );
}
