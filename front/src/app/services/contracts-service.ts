import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ContractsService {
  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getPoolFee(address: string): Observable<number> {
    return this.http.get<{ fee: number }>(`${this.apiUrl}/pool/fee/${address}`)
      .pipe(map(res => res.fee));
  }

}


