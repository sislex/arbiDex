export function buildBotEditPayloadFields(bot: any, overrides: { serverId?: number } = {}) {
  const hasCexJob = Boolean(bot.cexJobId ?? bot.cex_job_id);
  const dexJobId = bot.jobId ?? bot.job_id ?? null;

  return {
    botName: String(bot.botName ?? bot.name ?? '').trim(),
    description: String(bot.description ?? '').trim(),
    jobId: hasCexJob ? null : dexJobId != null ? Number(dexJobId) : null,
    cexJobId: hasCexJob ? Number(bot.cexJobId ?? bot.cex_job_id) : null,
    serverId: overrides.serverId ?? Number(bot.serverId ?? bot.server_id),
    paused: Boolean(bot.paused),
    isRepeat: Boolean(bot.isRepeat),
    delayBetweenRepeat: Number(bot.delayBetweenRepeat ?? 5000),
    maxJobs: Number(bot.maxJobs ?? 99999999),
    maxErrors: Number(bot.maxErrors ?? 10),
    timeoutMs: Number(bot.timeoutMs ?? 99999999),
  };
}

export function buildBotEditPayload(bot: any, overrides: { serverId?: number } = {}) {
  const payload = buildBotEditPayloadFields(bot, overrides);
  const botId = Number(bot.botId ?? bot.id);
  return Number.isFinite(botId) ? { botId, ...payload } : payload;
}

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
