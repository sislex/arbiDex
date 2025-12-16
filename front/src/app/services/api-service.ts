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
  createPools(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pools`, {...data});
  }
  editPools(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pools/${id}`, data);
  }
  deletingPools(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pools/${id}`);
  }


  //====================================================================================================================
  //                                                   Markets
  //====================================================================================================================

  getMarkets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/markets`);
  }
  createMarkets(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/markets`, {...data});
  }
  editMarkets(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/markets/${id}`, data);
  }
  deletingMarkets(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/markets/${id}`);
  }

  //====================================================================================================================
  //                                                   Dexes
  //====================================================================================================================

  getDexes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dexes`);
  }
  createDexes(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/dexes`, {...data});
  }
  editDexes(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/dexes/${id}`, data);
  }
  deletingDexes(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/dexes/${id}`);
  }

  //====================================================================================================================
  //                                                   Chains
  //====================================================================================================================

  getChainsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chains`);
  }
  createChains(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/chains`, {...data});
  }
  editChains(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/chains/${id}`, data);
  }
  deletingChains(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/chains/${id}`);
  }

  //====================================================================================================================
  //                                                   Servers
  //====================================================================================================================

  getServers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servers`);
  }
  createServers(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/servers`, {...data});
  }
  editServers(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/servers/${id}`, data);
  }
  deletingServers(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/servers/${id}`);
  }
}
