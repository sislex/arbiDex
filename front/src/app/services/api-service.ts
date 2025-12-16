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

  getTokensData(): Observable<any> {
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

  getPoolsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pools`);
  }


  //====================================================================================================================
  //                                                   Markets
  //====================================================================================================================

  getMarketsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/markets`);
  }

  //====================================================================================================================
  //                                                   Dexes
  //====================================================================================================================

  getDexesData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dexes`);
  }

  //====================================================================================================================
  //                                                   Chains
  //====================================================================================================================

  getChainsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chains`);
  }

  //====================================================================================================================
  //                                                   Servers
  //====================================================================================================================

  getServersData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servers`);
  }
}
