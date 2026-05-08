import {
  mockBots,
  mockCexChains,
  mockCexJobs,
  mockCexPairs,
  mockChains,
  mockDexes,
  mockJobs,
  mockPairs,
  mockPools,
  mockQuotes,
  mockRpcUrls,
  mockServers,
  mockSwapRate,
  mockTokens,
} from "./mockData";

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? "/api";

async function requestList<T>(path: string, fallback: T[]): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/${path}`);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data as T[];
    }

    if (Array.isArray(data?.response)) {
      return data.response as T[];
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export const dbConfigApi = {
  getTokens: () => requestList("tokens", mockTokens),
  getPools: () => requestList("pools", mockPools),
  getDexes: () => requestList("dexes", mockDexes),
  getChains: () => requestList("chains", mockChains),
  getPairs: () => requestList("pairs", mockPairs),
  getQuotes: () => requestList("quotes", mockQuotes),
  getJobs: () => requestList("jobs", mockJobs),
  getBots: () => requestList("bots", mockBots),
  getServers: () => requestList("servers", mockServers),
  getRpcUrls: () => requestList("rpc-urls", mockRpcUrls),
  getSwapRate: () => requestList("swap-rate", mockSwapRate),
  getCexChains: () => requestList("cex-chains", mockCexChains),
  getCexPairs: () => requestList("cex-pairs", mockCexPairs),
  getCexJobs: () => requestList("cex-jobs", mockCexJobs),
};
