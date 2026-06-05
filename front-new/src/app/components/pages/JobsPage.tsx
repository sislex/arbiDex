import { ArrowRight, Copy, Menu, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { BulkCexBotsFromJobsForm } from '../forms/BulkCexBotsFromJobsForm';
import { CexJobForm } from '../forms/CexJobForm';
import { DexJobForm, type DexJobFormValues } from '../forms/DexJobForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectChainsMeta,
  selectCexChainsDataResponse,
  selectCexChainsMeta,
  selectCexJobsMeta,
  selectCexPairsDataResponse,
  selectCexPairsMeta,
  selectCexJobsDataResponse,
  selectChainsDataResponse,
  selectJobsMeta,
  selectJobsDataResponse,
  selectRpcUrlDataResponse,
  selectRpcUrlsMeta,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { buildCexChainNameById, resolveCexSourceFromJobAndPair } from '../../utils/cexPairSource';
import { normalizeDexJobForStore } from '../../utils/dexJob';
import { showBulkDeleteToast, showDeleteToast } from '../../utils/toast';
import {
  buildBulkDeleteKey,
  cancelPendingDelete,
  schedulePendingDelete,
} from '../../utils/pendingDeleteScheduler';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface JobsPageProps {
  language: 'en' | 'ru';
  type: 'dex' | 'cex';
  onDexJobClick?: (jobId: number, jobName: string) => void;
}

const CEX_JOBS_DELETE_SCOPE = 'cex-jobs';
const DEX_JOBS_DELETE_SCOPE = 'dex-jobs';

const formatExtra = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return typeof value === 'object' ? JSON.stringify(value) : String(value);
};

const normalizeCexSource = (raw: any) => {
  const value = String(raw ?? '').trim();
  return value ? value.toLowerCase() : '';
};

