import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BotFormContainer } from '../containers/forms/bot-form-container/bot-form-container';
import { Observable } from 'rxjs';
import { ISelectMenu } from '../models/db-config';

@Injectable({
  providedIn: 'root',
})
export class BotDialogService {
  private dialog = inject(MatDialog);
  openCreate(
    serversList$: Observable<ISelectMenu[]>,
    jobList$: Observable<ISelectMenu[]>,
  ) {
    return this.dialog.open(BotFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Add new bot',
        buttons: ['add', 'cancel'],
        form: {
          botId: null,
          server: {
            serverId: null
          },
          job: {
            jobId: null
          },
          botName: '',
          description: '',
        },
        serversList: serversList$,
        jobList: jobList$,
      }
    }).afterClosed();
  }

  openEdit(
    row: any,
    serversList$: Observable<ISelectMenu[]>,
    jobList$: Observable<ISelectMenu[]>,
  ) {
    return this.dialog.open(BotFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      minHeight: '400px',
      minWidth: '600px',
      panelClass: 'custom-dialog-container',
      data: {
        title: 'Edit bot',
        buttons: ['save', 'cancel'],
        form: {
          botId: row.botId,
          botName: row.botName,
          description: row.description,
          jobId: row.job.jobId,
          serverId: row.server.serverId,
        },
        serversList: serversList$,
        jobList: jobList$,
      }
    }).afterClosed();
  }

}
