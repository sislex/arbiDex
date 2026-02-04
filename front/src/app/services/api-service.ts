import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient)

  private apiUrl =  `${environment.hostUrl}`;

  //====================================================================================================================
  //                                                   Tokens
  //====================================================================================================================

  getTokens(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens`);
  }
  blockchain(): Observable<any> {
    return this.http.post(`${this.apiUrl}/blockchain`, {});
  }
  getOneTokenByAddress(address: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens/get-one-token-by-address`, {
      params: { tokenAddress: address }
    });
  }
  createToken(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tokens`, {...data});
  }
  editToken(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/tokens/${id}`, data);
  }
  deletingToken(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tokens/${id}`);
  }

  //====================================================================================================================
  //                                                   Pools
  //====================================================================================================================

  getPools(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pools`);
  }
  createPool(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pools`, {...data});
  }
  editPool(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pools/by-id/${id}`, data);
  }
  deletingPool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pools/${id}`);
  }

  //====================================================================================================================
  //                                                   Dexes
  //====================================================================================================================

  getDexes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dexes`);
  }
  createDex(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dexes`, {...data});
  }
  editDex(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/dexes/${id}`, data);
  }
  deletingDex(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dexes/${id}`);
  }

  //====================================================================================================================
  //                                                   Chains
  //====================================================================================================================

  getChainsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chains`);
  }
  createChain(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/chains`, {...data});
  }
  editChain(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/chains/${id}`, data);
  }
  deletingChain(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/chains/${id}`);
  }

  //====================================================================================================================
  //                                                   Bots
  //====================================================================================================================

  getBots(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bots`);
  }
  getBotsByServerId(serverId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bots/findAllByServerId`, {
      params: { serverId: serverId.toString() }
    });
  }
  setBotById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/bots/${id}`);
  }
  createBot(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/bots`, {...data});
  }
  editBot(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/bots/${id}`, data);
  }
  deletingBot(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bots/${id}`);
  }

  //====================================================================================================================
  //                                                   Pairs
  //====================================================================================================================

  getPairs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pairs`);
  }
  createPair(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pairs`, {...data});
  }
  editPair(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pairs/${id}`, data);
  }
  deletingPair(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pairs/${id}`);
  }

  //====================================================================================================================
  //                                                   Quotes
  //====================================================================================================================

  getQuotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/quotes`);
  }
  getOneQuote(quoteId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quotes/${quoteId}`);
  }
  createQuote(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/quotes`, {...data});
  }
  editQuote(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/quotes/${id}`, data);
  }
  deletingQuote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quotes/${id}`);
  }

  //====================================================================================================================
  //                                                   Jobs
  //====================================================================================================================

  getJobs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs`);
  }
  getJobById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/jobs/${id}`);
  }
  createJob(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/jobs`, {...data});
  }
  editJob(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/jobs/${id}`, data);
  }
  deletingJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/jobs/${id}`);
  }

  //====================================================================================================================
  //                                                   Servers
  //====================================================================================================================

  getServers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servers`);
  }
  setServerById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/servers/${id}`);
  }
  createServer(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/servers`, {...data});
  }
  editServer(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/servers/${id}`, data);
  }
  deletingServer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/servers/${id}`);
  }
  resetServerSettings(ip: string, port: string, data: any): Observable<any> {
    return this.http.post(`http://${ip}:${port}/setBotsRulesList`, data);
  }

  //====================================================================================================================
  //                                                   Quote Relations
  //====================================================================================================================

  getQuoteRelationsByQuoteId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pair-quote-relations/by-quote-id/${id}`);
  }
  getQuoteRelations(jobId: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/pair-quote-relations/findAllWithFilter`, {
      params: { jobId: jobId.toString() }
    });
  }
  createQuoteRelations(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/pair-quote-relations`, data);
  }
  deleteQuoteRelations(ids: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pair-quote-relations`, { body: ids });
  }

  //====================================================================================================================
  //                                                   Job Relations
  //====================================================================================================================

  getJobRelationsByJobId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quote-job-relations/by-job-id/${id}`);
  }
  createJobRelations(data: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/quote-job-relations`, data);
  }
  deleteJobRelations(ids: number[]): Observable<any> {
    return this.http.delete(`${this.apiUrl}/quote-job-relations`, { body: ids });
  }

  //====================================================================================================================
  //                                                   Rpc Urls Relations
  //====================================================================================================================

  getRpcUrls(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rpc-urls`);
  }
  createRpcUrl(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rpc-urls`, {...data});
  }
  editRpcUrl(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/rpc-urls/${id}`, data);
  }
  deletingRpcUrl(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/rpc-urls/${id}`);
  }
}
