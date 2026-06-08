import { ArrowLeft, ArrowRight, Menu, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { Switch } from '../ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAppDispatch } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import { apiService } from '../../services/api-service';
import { buildBotEditPayload, normalizeBotForStore } from '../../utils/bot';
import { buildServerControlPanelUrl } from '../../utils/server';
import { mapPoolJobRelationToJobPair } from '../../utils/jobPairUtils';

function getBotRowId(bot: any): string {
  return String(bot?.botId ?? bot?.id ?? '');
}

function mapBotToTableRow(bot: any) {
  return {
    rowId: getBotRowId(bot),
    paused: Boolean(bot.paused),
    botName: bot.botName ?? '-',
    botDescription: bot.description ?? '-',
    chainId: bot.job?.chain?.chainId ?? '-',
    jobName: bot.job?.jobType ?? '-',
    poolsCount: bot.job?.poolsJobRelations?.length ?? '-',
  };
}

interface ServerDetailsPageProps {
  serverId: number;
  serverName: string;
  language: 'en' | 'ru';
  backLabel?: string;
  onBack: () => void;
  highlightBotId?: number;
}

function normalizeServerBotForUpdate(bot: any, serverId: number, paused: boolean) {
  const cexJobId = bot.cexJobId ?? bot.cex_job_id ?? bot.cexJob?.id ?? null;
  const jobId = bot.jobId ?? bot.job_id ?? bot.job?.jobId ?? null;

  return buildBotEditPayload({
    ...bot,
    jobId,
    cexJobId,
    serverId: bot.serverId ?? bot.server?.serverId ?? serverId,
    paused,
  });
}

export function ServerDetailsPage({
  serverId,
  serverName,
  language,
  backLabel,
  onBack,
  highlightBotId,
}: ServerDetailsPageProps) {
  const dispatch = useAppDispatch();
  const botsRawByIdRef = useRef<Map<number, any>>(new Map());
  const [tableRows, setTableRows] = useState<ReturnType<typeof mapBotToTableRow>[]>([]);
  const [serverRaw, setServerRaw] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingPause, setIsUpdatingPause] = useState(false);
  const [updatingBotIds, setUpdatingBotIds] = useState<Set<number>>(new Set());
  const [showConfig, setShowConfig] = useState(false);
  const [configJson, setConfigJson] = useState('');
  const [selectedBotIds, setSelectedBotIds] = useState<Set<string>>(new Set());
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const t = {
    en: {
      back: 'Back to Servers',
      relationsTable: 'relations table',
      botName: 'Bot Name',
      botDescription: 'Bot Description',
      chainId: 'Chain Id',
      jobName: 'Job Name',
      poolsCount: 'Pools count',
      running: 'Running',
      getConfig: 'GET CONFIG',
      launchConfig: 'LAUNCH CONFIG',
      actions: 'Actions',
      startSelected: 'Start selected',
      stopSelected: 'Stop selected',
      pauseUpdateFailed: 'Failed to update bot pause state',
      pauseUpdateSuccess: (count: number, paused: boolean) =>
        paused ? `Stopped ${count} bot(s)` : `Started ${count} bot(s)`,
      cancel: 'CANCEL',
      loading: 'Loading server relations…',
      toControl: 'To control',
    },
    ru: {
      back: 'К списку серверов',
      relationsTable: 'таблица связей',
      botName: 'Имя бота',
      botDescription: 'Описание бота',
      chainId: 'ID сети',
      jobName: 'Имя задачи',
      poolsCount: 'Кол-во пулов',
      running: 'Запущен',
      getConfig: 'ПОЛУЧИТЬ КОНФИГ',
      launchConfig: 'ЗАПУСТИТЬ КОНФИГ',
      actions: 'Действия',
      startSelected: 'Запустить выбранные',
      stopSelected: 'Остановить выбранные',
      pauseUpdateFailed: 'Не удалось обновить состояние паузы ботов',
      pauseUpdateSuccess: (count: number, paused: boolean) =>
        paused ? `Остановлено ботов: ${count}` : `Запущено ботов: ${count}`,
      cancel: 'ОТМЕНА',
      loading: 'Загрузка связей сервера…',
      close: 'ЗАКРЫТЬ',
      toControl: 'К control',
    },
  };

  const controlPanelUrl = useMemo(
    () => buildServerControlPanelUrl(serverRaw?.ip ?? '', serverRaw?.port ?? ''),
    [serverRaw],
  );

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

        const nextBots = Array.isArray(bots) ? bots : [];
        const nextBotsById = new Map<number, any>();
        const nextTableRows: ReturnType<typeof mapBotToTableRow>[] = [];
        const nextSelectedIds = new Set<string>();

        nextBots.forEach((bot) => {
          const id = Number(bot.botId ?? bot.id);
          if (!Number.isFinite(id)) return;
          nextBotsById.set(id, bot);
          nextTableRows.push(mapBotToTableRow(bot));
          nextSelectedIds.add(String(id));
        });

        botsRawByIdRef.current = nextBotsById;
        setServerRaw(server ?? null);
        setTableRows(nextTableRows);
        setSelectedBotIds(nextSelectedIds);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [serverId]);

  const allBotIds = useMemo(() => tableRows.map((row) => String(row.rowId)), [tableRows]);

  const allSelected = allBotIds.length > 0 && allBotIds.every((id) => selectedBotIds.has(id));
  const someSelected = allBotIds.some((id) => selectedBotIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (el) {
      el.indeterminate = someSelected && !allSelected;
    }
  }, [allSelected, someSelected]);

  const toggleBot = useCallback((rowId: string) => {
    setSelectedBotIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  }, []);

  const toggleAllBots = useCallback(() => {
    setSelectedBotIds(allSelected ? new Set() : new Set(allBotIds));
  }, [allBotIds, allSelected]);

  const patchBotsPause = useCallback((updates: Map<number, boolean>) => {
    for (const [id, paused] of updates) {
      const bot = botsRawByIdRef.current.get(id);
      if (bot) {
        botsRawByIdRef.current.set(id, { ...bot, paused });
      }
    }

    setTableRows((current) =>
      current.map((row) => {
        const id = Number(row.rowId);
        if (!updates.has(id)) return row;
        return { ...row, paused: updates.get(id)! };
      }),
    );
  }, []);

  const applyPauseUpdates = useCallback(
    async (bots: any[], paused: boolean) => {
      const botsPayload = bots
        .map((bot) => normalizeServerBotForUpdate(bot, serverId, paused))
        .filter((bot) => Number.isFinite(Number(bot.botId)));

      if (botsPayload.length === 0) return;

      const result = await apiService.bulkUpdateBots(botsPayload);
      if (!result?.success) {
        throw new Error(t[language].pauseUpdateFailed);
      }

      const pauseById = new Map<number, boolean>();
      for (const bot of result.bots ?? botsPayload) {
        const id = Number(bot.botId ?? bot.id);
        if (Number.isFinite(id)) {
          pauseById.set(id, Boolean(bot.paused ?? paused));
        }
      }
      patchBotsPause(pauseById);

      dispatch(
        dbConfigActions.upsertBots({
          bots: (result.bots ?? botsPayload).map((bot) => normalizeBotForStore(bot)),
        }),
      );

      return botsPayload.length;
    },
    [dispatch, language, patchBotsPause, serverId, t],
  );

  const handleToggleBotPaused = useCallback(
    async (rowId: string, running: boolean) => {
      const id = Number(rowId);
      const bot = botsRawByIdRef.current.get(id);
      if (!bot || updatingBotIds.has(id)) return;

      const prevPaused = Boolean(bot.paused);
      const nextPaused = !running;

      patchBotsPause(new Map([[id, nextPaused]]));
      setUpdatingBotIds((prev) => new Set(prev).add(id));

      try {
        await applyPauseUpdates([{ ...bot, paused: nextPaused }], nextPaused);
      } catch (error) {
        patchBotsPause(new Map([[id, prevPaused]]));
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message || t[language].pauseUpdateFailed);
      } finally {
        setUpdatingBotIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [applyPauseUpdates, patchBotsPause, t, updatingBotIds],
  );

  const columns: Column[] = useMemo(
    () => [
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
            checked={selectedBotIds.has(String(row.rowId))}
            onChange={() => toggleBot(String(row.rowId))}
            className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
            onClick={(event) => event.stopPropagation()}
          />
        ),
      },
      {
        key: 'paused',
        label: t[language].running,
        sortable: true,
        filterable: false,
        render: (_, row) => (
          <div
            className="flex h-full items-center"
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <Switch
              checked={!row.paused}
              disabled={updatingBotIds.has(Number(row.rowId)) || isUpdatingPause}
              onCheckedChange={(checked) => void handleToggleBotPaused(String(row.rowId), checked)}
              aria-label={t[language].running}
            />
          </div>
        ),
      },
      { key: 'botName', label: t[language].botName, sortable: true, filterable: true },
      { key: 'botDescription', label: t[language].botDescription, sortable: true, filterable: true },
      { key: 'chainId', label: t[language].chainId, sortable: true, filterable: true },
      { key: 'jobName', label: t[language].jobName, sortable: true, filterable: true },
      { key: 'poolsCount', label: t[language].poolsCount, sortable: true, filterable: true },
    ],
    [
      allSelected,
      handleToggleBotPaused,
      isUpdatingPause,
      language,
      selectedBotIds,
      t,
      toggleAllBots,
      toggleBot,
      updatingBotIds,
    ],
  );

  const getSelectedBotsRaw = useCallback(() => {
    return [...botsRawByIdRef.current.values()].filter((bot) =>
      selectedBotIds.has(getBotRowId(bot)),
    );
  }, [selectedBotIds]);

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

  const buildServerBotConfigs = useCallback(() => {
    return getSelectedBotsRaw().map((bot: any) => ({
      id: String(bot?.botId ?? bot?.id ?? ''),
      botParams: mapBotParams(bot),
      jobParams: bot?.job ? mapDexJobParams(bot.job) : mapCexJobParams(bot?.cexJob),
    }));
  }, [getSelectedBotsRaw]);

  const handleSetPausedForSelected = useCallback(
    async (paused: boolean) => {
      const selectedBots = getSelectedBotsRaw();
      if (selectedBots.length === 0) return;

      const prevPausedById = new Map(
        selectedBots.map((bot) => [Number(bot.botId ?? bot.id), Boolean(bot.paused)]),
      );
      const optimistic = new Map<number, boolean>();
      selectedBots.forEach((bot) => {
        const id = Number(bot.botId ?? bot.id);
        if (Number.isFinite(id)) optimistic.set(id, paused);
      });
      patchBotsPause(optimistic);

      setIsUpdatingPause(true);
      try {
        const count = await applyPauseUpdates(
          selectedBots.map((bot) => ({ ...bot, paused })),
          paused,
        );
        toast.success(t[language].pauseUpdateSuccess(count ?? selectedBots.length, paused));
      } catch (error) {
        patchBotsPause(prevPausedById);
        const message = error instanceof Error ? error.message : String(error);
        toast.error(message || t[language].pauseUpdateFailed);
      } finally {
        setIsUpdatingPause(false);
      }
    },
    [applyPauseUpdates, getSelectedBotsRaw, language, patchBotsPause, t],
  );

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
          Server ID:{serverId} {t[language].relationsTable} ({tableRows.length})
        </h2>
        {controlPanelUrl ? (
          <a
            href={controlPanelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-success/15 text-success rounded hover:bg-success/25 transition-colors text-sm"
            title={t[language].toControl}
          >
            <span>{t[language].toControl}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        ) : null}
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
            headerActions={
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
                    disabled={selectedBotIds.size === 0 || isUpdatingPause}
                    onClick={() => void handleSetPausedForSelected(false)}
                  >
                    {t[language].startSelected}
                    {selectedBotIds.size > 0 ? ` (${selectedBotIds.size})` : ''}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={selectedBotIds.size === 0 || isUpdatingPause}
                    onClick={() => void handleSetPausedForSelected(true)}
                  >
                    {t[language].stopSelected}
                    {selectedBotIds.size > 0 ? ` (${selectedBotIds.size})` : ''}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            }
            columns={columns}
            data={tableRows}
            language={language}
            isLoading={isLoading}
            loadingText={t[language].loading}
            getRowId={(params) => String(params.data?.rowId ?? '')}
            highlightRowId={highlightBotId != null ? String(highlightBotId) : null}
            getRowHighlightId={(row) => String(row.rowId)}
          />
        </div>
      )}

      <div className="h-16 border-t border-border bg-card flex items-center justify-end gap-3 px-4">
        <button
          disabled={selectedBotIds.size === 0}
          onClick={async () => {
            const ip = serverRaw?.ip;
            const port = serverRaw?.port;
            if (!ip || !port || selectedBotIds.size === 0) return;
            await apiService.resetServerSettings(String(ip), String(port), {
              botsRulesList: buildServerBotConfigs(),
            });
          }}
          className="px-6 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 transition-opacity flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className="w-4 h-4" />
          {t[language].launchConfig}
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
