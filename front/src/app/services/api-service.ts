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
  createPool(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pools`, {...data});
  }
  editPool(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pools/${id}`, data);
  }
  deletingPool(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pools/${id}`);
  }


  //====================================================================================================================
  //                                                   Markets
  //====================================================================================================================

  getMarkets(): Observable<any> {
    return this.http.get(`${this.apiUrl}/markets`);
  }
  createMarket(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/markets`, {...data});
  }
  editMarket(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/markets/${id}`, data);
  }
  deletingMarket(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/markets/${id}`);
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
  //                                                   Servers
  //====================================================================================================================

  getServers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servers`);
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
}
