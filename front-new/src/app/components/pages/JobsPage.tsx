import { Play, Plus } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DataTable, Column } from '../DataTable';
import { CexJobForm } from '../forms/CexJobForm';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dbConfigActions } from '../../store/db-config/dbConfig.slice';
import {
  selectCexChainsDataResponse,
  selectCexJobsMeta,
  selectCexPairsDataResponse,
  selectCexPairsMeta,
  selectCexJobsDataResponse,
  selectChainsDataResponse,
  selectJobsMeta,
  selectJobsDataResponse,
  selectPairsDataResponse,
  selectRpcUrlDataResponse,
} from '../../store/db-config/dbConfig.selectors';
import { apiService } from '../../services/api-service';
import { buildCexChainNameById, resolveCexSourceFromJobAndPair } from '../../utils/cexPairSource';
import { showDeleteToast } from '../../utils/toast';

interface JobsPageProps {
  language: 'en' | 'ru';
  type: 'dex' | 'cex';
}

const DELETE_UNDO_MS = 5000;

const formatExtra = (value: any) => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  return typeof value === 'object' ? JSON.stringify(value) : String(value);
};

export function JobsPage({ language, type }: JobsPageProps) {
  const dispatch = useAppDispatch();
  const dexJobsFromStore = useAppSelector(selectJobsDataResponse);
  const cexJobsFromStore = useAppSelector(selectCexJobsDataResponse);
  const jobsMeta = useAppSelector(selectJobsMeta);
  const cexJobsMeta = useAppSelector(selectCexJobsMeta);
  const cexPairsMeta = useAppSelector(selectCexPairsMeta);
  const chains = useAppSelector(selectChainsDataResponse);
  const rpcUrls = useAppSelector(selectRpcUrlDataResponse);
  const cexChains = useAppSelector(selectCexChainsDataResponse);
  const pairs = useAppSelector(selectPairsDataResponse);
  const cexPairs = useAppSelector(selectCexPairsDataResponse);
  const [cexWorkStatus, setCexWorkStatus] = useState<Record<number, boolean | null>>({});
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editingJobRaw, setEditingJobRaw] = useState<any>(null);
  const [pendingDeleteCexJobIds, setPendingDeleteCexJobIds] = useState<Set<number>>(new Set());
  const deleteCexJobTimeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

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

  useEffect(() => {
    return () => {
      deleteCexJobTimeoutsRef.current.forEach(clearTimeout);
      deleteCexJobTimeoutsRef.current.clear();
    };
  }, []);

  const chainById = useMemo(() => {
    return new Map(chains.map((chain: any) => [chain.chainId ?? chain.id, chain.name]));
  }, [chains]);

  const rpcById = useMemo(() => {
    return new Map(rpcUrls.map((rpc: any) => [rpc.rpcUrlId ?? rpc.id, rpc.rpcUrl ?? rpc.url]));
  }, [rpcUrls]);

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
        pairsCount: job.pairsCount ?? job.pairs_count ?? pairCountByJobId.get(jobId) ?? 0,
        additionalData: formatExtra(job.additionalData ?? job.additional_data),
        raw: job,
      };
    });
  }, [chainById, dexJobsFromStore, pairCountByJobId, rpcById]);

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

  const t = {
    en: {
      jobId: 'Job ID',
      jobType: 'Job Type',
      description: 'Description',
      chain: 'Chain',
      rpcUrl: 'Rpc Url',
      pairsCount: 'Pairs count',
      additionalData: 'Additional data',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      isWork: 'is work?',
      addJob: 'Add job',
    },
    ru: {
      jobId: 'Job ID',
      jobType: 'Job Type',
      description: 'Description',
      chain: 'Chain',
      rpcUrl: 'Rpc Url',
      pairsCount: 'Pairs count',
      additionalData: 'Additional data',
      source: 'Source',
      token0: 'Token 0',
      token1: 'Token 1',
      isWork: 'is work?',
      addJob: 'Добавить джобу',
    },
  };

  const dexColumns: Column[] = [
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
    { key: 'pairsCount', label: t[language].pairsCount, sortable: true, filterable: true },
    {
      key: 'additionalData',
      label: t[language].additionalData,
      sortable: true,
      filterable: true,
      render: (value) => <span className="font-mono text-xs text-muted-foreground">{value}</span>,
    },
  ];

  const cexColumns: Column[] = [
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

  const handleCheckCexJob = async (row: any) => {
    const jobId = row.id;
    let isWork = false;

    try {
      const response = await apiService.checkCexJob(row.raw);
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
  };

  const handleDeleteCexJob = (row: any) => {
    setPendingDeleteCexJobIds((prev) => new Set(prev).add(row.id));
    const existing = deleteCexJobTimeoutsRef.current.get(row.id);
    if (existing) clearTimeout(existing);

    const tid = setTimeout(async () => {
      deleteCexJobTimeoutsRef.current.delete(row.id);
      try {
        await apiService.deletingCexJob(row.id);
        dispatch(dbConfigActions.initCexJobsListPage());
      } finally {
        setPendingDeleteCexJobIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      }
    }, DELETE_UNDO_MS);
    deleteCexJobTimeoutsRef.current.set(row.id, tid);

    showDeleteToast({
      itemName: row.jobType ? `${row.jobType} (#${row.id})` : String(row.id),
      itemType: language === 'en' ? 'Job' : 'Джоба',
      onUndo: () => {
        const scheduled = deleteCexJobTimeoutsRef.current.get(row.id);
        if (scheduled) clearTimeout(scheduled);
        deleteCexJobTimeoutsRef.current.delete(row.id);
        setPendingDeleteCexJobIds((prev) => {
          const next = new Set(prev);
          next.delete(row.id);
          return next;
        });
      },
      language,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {type === 'cex' && (
        <div className="h-14 border-b border-border flex items-center justify-end px-4">
          <button
            type="button"
            onClick={() => {
              setEditingJobRaw(null);
              setJobFormOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">{t[language].addJob}</span>
          </button>
        </div>
      )}

      <DataTable
        title={type === 'cex' ? 'CEX Jobs' : 'DEX Jobs'}
        columns={type === 'cex' ? cexColumns : dexColumns}
        data={type === 'cex' ? cexJobsVisible : dexJobs}
        isLoading={type === 'cex' ? cexJobsMeta.isLoading : jobsMeta.isLoading}
        loadingText={type === 'cex' ? 'Loading CEX Jobs…' : 'Loading DEX Jobs…'}
        onEdit={
          type === 'cex'
            ? (row) => {
                setEditingJobRaw(row.raw);
                setJobFormOpen(true);
              }
            : undefined
        }
        onDelete={type === 'cex' ? handleDeleteCexJob : undefined}
        extraActions={
          type === 'cex'
            ? (row) => (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    handleCheckCexJob(row);
                  }}
                  className="p-1.5 hover:bg-success/10 rounded transition-colors"
                  title="Check"
                >
                  <Play className="w-3.5 h-3.5 text-success" />
                </button>
              )
            : undefined
        }
      />

      {type === 'cex' && (
        <CexJobForm
          open={jobFormOpen}
          onClose={() => {
            setJobFormOpen(false);
            setEditingJobRaw(null);
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

            if (editingJobRaw) {
              const id = Number(editingJobRaw.id ?? editingJobRaw.cexJobId ?? editingJobRaw.cex_job_id);
              await apiService.editCexJob(id, payload);
            } else {
              await apiService.createCexJob(payload);
            }
            dispatch(dbConfigActions.initCexJobsListPage());
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
    </div>
  );
}
