import { apiService } from "../../services/api-service";

export const dbConfigApi = {
  getTokens: apiService.getTokens,
  getPools: apiService.getPools,
  getDexes: apiService.getDexes,
  getChains: apiService.getChainsData,
  getPairs: apiService.getPairs,
  getQuotes: apiService.getQuotes,
  getJobs: apiService.getJobs,
  getBots: apiService.getBots,
  getServers: apiService.getServers,
  getRpcUrls: apiService.getRpcUrls,
  getSwapRate: apiService.getSwapRates,
  getCexChains: apiService.getCexChainsData,
  getCexPairs: apiService.getCexPairs,
  getCexJobs: apiService.getCexJobs,
};
