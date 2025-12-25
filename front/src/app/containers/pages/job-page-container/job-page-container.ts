import { Component, inject } from '@angular/core';
import {
  AgGridJobRelationsContainer
} from '../../ag-grid/ag-grid-job-relations-container/ag-grid-job-relations-container';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-page-container',
  imports: [
    AgGridJobRelationsContainer,
    Actions,
    TitleContentLayout,
  ],
  templateUrl: './job-page-container.html',
  styleUrl: './job-page-container.scss',
})
export class JobPageContainer {
  private router = inject(Router);

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/jobs`]);
      }
    }
  }
}