export function JobsPage({ language, type, onDexJobClick }: JobsPageProps) {
  const dispatch = useAppDispatch();
  const dexJobsFromStore = useAppSelector(selectJobsDataResponse);
  const cexJobsFromStore = useAppSelector(selectCexJobsDataResponse);
  const jobsMeta = useAppSelector(selectJobsMeta);
  const cexJobsMeta = useAppSelector(selectCexJobsMeta);
  const cexPairsMeta = useAppSelector(selectCexPairsMeta);
  const cexChainsMeta = useAppSelector(selectCexChainsMeta);
  const chainsMeta = useAppSelector(selectChainsMeta);
  const rpcUrlsMeta = useAppSelector(selectRpcUrlsMeta);
  const chains = useAppSelector(selectChainsDataResponse);
  const rpcUrls = useAppSelector(selectRpcUrlDataResponse);
  const cexChains = useAppSelector(selectCexChainsDataResponse);
  const cexPairs = useAppSelector(selectCexPairsDataResponse);
  const [cexWorkStatus, setCexWorkStatus] = useState<Record<number, boolean | null>>({});
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editingJobRaw, setEditingJobRaw] = useState<any>(null);
  const [copiedDexJobInitialData, setCopiedDexJobInitialData] = useState<DexJobFormValues | undefined>(undefined);
  const [pendingDeleteDexJobIds, setPendingDeleteDexJobIds] = useState<Set<number>>(new Set());
  const [pendingDeleteCexJobIds, setPendingDeleteCexJobIds] = useState<Set<number>>(new Set());
  const [selectedCexJobIds, setSelectedCexJobIds] = useState<Set<number>>(new Set());
  const [selectedDexJobIds, setSelectedDexJobIds] = useState<Set<number>>(new Set());
  const [bulkBotsFormOpen, setBulkBotsFormOpen] = useState(false);
  const [isCreatingBots, setIsCreatingBots] = useState(false);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const buildDexJobInitialData = (job: any): DexJobFormValues => ({
    chainId: String(job.chainId ?? ''),
    rpcUrlId: String(job.rpcUrlId ?? ''),
    jobType: String(job.jobType ?? job.job_type ?? ''),
    description: String(job.description ?? ''),
    additionalData: String(job.extraSettings ?? job.additionalData ?? job.additional_data ?? ''),
  });

  useEffect(() => {
    if (type === 'cex') {
      if ((!cexJobsMeta.isLoaded || cexJobsMeta.error) && !cexJobsMeta.isLoading) {
        dispatch(dbConfigActions.initCexJobsListPage());
      }
      return;
    }

    if ((!jobsMeta.isLoaded || jobsMeta.error) && !jobsMeta.isLoading) {
      dispatch(dbConfigActions.initJobsListPage());
    }
  }, [cexJobsMeta.error, cexJobsMeta.isLoaded, cexJobsMeta.isLoading, dispatch, jobsMeta.error, jobsMeta.isLoaded, jobsMeta.isLoading, type]);

  useEffect(() => {
    if (type !== 'cex') return;
    if ((!cexPairsMeta.isLoaded || cexPairsMeta.error) && !cexPairsMeta.isLoading) {
      dispatch(dbConfigActions.initCexPairsPage());
    }
  }, [cexPairsMeta.error, cexPairsMeta.isLoaded, cexPairsMeta.isLoading, dispatch, type]);

  const chainById = useMemo(() => {
    return new Map(chains.map((chain: any) => [chain.chainId ?? chain.id, chain.name]));
  }, [chains]);

  const rpcById = useMemo(() => {
    return new Map(rpcUrls.map((rpc: any) => [rpc.rpcUrlId ?? rpc.id, rpc.rpcUrl ?? rpc.url]));
  }, [rpcUrls]);

  const cexPairById = useMemo(() => {
    return new Map(cexPairs.map((pair: any) => [pair.id ?? pair.pairId ?? pair.cexPairId, pair]));
  }, [cexPairs]);

  const cexChainNameById = useMemo(() => buildCexChainNameById(cexChains), [cexChains]);

  const dexJobs = useMemo(() => {
    return dexJobsFromStore.map((job: any) => {
      const jobId = job.jobId ?? job.id;
      return {
        id: jobId,
        jobType: job.jobType ?? job.job_type ?? '',
        description: job.description ?? '',
        chain: job.chainName ?? chainById.get(job.chainId) ?? job.chainId ?? '',
        rpcUrl: job.rpcUrl ?? rpcById.get(job.rpcUrlId) ?? job.rpcUrlId ?? '',
        poolsCount: job.poolsCount ?? job.pools_count ?? 0,
        additionalData: formatExtra(job.extraSettings ?? job.additionalData ?? job.additional_data),
        raw: job,
      };
    });
  }, [chainById, dexJobsFromStore, rpcById]);

  const dexJobsVisible = useMemo(
    () => dexJobs.filter((row) => !pendingDeleteDexJobIds.has(row.id)),
    [dexJobs, pendingDeleteDexJobIds],
  );

  const cexJobs = useMemo(() => {
    return cexJobsFromStore.map((job: any) => {
      const jobId = job.id ?? job.cexJobId ?? job.cex_job_id;
      const pairId = job.cex_pair_id ?? job.cexPairId ?? job.pairId;
      const pair = cexPairById.get(pairId);
      const isWork = cexWorkStatus[jobId] ?? job.checked ?? job.isWork ?? job.is_work ?? null;

      return {
        id: jobId,
        jobType: job.job_type ?? job.jobType ?? '',
        description: job.description ?? '',
        source: resolveCexSourceFromJobAndPair(job, pair, cexChainNameById),
        token0: job.token0 ?? pair?.token0 ?? pair?.token0Symbol ?? '',
        token1: job.token1 ?? pair?.token1 ?? pair?.token1Symbol ?? '',
        isWork,
        raw: job,
      };
    });
  }, [cexChainNameById, cexJobsFromStore, cexPairById, cexWorkStatus]);

  const cexJobsVisible = useMemo(
    () => cexJobs.filter((row) => !pendingDeleteCexJobIds.has(row.id)),
    [cexJobs, pendingDeleteCexJobIds],
  );

  const selectedCexJobsForBots = useMemo(
    () => cexJobsVisible.filter((job) => selectedCexJobIds.has(job.id)),
    [cexJobsVisible, selectedCexJobIds],
  );

  const selectedDexJobsForBots = useMemo(
    () => dexJobsVisible.filter((job) => selectedDexJobIds.has(job.id)),
    [dexJobsVisible, selectedDexJobIds],
  );

  const selectedJobIds = type === 'cex' ? selectedCexJobIds : selectedDexJobIds;
  const selectedJobsForBots = type === 'cex' ? selectedCexJobsForBots : selectedDexJobsForBots;

  const allCexJobIds = useMemo(() => cexJobsVisible.map((job) => job.id), [cexJobsVisible]);
  const allDexJobIds = useMemo(() => dexJobsVisible.map((job) => job.id), [dexJobsVisible]);
  const allCexJobsSelected =
    type === 'cex' && allCexJobIds.length > 0 && allCexJobIds.every((id) => selectedCexJobIds.has(id));
  const someCexJobsSelected =
    type === 'cex' && allCexJobIds.some((id) => selectedCexJobIds.has(id));
  const allDexJobsSelected =
    type === 'dex' && allDexJobIds.length > 0 && allDexJobIds.every((id) => selectedDexJobIds.has(id));
  const someDexJobsSelected =
    type === 'dex' && allDexJobIds.some((id) => selectedDexJobIds.has(id));

  useEffect(() => {
    const el = headerCheckboxRef.current;
    if (!el) return;
    if (type === 'cex') {
      el.indeterminate = someCexJobsSelected && !allCexJobsSelected;
      return;
    }
    el.indeterminate = someDexJobsSelected && !allDexJobsSelected;
  }, [
    allCexJobsSelected,
    allDexJobsSelected,
    someCexJobsSelected,
    someDexJobsSelected,
    type,
  ]);

  const toggleCexJob = useCallback((id: number) => {
    setSelectedCexJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllCexJobs = useCallback(() => {
    setSelectedCexJobIds(allCexJobsSelected ? new Set() : new Set(allCexJobIds));
  }, [allCexJobIds, allCexJobsSelected]);

  const toggleDexJob = useCallback((id: number) => {
    setSelectedDexJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAllDexJobs = useCallback(() => {
    setSelectedDexJobIds(allDexJobsSelected ? new Set() : new Set(allDexJobIds));
  }, [allDexJobIds, allDexJobsSelected]);

  const t = {
    en: {
      jobId: 'Job ID',
      jobType: 'Job Type',
      description: 'Description',
      chain: 'Chain',
      rpcUrl: 'Rpc Url',
      poolsCount: 'Pools count',
      additionalData: 'Additional data',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      isWork: 'is work?',
      addJob: type === 'cex' ? 'Add CEX job' : 'Add DEX job',
      tableTitleCex: 'CEX jobs',
      tableTitleDex: 'DEX jobs',
      checkAction: 'Check',
      deleteType: 'Job',
      actions: 'Actions',
      deleteSelected: 'Delete selected',
      createBotsFromSelected: 'Create bots',
    },
    ru: {
      jobId: 'ID задачи',
      jobType: 'Тип задачи',
      description: 'Описание',
      chain: 'Сеть',
      rpcUrl: 'RPC URL',
      poolsCount: 'Кол-во пулов',
      additionalData: 'Доп. данные',
      source: 'Источник',
      token0: 'Токен 0',
      token1: 'Токен 1',
      isWork: 'Работает?',
      addJob: type === 'cex' ? 'Добавить CEX джобу' : 'Добавить DEX джобу',
      tableTitleCex: 'CEX джобы',
      tableTitleDex: 'DEX джобы',
      checkAction: 'Проверить',
      deleteType: 'Джоба',
      actions: 'Действия',
      deleteSelected: 'Удалить выбранные',
      createBotsFromSelected: 'Создать ботов',
    },
  };

  const handleCreateBotsFromSelectedJobs = useCallback(
    async (data: {
      botName: string;
      serverId: string;
      paused: boolean;
      isRepeat: boolean;
      delayBetweenRepeat: string;
      maxJobs: string;
      maxErrors: string;
      timeoutMs: string;
    }) => {
      if (selectedJobsForBots.length === 0) return;

      setIsCreatingBots(true);
      try {
        for (const job of selectedJobsForBots) {
          await apiService.createBot({
            botName: data.botName.trim(),
            description: String(job.description ?? '').trim(),
            jobId: type === 'dex' ? job.id : null,
            cexJobId: type === 'cex' ? job.id : null,
            serverId: Number(data.serverId),
            paused: data.paused,
            isRepeat: data.isRepeat,
            delayBetweenRepeat: Number(data.delayBetweenRepeat),
            maxJobs: Number(data.maxJobs),
            maxErrors: Number(data.maxErrors),
            timeoutMs: Number(data.timeoutMs),
          });
        }
        dispatch(dbConfigActions.refetchBotsListPageResources());
        setBulkBotsFormOpen(false);
        if (type === 'cex') {
          setSelectedCexJobIds(new Set());
        } else {
          setSelectedDexJobIds(new Set());
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message);
      } finally {
        setIsCreatingBots(false);
      }
    },
    [dispatch, selectedJobsForBots, type],
  );

  const dexDataColumns: Column[] = [
    { key: 'id', label: t[language].jobId, sortable: true, filterable: true },
    { key: 'jobType', label: t[language].jobType, sortable: true, filterable: true },
    { key: 'description', label: t[language].description, sortable: true, filterable: true },
    { key: 'chain', label: t[language].chain, sortable: true, filterable: true },
    {
      key: 'rpcUrl',
      label: t[language].rpcUrl,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
    { key: 'poolsCount', label: t[language].poolsCount, sortable: true, filterable: true },
    {
      key: 'additionalData',
      label: t[language].additionalData,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
  ];

  const checkboxColumn: Column = {
    key: 'checkbox',
    label: '',
    headerRender: () => (
      <input
        ref={headerCheckboxRef}
        type="checkbox"
        checked={type === 'cex' ? allCexJobsSelected : allDexJobsSelected}
        onChange={type === 'cex' ? toggleAllCexJobs : toggleAllDexJobs}
        className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
        onClick={(event) => event.stopPropagation()}
        title={
          (type === 'cex' ? allCexJobsSelected : allDexJobsSelected)
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
        checked={selectedJobIds.has(row.id)}
        onChange={() => (type === 'cex' ? toggleCexJob(row.id) : toggleDexJob(row.id))}
        className="w-4 h-4 rounded border-input bg-input accent-primary cursor-pointer"
        onClick={(event) => event.stopPropagation()}
      />
    ),
  };

  const cexDataColumns: Column[] = [
    { key: 'id', label: t[language].jobId, sortable: true, filterable: true },
    { key: 'jobType', label: t[language].jobType, sortable: true, filterable: true },
    { key: 'description', label: t[language].description, sortable: true, filterable: true },
    { key: 'source', label: t[language].source, sortable: true, filterable: true },
    { key: 'token0', label: t[language].token0, sortable: true, filterable: true },
    { key: 'token1', label: t[language].token1, sortable: true, filterable: true },
    {
      key: 'isWork',
      label: t[language].isWork,
      sortable: true,
      filterable: true,
      render: (value) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            value === true
              ? 'bg-success/20 text-success'
              : value === false
              ? 'bg-destructive/20 text-destructive'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {value === true ? 'true' : value === false ? 'false' : '-'}
        </span>
      ),
    },
  ];

  const dexColumns: Column[] = [checkboxColumn, ...dexDataColumns];
  const cexColumns: Column[] = [checkboxColumn, ...cexDataColumns];

  const handleCheckCexJob = async (row: any) => {
    const jobId = row.id;
    let isWork = false;
    const payload = {
      source: normalizeCexSource(
        row?.raw?.sourceName ??
          row?.raw?.exchangeName ??
          row?.raw?.exchange ??
          row?.raw?.pair?.sourceName ??
          row?.raw?.pair?.exchangeName ??
          row?.raw?.pair?.exchange ??
          row?.raw?.source ??
          row?.raw?.pair?.source ??
          row?.source,
      ),
      token0: String(row?.raw?.token0 ?? row?.raw?.pair?.token0 ?? row?.token0 ?? '').trim(),
      token1: String(row?.raw?.token1 ?? row?.raw?.pair?.token1 ?? row?.token1 ?? '').trim(),
    };

    try {
      const response = await apiService.checkCexJob(payload);
      isWork = Boolean(response?.isWork ?? response?.is_work ?? response?.checked ?? response?.success ?? response);
      await apiService.updateCexJobStatus(jobId, isWork);
    } catch (error) {
      isWork = false;
      try {
        await apiService.updateCexJobStatus(jobId, false);
      } catch {
        // Local state still reflects the failed check.
      }
    }

    setCexWorkStatus((current) => ({ ...current, [jobId]: isWork }));
    dispatch(dbConfigActions.refetchCexJobsData());
  };

  const getCexJobLabel = (row: { id: number; jobType?: string }) =>
    row.jobType ? `${row.jobType} (#${row.id})` : String(row.id);

  const handleDeleteCexJob = useCallback(
    (row: { id: number; jobType?: string }) => {
      setPendingDeleteCexJobIds((prev) => new Set(prev).add(row.id));
      setSelectedCexJobIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${CEX_JOBS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteCexJobs([row.id]);
        dispatch(dbConfigActions.removeCexJobsByIds(result.deletedIds ?? [row.id]));
        setPendingDeleteCexJobIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: getCexJobLabel(row),
        itemType: language === 'en' ? 'Job' : 'Джоба',
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          setPendingDeleteCexJobIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language],
  );

  const handleDeleteSelectedCexJobs = useCallback(() => {
    if (type !== 'cex' || selectedCexJobIds.size === 0) return;

    const toDelete = cexJobsVisible.filter((job) => selectedCexJobIds.has(job.id));
    const deleteIds = toDelete.map((row) => row.id);

    setPendingDeleteCexJobIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedCexJobIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(CEX_JOBS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteCexJobs(deleteIds);
      if (!result?.success) {
        throw new Error(language === 'ru' ? 'Не удалось удалить джобы' : 'Failed to delete jobs');
      }
      dispatch(dbConfigActions.removeCexJobsByIds(result.deletedIds ?? deleteIds));
      setPendingDeleteCexJobIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: toDelete.length,
      itemType: language === 'en' ? 'jobs' : 'джоб',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        setPendingDeleteCexJobIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [cexJobsVisible, dispatch, language, selectedCexJobIds, type]);

  const getDexJobLabel = (row: { id: number; jobType?: string }) =>
    row.jobType ? `${row.jobType} (#${row.id})` : String(row.id);

  const handleDeleteDexJob = useCallback(
    (row: { id: number; jobType?: string }) => {
      setPendingDeleteDexJobIds((prev) => new Set(prev).add(row.id));
      setSelectedDexJobIds((prev) => {
        const next = new Set(prev);
        next.delete(row.id);
        return next;
      });

      const deleteKey = `${DEX_JOBS_DELETE_SCOPE}:${row.id}`;

      schedulePendingDelete(deleteKey, async () => {
        const result = await apiService.bulkDeleteJobs([row.id]);
        dispatch(dbConfigActions.removeJobsByIds(result.deletedIds ?? [row.id]));
        setPendingDeleteDexJobIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      });

      showDeleteToast({
        itemName: getDexJobLabel(row),
        itemType: t[language].deleteType,
        onUndo: () => {
          cancelPendingDelete(deleteKey);
          setPendingDeleteDexJobIds((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        },
        language,
      });
    },
    [dispatch, language, t],
  );

  const handleDeleteSelectedDexJobs = useCallback(() => {
    if (type !== 'dex' || selectedDexJobIds.size === 0) return;

    const toDelete = dexJobsVisible.filter((job) => selectedDexJobIds.has(job.id));
    const deleteIds = toDelete.map((row) => row.id);

    setPendingDeleteDexJobIds((prev) => {
      const next = new Set(prev);
      deleteIds.forEach((id) => next.add(id));
      return next;
    });
    setSelectedDexJobIds(new Set());

    const bulkDeleteKey = buildBulkDeleteKey(DEX_JOBS_DELETE_SCOPE, deleteIds);

    schedulePendingDelete(bulkDeleteKey, async () => {
      const result = await apiService.bulkDeleteJobs(deleteIds);
      if (!result?.success) {
        throw new Error(language === 'ru' ? 'Не удалось удалить джобы' : 'Failed to delete jobs');
      }
      dispatch(dbConfigActions.removeJobsByIds(result.deletedIds ?? deleteIds));
      setPendingDeleteDexJobIds((prev) => {
        const next = new Set(prev);
        deleteIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    showBulkDeleteToast({
      count: toDelete.length,
      itemType: language === 'en' ? 'jobs' : 'джоб',
      onUndo: () => {
        cancelPendingDelete(bulkDeleteKey);
        setPendingDeleteDexJobIds((prev) => {
          const next = new Set(prev);
          deleteIds.forEach((id) => next.delete(id));
          return next;
        });
      },
      language,
    });
  }, [dexJobsVisible, dispatch, language, selectedDexJobIds, type]);

  return (
    <div className="flex-1 flex flex-col bg-background">
      <DataTable
        title={type === 'cex' ? t[language].tableTitleCex : t[language].tableTitleDex}
        headerActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setEditingJobRaw(null);
                setCopiedDexJobInitialData(undefined);
                setJobFormOpen(true);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{t[language].addJob}</span>
            </button>
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
                  disabled={selectedJobIds.size === 0}
                  onClick={() => setBulkBotsFormOpen(true)}
                >
                  {t[language].createBotsFromSelected}
                  {selectedJobIds.size > 0 ? ` (${selectedJobIds.size})` : ''}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={selectedJobIds.size === 0}
                  variant="destructive"
                  onClick={type === 'cex' ? handleDeleteSelectedCexJobs : handleDeleteSelectedDexJobs}
                >
                  {t[language].deleteSelected}
                  {selectedJobIds.size > 0 ? ` (${selectedJobIds.size})` : ''}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
        columns={type === 'cex' ? cexColumns : dexColumns}
        data={type === 'cex' ? cexJobsVisible : dexJobsVisible}
        language={language}
        isLoading={
          type === 'cex'
            ? cexJobsMeta.isLoading || cexPairsMeta.isLoading || cexChainsMeta.isLoading
            : jobsMeta.isLoading || chainsMeta.isLoading || rpcUrlsMeta.isLoading
        }
        loadingText={type === 'cex' ? (language === 'ru' ? 'Загрузка CEX джоб…' : 'Loading CEX Jobs…') : language === 'ru' ? 'Загрузка DEX джоб…' : 'Loading DEX Jobs…'}
        actionsColumnPosition="last"
        getRowId={(params) => String(params.data?.id ?? '')}
        onEdit={(row) => {
          setEditingJobRaw(row.raw);
          setCopiedDexJobInitialData(undefined);
          setJobFormOpen(true);
        }}
        onDelete={type === 'cex' ? handleDeleteCexJob : handleDeleteDexJob}
        onRowDoubleClick={(row) => {
          if (type === 'dex') {
            onDexJobClick?.(row.id, row.description || `Job #${row.id}`);
          }
        }}
        extraActions={
          type === 'cex'
            ? (row) => (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCheckCexJob(row);
                  }}
                  className="p-1.5 hover:bg-success/10 rounded transition-colors"
                  title={t[language].checkAction}
                >
                  <ArrowRight className="w-3.5 h-3.5 text-success" />
                </button>
              )
            : (row) => (
                <>
                  {onDexJobClick ? (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onDexJobClick(row.id, row.description || `Job #${row.id}`);
                      }}
                      className="p-1.5 hover:bg-success/10 rounded transition-colors"
                      title={language === 'ru' ? 'Связи' : 'Relations'}
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-success" />
                    </button>
                  ) : null}
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditingJobRaw(null);
                      setCopiedDexJobInitialData(buildDexJobInitialData(row.raw));
                      setJobFormOpen(true);
                    }}
                    className="p-1.5 hover:bg-accent rounded transition-colors"
                    title={language === 'ru' ? 'Копировать' : 'Copy'}
                  >
                    <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                  </button>
                </>
              )
        }
      />

      <BulkCexBotsFromJobsForm
        open={bulkBotsFormOpen}
        onClose={() => {
          if (isCreatingBots) return;
          setBulkBotsFormOpen(false);
        }}
        onSave={handleCreateBotsFromSelectedJobs}
        jobs={selectedJobsForBots.map((job) => ({
          id: job.id,
          jobType: job.jobType,
          description: job.description,
        }))}
        language={language}
        isSaving={isCreatingBots}
      />

      {type === 'cex' && (
        <CexJobForm
          open={jobFormOpen}
          onClose={() => {
            setJobFormOpen(false);
            setEditingJobRaw(null);
            setCopiedDexJobInitialData(undefined);
          }}
          onSave={async (data) => {
            const payload: Record<string, unknown> = {
              cex_pair_id: Number(data.cexPairId),
              job_type: data.jobType,
              description: data.description.trim(),
            };
            if (editingJobRaw) {
              payload.checked = editingJobRaw.checked ?? null;
            }

            const saved = editingJobRaw
              ? await apiService.editCexJob(
                  Number(editingJobRaw.id ?? editingJobRaw.cexJobId ?? editingJobRaw.cex_job_id),
                  payload,
                )
              : await apiService.createCexJob(payload);
            dispatch(dbConfigActions.upsertCexJob({ job: saved }));
          }}
          initialData={
            editingJobRaw
              ? {
                  cexPairId: String(
                    editingJobRaw.cex_pair_id ?? editingJobRaw.cexPairId ?? editingJobRaw.pairId ?? '',
                  ),
                  jobType: editingJobRaw.job_type ?? editingJobRaw.jobType ?? '',
                  description: editingJobRaw.description ?? '',
                }
              : undefined
          }
          language={language}
        />
      )}
      {type === 'dex' && (
        <DexJobForm
          open={jobFormOpen}
          onClose={() => {
            setJobFormOpen(false);
            setEditingJobRaw(null);
            setCopiedDexJobInitialData(undefined);
          }}
          onSave={async (data) => {
            const payload = {
              chainId: Number(data.chainId),
              rpcUrlId: Number(data.rpcUrlId),
              jobType: data.jobType.trim(),
              description: data.description.trim(),
              extraSettings: data.additionalData.trim(),
            };

            const saved = editingJobRaw
              ? await apiService.editJob(Number(editingJobRaw.jobId ?? editingJobRaw.id), payload)
              : await apiService.createJob(payload);
            dispatch(dbConfigActions.upsertJob({ job: normalizeDexJobForStore(saved) }));
          }}
          initialData={
            copiedDexJobInitialData ?? (editingJobRaw ? buildDexJobInitialData(editingJobRaw) : undefined)
          }
          language={language}
        />
      )}
    </div>
  );
}
