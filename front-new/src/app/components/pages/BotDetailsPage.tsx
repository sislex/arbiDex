import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsDataResponse,
  selectJobsDataResponse,
  selectJobsMeta,
  selectRpcUrlDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';

interface BotDetailsPageProps {
  botId: number;
  botName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

export function BotDetailsPage({ botId, botName, language, onBack }: BotDetailsPageProps) {
  const dispatch = useAppDispatch();
  const jobsMeta = useAppSelector(selectJobsMeta);
  const jobsFromStore = useAppSelector(selectJobsDataResponse);
  const chains = useAppSelector(selectChainsDataResponse);
  const rpcUrls = useAppSelector(selectRpcUrlDataResponse);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [configJson, setConfigJson] = useState('');
  const [activeBotRaw, setActiveBotRaw] = useState<any>(null);

  const t = {
    en: {
      back: 'Back to Bots',
      relationsTable: 'relations table',
      id: 'ID',
      jobType: 'Job Type',
      chainId: 'Chain Id',
      rpcUrl: 'Rpc Url',
      pairsCount: 'Pairs count',
      getConfig: 'GET CONFIG',
      cancel: 'CANCEL',
      createForError: 'CREATE FOR ERROR',
      config: 'Configuration',
      close: 'Close',
    },
    ru: {
      back: 'К списку ботов',
      relationsTable: 'таблица связей',
      id: 'ID',
      jobType: 'Тип задачи',
      chainId: 'ID сети',
      rpcUrl: 'RPC URL',
      pairsCount: 'Кол-во пар',
      getConfig: 'ПОЛУЧИТЬ КОНФИГ',
      cancel: 'ОТМЕНА',
      createForError: 'СОЗДАТЬ ДЛЯ ОШИБКИ',
      config: 'Конфигурация',
      close: 'Закрыть',
    },
  };

  useEffect(() => {
    if ((!jobsMeta.isLoaded || jobsMeta.error) && !jobsMeta.isLoading) {
      dispatch(dbConfigActions.initJobsListPage());
    }
  }, [dispatch, jobsMeta.error, jobsMeta.isLoaded, jobsMeta.isLoading]);

  useEffect(() => {
    let mounted = true;
    const loadBot = async () => {
      const bot = await apiService.setBotById(botId);
      if (!mounted) return;
      setActiveBotRaw(bot);
      const assignedJobId = Number(bot?.job?.jobId ?? bot?.jobId ?? bot?.job_id);
      setSelectedJobId(Number.isFinite(assignedJobId) ? assignedJobId : null);
    };
    loadBot();
    return () => {
      mounted = false;
    };
  }, [botId]);

  const chainById = useMemo(() => new Map(chains.map((chain: any) => [chain.chainId ?? chain.id, chain.name])), [chains]);
  const rpcById = useMemo(
    () => new Map(rpcUrls.map((rpc: any) => [rpc.rpcUrlId ?? rpc.id, rpc.rpcUrl ?? rpc.url])),
    [rpcUrls],
  );

  const jobs = useMemo(
    () =>
      jobsFromStore.map((job: any) => ({
        id: Number(job.jobId ?? job.id),
        jobType: job.jobType ?? job.job_type ?? '-',
        chainId: job.chainId ?? '-',
        chainName: chainById.get(job.chainId) ?? String(job.chainId ?? '-'),
        rpcUrlId: job.rpcUrlId ?? '-',
        rpcUrl: rpcById.get(job.rpcUrlId) ?? String(job.rpcUrlId ?? '-'),
        pairsCount: Number(job.pairsCount ?? job.pairs_count ?? 0),
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
      key: 'pairsCount',
      label: t[language].pairsCount,
      sortable: true,
      filterable: true,
    },
  ];

  const handleGetConfig = () => {
    if (!selectedJobId) return;

    const selectedJob = jobs.find(j => j.id === selectedJobId);
    const config = {
      botId,
      botName,
      bot: activeBotRaw,
      job: selectedJob,
      timestamp: new Date().toISOString(),
      settings: {
        maxRetries: 3,
        timeout: 30000,
        autoRestart: true,
      },
    };

    setConfigJson(JSON.stringify(config, null, 2));
    setShowConfig(true);
  };

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
        <h2 className="text-foreground">
          Bot ID:{botId} {t[language].relationsTable} ({jobs.length})
        </h2>
      </div>

      {showConfig ? (
        <div className="flex-1 flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-foreground">{t[language].config}</h3>
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-1.5 text-sm bg-muted text-foreground rounded hover:bg-accent transition-colors"
            >
              {t[language].close}
            </button>
          </div>
          <textarea
            value={configJson}
            readOnly
            className="flex-1 p-4 bg-input border border-border rounded text-sm text-foreground font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      ) : (
        <>
          <div className="flex-1 min-h-0 min-w-0 overflow-hidden">
            <DataTable
              title={`${botName} Jobs`}
              columns={columns}
              data={jobs}
              language={language}
              isLoading={jobsMeta.isLoading}
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
              disabled={!selectedJobId}
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
