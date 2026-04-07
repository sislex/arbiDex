import { Component } from '@angular/core';
import {Actions} from '../../components/actions/actions';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-actions-container-cex-job',
  imports: [
    Actions
  ],
  standalone: true,
  templateUrl: './actions-container-cex-job.html',
  styleUrl: './actions-container-cex-job.scss'
})
export class ActionsContainerCexJob implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onAction($event: any, actionType: string) {
    if (this.params?.onAction) {
      this.params.onAction(
        {
          event: $event.event,
          actionType,
        },
        this.params.data
      );
    }
  }
}
