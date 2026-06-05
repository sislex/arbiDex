export function normalizeDexJobForStore(job: any) {
  return {
    jobId: Number(job.jobId ?? job.id),
    jobType: job.jobType ?? job.job_type ?? '',
    description: job.description ?? '',
    extraSettings: job.extraSettings ?? job.extra_settings ?? '',
    chainId: job.chainId ?? job.chain?.chainId ?? null,
    rpcUrlId: job.rpcUrlId ?? job.rpcUrl?.rpcUrlId ?? null,
    poolsCount: job.poolsCount ?? job.poolsJobRelations?.length ?? 0,
  };
}
