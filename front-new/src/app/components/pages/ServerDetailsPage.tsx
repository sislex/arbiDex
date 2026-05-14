import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { apiService } from '../../services/api-service';

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

  const t = {
    en: {
      back: 'Back to Servers',
      relationsTable: 'relations table',
      botName: 'Bot Name',
      botDescription: 'Bot Description',
      chainId: 'Chain Id',
      jobName: 'Job Name',
      pairsCount: 'Pairs count',
      getConfig: 'GET CONFIG',
      resetServer: 'RESET SERVER',
      cancel: 'CANCEL',
      loading: 'Loading server relations…',
    },
    ru: {
      back: 'К списку серверов',
      relationsTable: 'таблица связей',
      botName: 'Bot Name',
      botDescription: 'Bot Description',
      chainId: 'Chain Id',
      jobName: 'Job Name',
      pairsCount: 'Pairs count',
      getConfig: 'GET CONFIG',
      resetServer: 'RESET SERVER',
      cancel: 'CANCEL',
      loading: 'Загрузка связей сервера…',
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
        pairsCount: item.job?.quoteJobRelations?.length ?? '-',
      })),
    [rowsRaw],
  );

  const columns: Column[] = [
    { key: 'botName', label: t[language].botName, sortable: true, filterable: true },
    { key: 'botDescription', label: t[language].botDescription, sortable: true, filterable: true },
    { key: 'chainId', label: t[language].chainId, sortable: true, filterable: true },
    { key: 'jobName', label: t[language].jobName, sortable: true, filterable: true },
    { key: 'pairsCount', label: t[language].pairsCount, sortable: true, filterable: true },
  ];

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

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
        <button
          onClick={async () => {
            const ip = serverRaw?.ip;
            const port = serverRaw?.port;
            if (!ip || !port) return;
            await apiService.resetServerSettings(String(ip), String(port), []);
          }}
          className="px-6 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t[language].resetServer}
        </button>
        <button
          onClick={async () => {
            if (!serverRaw?.serverId) return;
            await apiService.setServerById(Number(serverRaw.serverId));
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
