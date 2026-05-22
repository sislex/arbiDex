const env = (import.meta as any).env ?? {};
const hostUrl = env.VITE_HOST_URL ?? "http://localhost:3001";
const cexQuotesUrl = env.VITE_CEX_QUOTES_URL ?? "http://45.135.182.251:1001";

type RequestOptions = {
  body?: unknown;
  params?: Record<string, string | number | boolean | null | undefined>;
};

function buildUrl(path: string, params?: RequestOptions["params"]) {
  const url = new URL(path, hostUrl);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function buildServerBaseUrl(ip: string, port: string) {
  const normalizedIp = String(ip ?? "").trim();
  const normalizedPort = String(port ?? "").trim();
  return normalizedPort ? `http://${normalizedIp}:${normalizedPort}` : `http://${normalizedIp}`;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(buildUrl(path, options.params), {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let detail = `Request ${method} ${path} failed with status ${response.status}`;
    const text = await response.text();
    if (text) {
      try {
        const errBody = JSON.parse(text) as { message?: string | string[] };
        const msg = errBody?.message;
        if (typeof msg === 'string') detail = msg;
        else if (Array.isArray(msg)) detail = msg.join(', ');
      } catch {
        // non-JSON error body
      }
    }
    throw new Error(detail);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiService = {
  getTokens: () => request<any[]>("GET", "/tokens"),
  blockchain: () => request<any>("POST", "/blockchain", { body: {} }),
  createToken: (data: any) => request<any>("POST", "/tokens", { body: { ...data } }),
  editToken: (id: number, data: any) => request<any>("PUT", `/tokens/${id}`, { body: data }),
  deletingToken: (id: number) => request<any>("DELETE", `/tokens/${id}`),

  getPools: () => request<any[]>("GET", "/pools"),
  createPool: (data: any) => request<any>("POST", "/pools", { body: { ...data } }),
  editPool: (id: number, data: any) => request<any>("PUT", `/pools/by-id/${id}`, { body: data }),
  deletingPool: (id: number) => request<any>("DELETE", `/pools/${id}`),

  getDexes: () => request<any[]>("GET", "/dexes"),
  createDex: (data: any) => request<any>("POST", "/dexes", { body: { ...data } }),
  editDex: (id: number, data: any) => request<any>("PUT", `/dexes/${id}`, { body: data }),
  deletingDex: (id: number) => request<any>("DELETE", `/dexes/${id}`),

  getChainsData: () => request<any[]>("GET", "/chains"),
  createChain: (data: any) => request<any>("POST", "/chains", { body: { ...data } }),
  editChain: (id: number, data: any) => request<any>("PUT", `/chains/${id}`, { body: data }),
  deletingChain: (id: number) => request<any>("DELETE", `/chains/${id}`),

  getBots: () => request<any[]>("GET", "/bots"),
  getBotsByServerId: (serverId: number) => request<any[]>("GET", "/bots/findAllByServerId", { params: { serverId } }),
  setBotById: (id: number) => request<any>("GET", `/bots/${id}`),
  createBot: (data: any) => request<any>("POST", "/bots", { body: { ...data } }),
  editBot: (id: number, data: any) => request<any>("PUT", `/bots/${id}`, { body: data }),
  deletingBot: (id: number) => request<any>("DELETE", `/bots/${id}`),

  getPairs: () => request<any[]>("GET", "/pairs"),
  createPair: (data: any) => request<any>("POST", "/pairs", { body: { ...data } }),
  editPair: (id: number, data: any) => request<any>("PUT", `/pairs/${id}`, { body: data }),
  deletingPair: (id: number) => request<any>("DELETE", `/pairs/${id}`),

  getQuotes: () => request<any[]>("GET", "/quotes"),
  getOneQuote: (quoteId: number) => request<any>("GET", `/quotes/${quoteId}`),
  createQuote: (data: any) => request<any>("POST", "/quotes", { body: { ...data } }),
  editQuote: (id: number, data: any) => request<any>("PUT", `/quotes/${id}`, { body: data }),
  deletingQuote: (id: number) => request<any>("DELETE", `/quotes/${id}`),

  getJobs: () => request<any[]>("GET", "/jobs"),
  getJobById: (id: number) => request<any>("GET", `/jobs/${id}`),
  createJob: (data: any) => request<any>("POST", "/jobs", { body: { ...data } }),
  editJob: (id: number, data: any) => request<any>("PUT", `/jobs/${id}`, { body: data }),
  deletingJob: (id: number) => request<any>("DELETE", `/jobs/${id}`),

  getServers: () => request<any[]>("GET", "/servers"),
  setServerById: (id: number) => request<any>("GET", `/servers/${id}`),
  createServer: (data: any) => request<any>("POST", "/servers", { body: { ...data } }),
  editServer: (id: number, data: any) => request<any>("PUT", `/servers/${id}`, { body: data }),
  deletingServer: (id: number) => request<any>("DELETE", `/servers/${id}`),
  resetServerSettings: (ip: string, port: string, data: any) => {
    return fetch(`${buildServerBaseUrl(ip, port)}/setBotsRulesList`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request resetServerSettings failed with status ${response.status}`);
      }

      return response.json();
    });
  },

  getSwapRates: () => request<any[]>("GET", "/swap-rate"),

  getQuoteRelationsByQuoteId: (id: number) => request<any[]>("GET", `/pair-quote-relations/by-quote-id/${id}`),
  getQuoteRelations: (jobId: number) => request<any[]>("GET", "/pair-quote-relations/findAllWithFilter", { params: { jobId } }),
  createQuoteRelations: (data: any[]) => request<any>("POST", "/pair-quote-relations", { body: data }),
  deleteQuoteRelations: (ids: number[]) => request<any>("DELETE", "/pair-quote-relations", { body: ids }),

  getJobRelationsByJobId: (id: number) => request<any[]>("GET", `/quote-job-relations/by-job-id/${id}`),
  createJobRelations: (data: any[]) => request<any>("POST", "/quote-job-relations", { body: data }),
  deleteJobRelations: (ids: number[]) => request<any>("DELETE", "/quote-job-relations", { body: ids }),

  getRpcUrls: () => request<any[]>("GET", "/rpc-urls"),
  createRpcUrl: (data: any) => request<any>("POST", "/rpc-urls", { body: { ...data } }),
  editRpcUrl: (id: number, data: any) => request<any>("PUT", `/rpc-urls/${id}`, { body: data }),
  deletingRpcUrl: (id: number) => request<any>("DELETE", `/rpc-urls/${id}`),

  getCexJobs: () => request<any[]>("GET", "/cex-jobs"),
  checkCexJob: (data: any) => {
    return fetch(`${cexQuotesUrl}/jobs/cex-quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Request checkCexJob failed with status ${response.status}`);
      }

      return response.json();
    });
  },
  getCexJobById: (id: number) => request<any>("GET", `/cex-jobs/${id}`),
  createCexJob: (data: any) => request<any>("POST", "/cex-jobs", { body: { ...data } }),
  editCexJob: (id: number, data: any) => request<any>("PUT", `/cex-jobs/${id}`, { body: data }),
  updateCexJobStatus: (id: number, checked: boolean | null) => request<any>("PATCH", `/cex-jobs/${id}/status`, { body: { checked } }),
  deletingCexJob: (id: number) => request<any>("DELETE", `/cex-jobs/${id}`),

  getCexChainsData: () => request<any[]>("GET", "/cex-chains"),
  createCexChain: (data: any) => request<any>("POST", "/cex-chains", { body: { ...data } }),
  editCexChain: (id: number, data: any) => request<any>("PATCH", `/cex-chains/${id}`, { body: data }),
  deletingCexChain: (id: number) => request<any>("DELETE", `/cex-chains/${id}`),

  getCexPairs: () => request<any[]>("GET", "/cex-pairs"),
  createCexPair: (data: any) => request<any>("POST", "/cex-pairs", { body: { ...data } }),
  editCexPair: (id: number, data: any) => request<any>("PUT", `/cex-pairs/${id}`, { body: data }),
  deletingCexPair: (id: number) => request<any>("DELETE", `/cex-pairs/${id}`),
};
