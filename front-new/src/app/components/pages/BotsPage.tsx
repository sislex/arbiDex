import { DataTable, Column } from '../DataTable';
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
  selectPairsMeta,
  selectPairsDataResponse,
  selectServersMeta,
  selectServersDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { showDeleteToast } from '../../utils/toast';

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
  const [deletedBotIds, setDeletedBotIds] = useState<Set<number>>(new Set());

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
      .filter((bot) => !deletedBotIds.has(bot.id));
  }, [botsFromStore, cexJobById, deletedBotIds, jobById, pairCountByJobId, serverById]);

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
      <DataTable
        title={t[language].tableTitle}
        columns={columns}
        data={bots}
        language={language}
        isLoading={botsMeta.isLoading}
        loadingText="Loading Bots…"
        onEdit={(row) => console.log('Edit', row)}
        onDelete={(row) => {
          setDeletedBotIds(new Set([...deletedBotIds, row.id]));
          showDeleteToast({
            itemName: row.name,
            itemType: language === 'en' ? 'Bot' : 'Bot',
            onUndo: () => {
              const next = new Set(deletedBotIds);
              next.delete(row.id);
              setDeletedBotIds(next);
            },
            language,
          });
        }}
        onRowClick={(row) => {
          setSelectedBot(row);
          onBotClick?.(row);
        }}
        selectedRow={selectedBot}
        selectionMode="single"
      />
    </div>
  );
}
