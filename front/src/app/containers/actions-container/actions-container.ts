import { Component } from '@angular/core';
import {Actions} from '../../components/actions/actions';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-actions-container',
  imports: [
    Actions
  ],
  standalone: true,
  templateUrl: './actions-container.html',
  styleUrl: './actions-container.scss'
})
export class ActionsContainer implements ICellRendererAngularComp {
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
