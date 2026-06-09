import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectChainsMeta,
  selectJobsDataResponse,
  selectJobsMeta,
  selectRpcUrlDataResponse,
  selectRpcUrlsMeta,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { resolveBotDexJobId } from '../../utils/botJobId';
import { mapPoolJobRelationToJobPair } from '../../utils/jobPairUtils';

interface BotDetailsPageProps {
  botId: number;
  botName: string;
  language: 'en' | 'ru';
  backLabel?: string;
  onBack: () => void;
  onGoToJob?: (payload: { jobId: number; jobName: string; botId: number }) => void;
  onGoToServer?: (payload: {
    id: number;
    name: string;
    serverId: number;
    serverName: string;
  }) => void;
}

export function BotDetailsPage({
  botId,
  botName,
  language,
  backLabel,
  onBack,
  onGoToJob,
  onGoToServer,
}: BotDetailsPageProps) {
  const dispatch = useAppDispatch();
  const jobsMeta = useAppSelector(selectJobsMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const rpcUrlsMeta = useAppSelector(selectRpcUrlsMeta);
  const jobsFromStore = useAppSelector(selectJobsDataResponse);
  const chains = useAppSelector(selectChainsDataResponse);
  const rpcUrls = useAppSelector(selectRpcUrlDataResponse);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [configJson, setConfigJson] = useState('');
  const [activeBotRaw, setActiveBotRaw] = useState<any>(null);
  const [activeCexJobRaw, setActiveCexJobRaw] = useState<any>(null);
  const [cexChainNameById, setCexChainNameById] = useState<Map<number, string>>(new Map());
  const [isBotDataLoading, setIsBotDataLoading] = useState(false);

  const t = {
    en: {
      back: 'Back to Bots',
      relationsTable: 'relations table',
      id: 'ID',
      jobType: 'Job Type',
      chainId: 'Chain Id',
      rpcUrl: 'Rpc Url',
      poolsCount: 'Pools count',
      getConfig: 'GET CONFIG',
      cancel: 'CANCEL',
      createForError: 'CREATE FOR ERROR',
      config: 'Configuration',
      close: 'Close',
      goToJob: 'Go to job',
      goToServer: 'Go to server',
    },
    ru: {
      back: 'К списку ботов',
      relationsTable: 'таблица связей',
      id: 'ID',
      jobType: 'Тип задачи',
      chainId: 'ID сети',
      rpcUrl: 'RPC URL',
      poolsCount: 'Кол-во пулов',
      getConfig: 'ПОЛУЧИТЬ КОНФИГ',
      cancel: 'ОТМЕНА',
      createForError: 'СОЗДАТЬ ДЛЯ ОШИБКИ',
      config: 'Конфигурация',
      close: 'Закрыть',
      goToJob: 'К задаче',
      goToServer: 'На сервер',
    },
  };

  const jobTarget = useMemo(() => {
    const jobId = resolveBotDexJobId(activeBotRaw);
    if (jobId == null) return null;

    const jobName =
      activeBotRaw?.job?.description ??
      activeBotRaw?.jobName ??
      activeBotRaw?.job?.jobType ??
      activeBotRaw?.job?.job_type ??
      `Job #${jobId}`;

    return { jobId, jobName: String(jobName) };
  }, [activeBotRaw]);

  const serverTarget = useMemo(() => {
    const serverId = Number(
      activeBotRaw?.server?.serverId ?? activeBotRaw?.serverId ?? activeBotRaw?.server_id,
    );
    if (!Number.isFinite(serverId)) return null;

    const serverName =
      activeBotRaw?.server?.serverName ??
      activeBotRaw?.serverName ??
      activeBotRaw?.server?.name ??
      `Server #${serverId}`;

    return { serverId, serverName };
  }, [activeBotRaw]);

  useEffect(() => {
    if ((!jobsMeta.isLoaded || jobsMeta.error) && !jobsMeta.isLoading) {
      dispatch(dbConfigActions.initJobsListPage());
    }
    if ((!chainsMeta.isLoaded || chainsMeta.error) && !chainsMeta.isLoading) {
      dispatch(dbConfigActions.setChainsData());
    }
    if ((!rpcUrlsMeta.isLoaded || rpcUrlsMeta.error) && !rpcUrlsMeta.isLoading) {
      dispatch(dbConfigActions.setRpcUrlsData());
    }
  }, [
    chainsMeta.error,
    chainsMeta.isLoaded,
    chainsMeta.isLoading,
    dispatch,
    jobsMeta.error,
    jobsMeta.isLoaded,
    jobsMeta.isLoading,
    rpcUrlsMeta.error,
    rpcUrlsMeta.isLoaded,
    rpcUrlsMeta.isLoading,
  ]);

  useEffect(() => {
    let mounted = true;
    const loadBot = async () => {
      if (mounted) setIsBotDataLoading(true);
      try {
        const cexChains = await apiService.getCexChainsData();
        if (!mounted) return;
        const cexChainMap = new Map<number, string>();
        (cexChains ?? []).forEach((chain: any) => {
          const id = Number(chain.id ?? chain.chainId);
          const name = String(chain.name ?? '');
          if (Number.isFinite(id) && name) cexChainMap.set(id, name);
        });
        setCexChainNameById(cexChainMap);

        const bot = await apiService.setBotById(botId);
        if (!mounted) return;
        setActiveBotRaw(bot);
        const assignedJobId = Number(bot?.job?.jobId ?? bot?.jobId ?? bot?.job_id);
        setSelectedJobId(Number.isFinite(assignedJobId) ? assignedJobId : null);

        const cexJobIdFromBot = Number(bot?.cexJob?.id ?? bot?.cexJobId ?? bot?.cex_job_id);
        if (Number.isFinite(cexJobIdFromBot)) {
          const cexJob = await apiService.getCexJobById(cexJobIdFromBot);
          if (!mounted) return;
          setActiveCexJobRaw(cexJob ?? null);
          return;
        }

        const botsList = await apiService.getBots();
        if (!mounted) return;
        const listBot = (botsList ?? []).find((item: any) => Number(item.botId ?? item.id) === botId);
        const cexJobIdFromList = Number(listBot?.cexJobId ?? listBot?.cex_job_id);
        if (Number.isFinite(cexJobIdFromList)) {
          const cexJob = await apiService.getCexJobById(cexJobIdFromList);
          if (!mounted) return;
          setActiveCexJobRaw(cexJob ?? null);
        } else {
          setActiveCexJobRaw(null);
        }
      } finally {
        if (mounted) setIsBotDataLoading(false);
      }
    };
    loadBot();
    return () => {
      mounted = false;
    };
  }, [botId]);

  const chainById = useMemo(
    () =>
      new Map(
        chains
          .map((chain: any) => [Number(chain.chainId ?? chain.id), String(chain.name ?? '')] as const)
          .filter(([id, name]) => Number.isFinite(id) && Boolean(name)),
      ),
    [chains],
  );
  const rpcById = useMemo(
    () =>
      new Map(
        rpcUrls
          .map((rpc: any) => [Number(rpc.rpcUrlId ?? rpc.id), String(rpc.rpcUrl ?? rpc.url ?? '')] as const)
          .filter(([id, url]) => Number.isFinite(id) && Boolean(url)),
      ),
    [rpcUrls],
  );

  const jobs = useMemo(
    () =>
      jobsFromStore.map((job: any) => ({
        id: Number(job.jobId ?? job.id),
        jobType: job.jobType ?? job.job_type ?? '-',
        chainId: job.chainId ?? '-',
        chainName: chainById.get(job.chainId) ?? String(job.chainId ?? '-'),
        rpcUrlId: Number(job.rpcUrlId ?? job.rpc_url_id ?? 0),
        rpcUrl:
          (typeof job.rpcUrl === 'string' && job.rpcUrl.startsWith('http') ? job.rpcUrl : '') ||
          (typeof rpcById.get(Number(job.rpcUrlId ?? job.rpc_url_id ?? 0)) === 'string'
            ? String(rpcById.get(Number(job.rpcUrlId ?? job.rpc_url_id ?? 0)))
            : ''),
        poolsCount: Number(job.poolsCount ?? job.pools_count ?? 0),
        raw: job,
      })),
    [chainById, jobsFromStore, rpcById],
  );

  const columns: Column[] = [
    {
      key: 'radio',
      label: '',
      render: (_, row) => (
        <input
          type="radio"
          name="job-select"
          checked={selectedJobId === row.id}
          onChange={() => setSelectedJobId(row.id)}
          className="w-4 h-4 accent-primary cursor-pointer"
        />
      ),
    },
    {
      key: 'id',
      label: t[language].id,
      sortable: true,
      filterable: true,
    },
    {
      key: 'jobType',
      label: t[language].jobType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'chainId',
      label: t[language].chainId,
      sortable: true,
      filterable: true,
      render: (_, row) => (
        <span className="text-xs text-muted-foreground">{row.chainName}</span>
      ),
    },
    {
      key: 'rpcUrl',
      label: t[language].rpcUrl,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className="font-mono text-xs text-muted-foreground">{value}</span>
      ),
    },
    {
      key: 'poolsCount',
      label: t[language].poolsCount,
      sortable: true,
      filterable: true,
    },
  ];

  const handleGetConfig = () => {
    const mapBotParams = (bot: any) => ({
      botType: bot?.botName ?? bot?.name ?? '',
      paused: Boolean(bot?.paused),
      isRepeat: Boolean(bot?.isRepeat),
      delayBetweenRepeat: Number(bot?.delayBetweenRepeat ?? 0),
      maxJobs: Number(bot?.maxJobs ?? 0),
      maxErrors: Number(bot?.maxErrors ?? 0),
      timeoutMs: Number(bot?.timeoutMs ?? 0),
      description: bot?.description ?? '',
    });

    const buildJobParams = (selectedJob: any, relations: any[], resolvedRpcUrl: string) => {
      const firstPool = relations?.[0]?.pool;
      const chainLabel = String(selectedJob?.chainName ?? '').trim().toLowerCase();
      return {
        extraSettings: selectedJob?.raw?.extraSettings ?? selectedJob?.extraSettings ?? {},
        cexPairId: null,
        jobType: selectedJob?.jobType ?? '-',
        rpcUrl: resolvedRpcUrl || '',
        source: chainLabel ? `dex:${chainLabel}` : 'dex:',
        opts: {
          tokenIn: {
            decimals: Number(firstPool?.token0?.decimals ?? 0),
            symbol: firstPool?.token0?.symbol ?? '',
            address: firstPool?.token0?.address ?? '',
          },
          tokenOut: {
            decimals: Number(firstPool?.token1?.decimals ?? 0),
            symbol: firstPool?.token1?.symbol ?? '',
            address: firstPool?.token1?.address ?? '',
          },
        },
        pairsToQuote: (relations ?? []).map(mapPoolJobRelationToJobPair),
      };
    };

    const mapCexJobParams = (job: any) => {
      const chainId = Number(job?.pair?.source ?? job?.source);
      const source =
        (typeof job?.pair?.chain?.name === 'string' && job.pair.chain.name) ||
        (Number.isFinite(chainId) ? cexChainNameById.get(chainId) : '') ||
        '';
      return {
        jobType: job?.job_type ?? job?.jobType ?? '-',
        source,
        token0: job?.token0 ?? job?.pair?.token0 ?? '',
        token1: job?.token1 ?? job?.pair?.token1 ?? '',
      };
    };

    const openConfig = async () => {
      if (activeCexJobRaw) {
        const cexConfig = {
          id: botId,
          botParams: mapBotParams(activeBotRaw),
          jobParams: mapCexJobParams(activeCexJobRaw),
        };
        setConfigJson(JSON.stringify(cexConfig, null, 2));
        setShowConfig(true);
        return;
      }

      if (!selectedJobId) return;
      const selectedJob = jobs.find((j) => j.id === selectedJobId);
      if (!selectedJob) return;
      const relations = await apiService.getPoolJobRelationsByJobId(selectedJobId);
      const rpcUrlId = Number(selectedJob?.raw?.rpcUrlId ?? selectedJob?.raw?.rpc_url_id ?? selectedJob?.rpcUrlId);
      const rpcUrlFromMap = Number.isFinite(rpcUrlId) ? rpcById.get(rpcUrlId) : '';
      const rpcUrlFromJobRaw =
        (typeof selectedJob?.raw?.rpcUrl?.rpcUrl === 'string' && selectedJob.raw.rpcUrl.rpcUrl) ||
        (typeof selectedJob?.raw?.rpcUrl?.url === 'string' && selectedJob.raw.rpcUrl.url) ||
        '';
      const rpcUrlValue =
        rpcUrlFromJobRaw ||
        (typeof rpcUrlFromMap === 'string' && rpcUrlFromMap) ||
        (typeof selectedJob?.rpcUrl === 'string' && selectedJob.rpcUrl.startsWith('http') ? selectedJob.rpcUrl : '') ||
        '';
      const config = {
        id: botId,
        botParams: mapBotParams(activeBotRaw),
        jobParams: buildJobParams(selectedJob, Array.isArray(relations) ? relations : [], rpcUrlValue),
      };
      setConfigJson(JSON.stringify(config, null, 2));
      setShowConfig(true);
    };

    void openConfig();
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-background">
      <div className="h-14 border-b border-border flex items-center px-4 gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel ?? t[language].back}
        </button>
        <div className="h-6 w-px bg-border" />
        <h2 className="text-foreground">
          Bot ID:{botId} {t[language].relationsTable} ({jobs.length})
        </h2>
        {(onGoToJob && jobTarget) || (onGoToServer && serverTarget) ? (
          <div className="ml-auto flex items-center gap-2">
            {onGoToJob && jobTarget ? (
              <button
                type="button"
                onClick={() =>
                  onGoToJob({
                    jobId: jobTarget.jobId,
                    jobName: jobTarget.jobName,
                    botId,
                  })
                }
                className="flex items-center gap-2 px-3 py-1.5 bg-success/15 text-success rounded hover:bg-success/25 transition-colors text-sm"
                title={t[language].goToJob}
              >
                <span>Job</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
            {onGoToServer && serverTarget ? (
              <button
                type="button"
                onClick={() =>
                  onGoToServer({
                    id: botId,
                    name: botName,
                    serverId: serverTarget.serverId,
                    serverName: serverTarget.serverName,
                  })
                }
                className="flex items-center gap-2 px-3 py-1.5 bg-success/15 text-success rounded hover:bg-success/25 transition-colors text-sm"
                title={t[language].goToServer}
              >
                <span>Server</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {showConfig ? (
        <div className="flex-1 min-h-0 flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-foreground">{t[language].config}</h3>
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-1.5 text-sm bg-muted text-foreground rounded hover:bg-accent transition-colors"
            >
              {t[language].close}
            </button>
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            <textarea
              value={configJson}
              readOnly
              className="flex-1 min-h-0 p-4 bg-input border border-border rounded text-sm text-foreground font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
            <DataTable
              title={`${botName} Jobs`}
              columns={columns}
              data={jobs}
              language={language}
              isLoading={jobsMeta.isLoading || chainsMeta.isLoading || rpcUrlsMeta.isLoading || isBotDataLoading}
              loadingText={language === 'ru' ? 'Загрузка Jobs…' : 'Loading Jobs…'}
              onRowClick={(row) => setSelectedJobId(row.id)}
              selectedRow={jobs.find(j => j.id === selectedJobId)}
            />
          </div>

          <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
            <button className="px-6 py-2 bg-muted text-foreground rounded hover:bg-accent transition-opacity text-sm uppercase">
              {t[language].createForError}
            </button>
            <button
              onClick={handleGetConfig}
              disabled={!selectedJobId && !activeCexJobRaw}
              className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase"
            >
              {t[language].getConfig}
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity text-sm uppercase"
            >
              {t[language].cancel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
