import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { apiService } from '../../services/api-service';
import { mapPoolJobRelationToJobPair } from '../../utils/jobPairUtils';

interface ServerDetailsPageProps {
  serverId: number;
  serverName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

export function ServerDetailsPage({ serverId, serverName, language, onBack }: ServerDetailsPageProps) {
  const [rowsRaw, setRowsRaw] = useState<any[]>([]);
  const [serverRaw, setServerRaw] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [configJson, setConfigJson] = useState('');

  const t = {
    en: {
      back: 'Back to Servers',
      relationsTable: 'relations table',
      botName: 'Bot Name',
      botDescription: 'Bot Description',
      chainId: 'Chain Id',
      jobName: 'Job Name',
      poolsCount: 'Pools count',
      getConfig: 'GET CONFIG',
      resetServer: 'RESET SERVER',
      cancel: 'CANCEL',
      loading: 'Loading server relations…',
    },
    ru: {
      back: 'К списку серверов',
      relationsTable: 'таблица связей',
      botName: 'Имя бота',
      botDescription: 'Описание бота',
      chainId: 'ID сети',
      jobName: 'Имя задачи',
      poolsCount: 'Кол-во пулов',
      getConfig: 'ПОЛУЧИТЬ КОНФИГ',
      resetServer: 'СБРОСИТЬ СЕРВЕР',
      cancel: 'ОТМЕНА',
      loading: 'Загрузка связей сервера…',
      close: 'ЗАКРЫТЬ',
    },
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const [server, bots] = await Promise.all([
          apiService.setServerById(serverId),
          apiService.getBotsByServerId(serverId),
        ]);
        if (!mounted) return;
        setServerRaw(server ?? null);
        setRowsRaw(Array.isArray(bots) ? bots : []);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [serverId]);

  const rows = useMemo(
    () =>
      rowsRaw.map((item: any, idx: number) => ({
        rowId: `${item.botId ?? item.id ?? idx}`,
        botName: item.botName ?? '-',
        botDescription: item.description ?? '-',
        chainId: item.job?.chain?.chainId ?? '-',
        jobName: item.job?.jobType ?? '-',
        poolsCount: item.job?.poolsJobRelations?.length ?? '-',
      })),
    [rowsRaw],
  );

  const columns: Column[] = [
    { key: 'botName', label: t[language].botName, sortable: true, filterable: true },
    { key: 'botDescription', label: t[language].botDescription, sortable: true, filterable: true },
    { key: 'chainId', label: t[language].chainId, sortable: true, filterable: true },
    { key: 'jobName', label: t[language].jobName, sortable: true, filterable: true },
    { key: 'poolsCount', label: t[language].poolsCount, sortable: true, filterable: true },
  ];

  const mapBotParams = (bot: any) => ({
    botType: bot?.botName ?? '',
    paused: Boolean(bot?.paused),
    isRepeat: Boolean(bot?.isRepeat),
    delayBetweenRepeat: Number(bot?.delayBetweenRepeat ?? 0),
    maxJobs: Number(bot?.maxJobs ?? 0),
    maxErrors: Number(bot?.maxErrors ?? 0),
    timeoutMs: Number(bot?.timeoutMs ?? 0),
    description: bot?.description ?? '',
  });

  const mapDexJobParams = (job: any) => {
    const relations = job?.poolsJobRelations ?? [];
    const firstPool = relations?.[0]?.pool;
    const chainName = String(job?.chain?.name ?? '').toLowerCase();
    return {
      extraSettings: job?.extraSettings ?? {},
      cexPairId: null,
      jobType: job?.jobType ?? job?.job_type ?? '-',
      rpcUrl: job?.rpcUrl?.rpcUrl ?? null,
      source: chainName ? `dex:${chainName}` : 'dex:',
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
      pairsToQuote: relations.map(mapPoolJobRelationToJobPair),
    };
  };

  const mapCexJobParams = (job: any) => ({
    jobType: job?.job_type ?? job?.jobType ?? '-',
    source: job?.pair?.chain?.name ?? '',
    token0: job?.token0 ?? job?.pair?.token0 ?? '',
    token1: job?.token1 ?? job?.pair?.token1 ?? '',
  });

  const buildServerBotConfigs = () => {
    return (rowsRaw ?? []).map((bot: any) => ({
      id: String(bot?.botId ?? bot?.id ?? ''),
      botParams: mapBotParams(bot),
      jobParams: bot?.job ? mapDexJobParams(bot.job) : mapCexJobParams(bot?.cexJob),
    }));
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
          Server ID:{serverId} {t[language].relationsTable} ({rows.length})
        </h2>
      </div>

      {showConfig ? (
        <div className="flex-1 min-h-0 flex flex-col p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-foreground">{t[language].getConfig}</h3>
            <button
              onClick={() => setShowConfig(false)}
              className="px-4 py-1.5 text-sm bg-muted text-foreground rounded hover:bg-accent transition-colors"
            >
              {language === 'ru' ? t.ru.close : 'CLOSE'}
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
        <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
          <DataTable
            title={serverName}
            columns={columns}
            data={rows}
            language={language}
            isLoading={isLoading}
            loadingText={t[language].loading}
            getRowId={(params) => String(params.data?.rowId ?? '')}
          />
        </div>
      )}

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
        <button
          onClick={async () => {
            const ip = serverRaw?.ip;
            const port = serverRaw?.port;
            if (!ip || !port) return;
            await apiService.resetServerSettings(String(ip), String(port), {
              botsRulesList: buildServerBotConfigs(),
            });
          }}
          className="px-6 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t[language].resetServer}
        </button>
        <button
          onClick={() => {
            const configArray = buildServerBotConfigs();
            setConfigJson(JSON.stringify(configArray, null, 2));
            setShowConfig(true);
          }}
          className="px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity text-sm"
        >
          {t[language].getConfig}
        </button>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-muted text-foreground rounded hover:bg-accent transition-colors text-sm"
        >
          {t[language].cancel}
        </button>
      </div>
    </div>
  );
}
