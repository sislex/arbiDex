import { Component, inject } from '@angular/core';
import {
  AgGridPairRelationsContainer
} from '../../ag-grid/ag-grid-pair-relations-container/ag-grid-pair-relations-container';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pair-page-container',
  imports: [
    AgGridPairRelationsContainer,
    Actions,
    TitleContentLayout,
  ],
  templateUrl: './pair-page-container.html',
  styleUrl: './pair-page-container.scss',
})
export class PairPageContainer {
  private router = inject(Router);

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/pairs`]);
      }
    }
  }
}
