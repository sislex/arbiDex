export const SIDEBAR_PAGES = [
  'cex-chains',
  'cex-pairs',
  'cex-jobs',
  'dex-chains',
  'dex-jobs',
  'tokens',
  'pools',
  'dexes',
  'dex-rpc-urls',
  'bots',
  'servers',
] as const;

export type SidebarPage = (typeof SIDEBAR_PAGES)[number];

export type ParsedRoute =
  | { kind: 'sidebar'; page: SidebarPage; highlightJob?: number }
  | { kind: 'help' }
  | { kind: 'bot'; botId: number }
  | { kind: 'server'; serverId: number; highlightBot?: number; fromBot?: number; fromJob?: number }
  | { kind: 'job'; jobId: number; highlightBot?: number }
  | { kind: 'job-pools'; jobId: number }
  | { kind: 'job-bot'; jobId: number; botId: number };

export type NavigationState = {
  botName?: string;
  serverName?: string;
  jobName?: string;
};

function readPositiveInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const id = Number(value);
  return Number.isFinite(id) && id > 0 ? id : undefined;
}

function buildQuery(params: Record<string, number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value != null) search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}

export function sidebarPath(page: SidebarPage, options?: { highlightJob?: number }): string {
  if (page === 'dex-jobs' && options?.highlightJob != null) {
    return `/dex-jobs${buildQuery({ highlightJob: options.highlightJob })}`;
  }
  return `/${page}`;
}

export function botPath(botId: number): string {
  return `/bot/${botId}`;
}

export function serverPath(
  serverId: number,
  options?: { highlightBot?: number; fromBot?: number; fromJob?: number },
): string {
  return `/server/${serverId}${buildQuery({
    highlightBot: options?.highlightBot,
    fromBot: options?.fromBot,
    fromJob: options?.fromJob,
  })}`;
}

export function jobPath(jobId: number, options?: { highlightBot?: number }): string {
  return `/job/${jobId}${buildQuery({ highlightBot: options?.highlightBot })}`;
}

export function jobPoolsPath(jobId: number): string {
  return `/job/${jobId}/pools`;
}

export function jobBotPath(jobId: number, botId: number): string {
  return `/job/${jobId}/bot/${botId}`;
}

export function helpPath(): string {
  return '/help';
}

export function parseAppRoute(pathname: string, search: string): ParsedRoute {
  const params = new URLSearchParams(search);

  if ((pathname.replace(/\/+$/, '') || '/') === '/help') {
    return { kind: 'help' };
  }

  const jobBotMatch = pathname.match(/^\/job\/(\d+)\/bot\/(\d+)\/?$/);
  if (jobBotMatch) {
    return {
      kind: 'job-bot',
      jobId: Number(jobBotMatch[1]),
      botId: Number(jobBotMatch[2]),
    };
  }

  const jobPoolsMatch = pathname.match(/^\/job\/(\d+)\/pools\/?$/);
  if (jobPoolsMatch) {
    return { kind: 'job-pools', jobId: Number(jobPoolsMatch[1]) };
  }

  const jobMatch = pathname.match(/^\/job\/(\d+)\/?$/);
  if (jobMatch) {
    return {
      kind: 'job',
      jobId: Number(jobMatch[1]),
      highlightBot: readPositiveInt(params.get('highlightBot')),
    };
  }

  const botMatch = pathname.match(/^\/bot\/(\d+)\/?$/);
  if (botMatch) {
    return { kind: 'bot', botId: Number(botMatch[1]) };
  }

  const serverMatch = pathname.match(/^\/server\/(\d+)\/?$/);
  if (serverMatch) {
    return {
      kind: 'server',
      serverId: Number(serverMatch[1]),
      highlightBot: readPositiveInt(params.get('highlightBot')),
      fromBot: readPositiveInt(params.get('fromBot')),
      fromJob: readPositiveInt(params.get('fromJob')),
    };
  }

  const normalized = pathname.replace(/\/+$/, '') || '/';
  const pagePath = normalized === '/' ? '/dex-chains' : normalized;
  const page = pagePath.slice(1) as SidebarPage;

  if ((SIDEBAR_PAGES as readonly string[]).includes(page)) {
    return {
      kind: 'sidebar',
      page,
      highlightJob: page === 'dex-jobs' ? readPositiveInt(params.get('highlightJob')) : undefined,
    };
  }

  return { kind: 'sidebar', page: 'dex-chains' };
}

export function sidebarIdFromRoute(route: ParsedRoute): string {
  switch (route.kind) {
    case 'help':
      return 'help';
    case 'bot':
      return 'bots';
    case 'server':
      return 'servers';
    case 'job':
    case 'job-pools':
    case 'job-bot':
      return 'dex-jobs';
    default:
      return route.page;
  }
}
