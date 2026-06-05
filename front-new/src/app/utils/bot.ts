export function normalizeBotForStore(bot: any) {
  return {
    botId: Number(bot.botId ?? bot.id),
    botName: bot.botName ?? bot.name ?? '',
    description: bot.description ?? '',
    delayBetweenRepeat: bot.delayBetweenRepeat ?? null,
    isRepeat: bot.isRepeat ?? null,
    maxErrors: bot.maxErrors ?? null,
    maxJobs: bot.maxJobs ?? null,
    paused: bot.paused ?? null,
    timeoutMs: bot.timeoutMs ?? null,
    poolsCount:
      bot.poolsCount ??
      bot.pools_count ??
      bot.job?.poolsJobRelations?.length ??
      0,
    serverId: bot.serverId ?? bot.server_id ?? bot.server?.serverId ?? null,
    jobId: bot.jobId ?? bot.job_id ?? bot.job?.jobId ?? null,
    cexJobId: bot.cexJobId ?? bot.cex_job_id ?? bot.cexJob?.id ?? null,
  };
}
