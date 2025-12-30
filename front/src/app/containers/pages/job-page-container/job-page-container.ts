import { Component, inject } from '@angular/core';
import {
  AgGridJobRelationsContainer
} from '../../ag-grid/ag-grid-job-relations-container/ag-grid-job-relations-container';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { setJobRelationsDataList } from '../../../+state/relations/relations.actions';

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
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  currentJobId: number;

  constructor() {
    this.currentJobId = Number(this.route.snapshot.paramMap.get('id'));
    // this.store.dispatch(setQuoteRelations());
    this.store.dispatch(
      setJobRelationsDataList({ jobId: this.currentJobId }),
    );
  };

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/jobs`]);
      }
    }
  }
}
