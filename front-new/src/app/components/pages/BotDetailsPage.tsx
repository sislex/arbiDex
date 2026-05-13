import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { DataTable, Column } from '../DataTable';

interface Job {
  id: number;
  jobType: string;
  chainId: number;
  rpcUrl: string;
  pairsCount: number;
}

const mockJobs: Job[] = [
  { id: 87, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '14', pairsCount: 0 },
  { id: 86, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '14', pairsCount: 0 },
  { id: 85, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '14', pairsCount: 0 },
  { id: 84, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '14', pairsCount: 0 },
  { id: 83, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '14', pairsCount: 0 },
  { id: 82, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '13', pairsCount: 0 },
  { id: 81, jobType: 'get_Pools_From_Factory', chainId: 59144, rpcUrl: '13', pairsCount: 0 },
  { id: 80, jobType: 'get_Pools_From_Factory', chainId: 81457, rpcUrl: '13', pairsCount: 0 },
  { id: 79, jobType: 'get_Pools_From_Factory', chainId: 81457, rpcUrl: '13', pairsCount: 0 },
  { id: 78, jobType: 'get_Pools_From_Factory', chainId: 81457, rpcUrl: '13', pairsCount: 0 },
];

interface BotDetailsPageProps {
  botId: number;
  botName: string;
  language: 'en' | 'ru';
  onBack: () => void;
}

export function BotDetailsPage({ botId, botName, language, onBack }: BotDetailsPageProps) {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [configJson, setConfigJson] = useState('');

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
    },
    {
      key: 'rpcUrl',
      label: t[language].rpcUrl,
      sortable: true,
      filterable: true,
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

    const selectedJob = mockJobs.find(j => j.id === selectedJobId);
    const config = {
      botId,
      botName,
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
    <div className="flex-1 flex flex-col bg-background">
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
          Bot ID:{botId} {t[language].relationsTable} ({mockJobs.length})
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
          <div className="flex-1 overflow-hidden">
            <DataTable
              title={`${botName} Jobs`}
              columns={columns}
              data={mockJobs}
              language={language}
              onRowClick={(row) => setSelectedJobId(row.id)}
              selectedRow={mockJobs.find(j => j.id === selectedJobId)}
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
