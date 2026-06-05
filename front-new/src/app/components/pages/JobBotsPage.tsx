import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectBotsDataResponse,
  selectBotsMeta,
  selectJobsMeta,
  selectJobsDataResponse,
  selectServersMeta,
  selectServersDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { botUsesDexJob } from '../../utils/botJobId';

interface JobBotsPageProps {
  jobId: number;
  language: 'en' | 'ru';
  onBack: () => void;
  onBotClick?: (bot: { id: number; name: string }) => void;
}

export function JobBotsPage({ jobId, language, onBack, onBotClick }: JobBotsPageProps) {
  const dispatch = useAppDispatch();
  const normalizedJobId = Number(jobId);
  const botsFromStore = useAppSelector(selectBotsDataResponse);
  const botsMeta = useAppSelector(selectBotsMeta);
  const jobsMeta = useAppSelector(selectJobsMeta);
  const serversMeta = useAppSelector(selectServersMeta);
  const jobs = useAppSelector(selectJobsDataResponse);
  const servers = useAppSelector(selectServersDataResponse);
  const [jobBots, setJobBots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!botsMeta.isLoaded && !botsMeta.isLoading) {
      dispatch(dbConfigActions.initBotsListPage());
    }
    if (!serversMeta.isLoaded && !serversMeta.isLoading) {
      dispatch(dbConfigActions.setServersData());
    }
  }, [botsMeta.isLoaded, botsMeta.isLoading, dispatch, serversMeta.isLoaded, serversMeta.isLoading]);

  useEffect(() => {
    if (!Number.isFinite(normalizedJobId)) {
      setJobBots([]);
      return;
    }

    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const fromApi = await apiService.getBotsByJobId(normalizedJobId);
        if (mounted) setJobBots(Array.isArray(fromApi) ? fromApi : []);
      } catch (error) {
        if (!mounted) return;
        const fromStore = (botsFromStore ?? []).filter((bot) =>
          botUsesDexJob(bot, normalizedJobId),
        );
        if (fromStore.length > 0) {
          setJobBots(fromStore);
          setLoadError(null);
        } else {
          setLoadError(error instanceof Error ? error.message : String(error));
          setJobBots([]);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [botsFromStore, normalizedJobId]);

  const jobById = useMemo(
    () => new Map(jobs.map((job: any) => [Number(job.jobId ?? job.id), job])),
    [jobs],
  );

  const serverById = useMemo(
    () => new Map(servers.map((server: any) => [Number(server.serverId ?? server.id), server])),
    [servers],
  );

  const bots = useMemo(() => {
    return jobBots.map((bot: any) => {
      const id = Number(bot.botId ?? bot.id);
      const botJobId = Number(bot.jobId ?? bot.job_id ?? normalizedJobId);
      const job = jobById.get(botJobId);
      const serverId = Number(bot.serverId ?? bot.server_id);
      const server = serverById.get(serverId);

      return {
        id,
        name: bot.botName ?? bot.name ?? '',
        description: bot.description ?? '',
        job: bot.jobName ?? job?.jobType ?? job?.job_type ?? botJobId,
        server: bot.serverName ?? server?.serverName ?? server?.name ?? String(serverId),
        serverId,
        poolsCount: bot.poolsCount ?? bot.pools_count ?? job?.poolsCount ?? job?.pools_count ?? 0,
        raw: bot,
      };
    });
  }, [jobBots, jobById, normalizedJobId, serverById]);

  const t = {
    en: {
      back: 'Back to DEX jobs',
      header: `Job ID: ${normalizedJobId} — relations`,
      botId: 'Bot ID',
      botName: 'Bot Name',
      description: 'Description',
      job: 'Job',
      server: 'Server',
      poolsCount: 'Pools count',
      openBot: 'Open bot',
      loading: 'Loading bots…',
      empty: 'No bots use this job',
      loadError: 'Failed to load bots',
    },
    ru: {
      back: 'К списку DEX задач',
      header: `Job ID: ${normalizedJobId} — связи`,
      botId: 'ID бота',
      botName: 'Имя бота',
      description: 'Описание',
      job: 'Задача',
      server: 'Сервер',
      poolsCount: 'Кол-во пулов',
      openBot: 'Открыть бота',
      loading: 'Загрузка ботов…',
      empty: 'Нет ботов с этой задачей',
      loadError: 'Не удалось загрузить ботов',
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

  const handleOpenBot = (row: (typeof bots)[number]) => {
    onBotClick?.({ id: row.id, name: row.name });
  };

  const tableLoading =
    isLoading || botsMeta.isLoading || jobsMeta.isLoading || serversMeta.isLoading;

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t[language].back}
        </button>
        <div className="h-6 w-px bg-border" />
        <h2 className="text-foreground">{t[language].header}</h2>
      </div>

      {loadError ? (
        <div className="px-4 py-2 text-sm text-destructive border-b border-border">{loadError}</div>
      ) : null}

      {!tableLoading && bots.length === 0 && !loadError ? (
        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
          {t[language].empty}
        </div>
      ) : null}

      <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
        <DataTable
          title={t[language].header}
          columns={columns}
          data={bots}
          language={language}
          isLoading={tableLoading}
          loadingText={t[language].loading}
          onRowClick={(row) => onBotClick?.({ id: row.id, name: row.name })}
          onRowDoubleClick={(row) => onBotClick?.({ id: row.id, name: row.name })}
          extraActions={
            onBotClick
              ? (row) => (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleOpenBot(row);
                    }}
                    className="p-1.5 hover:bg-success/10 rounded transition-colors"
                    title={t[language].openBot}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-success" />
                  </button>
                )
              : undefined
          }
          getRowId={(params) => String(params.data?.id ?? '')}
        />
      </div>
    </div>
  );
}
