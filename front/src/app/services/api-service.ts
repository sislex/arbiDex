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

  getTokensData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tokens`);
  }

  getPoolsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pools`);
  }

  getMarketsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/markets`);
  }

  getDexesData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dexes`);
  }

  getChainsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/chains`);
  }

  getServersData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/servers`);
  }
}
