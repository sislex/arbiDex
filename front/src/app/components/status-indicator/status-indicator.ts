import { Component, inject } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import { ICellRendererParams } from 'ag-grid-community';
import {AsyncPipe} from '@angular/common';
import {startWith} from 'rxjs/operators';


@Component({
  selector: 'app-status-indicator',
  imports: [
    AsyncPipe
  ],
  templateUrl: './status-indicator.html',
  styleUrl: './status-indicator.scss',
})
export class StatusIndicator implements ICellRendererAngularComp {
  private http = inject(HttpClient);
  status$!: Observable<string>;

  agInit(params: ICellRendererParams): void {
    const { ip, port } = params.data || {};

    if (!ip || !port) {
      this.status$ = of('offline');
      return;
    }

    const url = `http://45.135.182.251:8230/server/${ip}:${port}`;

    this.status$ = this.http.get(url, { observe: 'response' }).pipe(
      map(res => {
        return res.ok ? 'online' : 'offline';
      }),
      catchError(() => of('offline')),
      startWith('loading')
    );
  }


  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
