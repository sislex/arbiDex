import { Component } from '@angular/core';
import { Actions } from '../../components/actions/actions';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-is-relation-action-container',
  imports: [
    Actions,
  ],
  templateUrl: './is-relation-action-container.html',
  styleUrl: './is-relation-action-container.scss',
})
export class IsRelationActionContainer implements ICellRendererAngularComp {
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
