/** Resolves DEX job id linked to a bot (API may return string or nested job). */
export function resolveBotDexJobId(bot: any): number | null {
  const raw = bot?.jobId ?? bot?.job_id ?? bot?.job?.jobId;
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function botUsesDexJob(bot: any, jobId: number): boolean {
  const botJobId = resolveBotDexJobId(bot);
  const target = Number(jobId);
  return botJobId !== null && Number.isFinite(target) && botJobId === target;
}
