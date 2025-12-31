import { Component, inject } from '@angular/core';
import {
  AgGridJobRelationsContainer
} from '../../ag-grid/ag-grid-job-relations-container/ag-grid-job-relations-container';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  createJobRelations,
  deletingJobRelations,
  setJobRelationsDataList,
  setQuoteRelations,
} from '../../../+state/relations/relations.actions';
import {
  AgGridQuoteRelationsContainer
} from '../../ag-grid/ag-grid-quote-relations-container/ag-grid-quote-relations-container';
import { getJobRelations } from '../../../+state/relations/relations.selectors';
import { take } from 'rxjs';
import {
  IJobRelation,
  IJobRelationCreate,
} from '../../../models/relations';
import { AsyncPipe } from '@angular/common';
import { ButtonPanel } from '../../../components/button-panel/button-panel';
import { ContentFooterLayout } from '../../../components/layouts/content-footer-layout/content-footer-layout';
import { getActiveSidebarItem } from '../../../+state/view/view.selectors';

@Component({
  selector: 'app-job-page-container',
  imports: [
    AgGridJobRelationsContainer,
    Actions,
    TitleContentLayout,
    AgGridQuoteRelationsContainer,
    AsyncPipe,
    ButtonPanel,
    ContentFooterLayout,
  ],
  templateUrl: './job-page-container.html',
  styleUrl: './job-page-container.scss',
})
export class JobPageContainer {
  private router = inject(Router);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  footerButtons = ['save', 'cancel'];
  activeSidebarItem$ = this.store.select(getActiveSidebarItem);

  relatedJobRelationsIds: number[] = [];
  currentJobId: number;

  constructor() {
    this.currentJobId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(setQuoteRelations());
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

  events($event: any) {
    if ($event.event === 'ButtonPanel:BUTTON_CLICKED') {
      if ($event.data === 'save') {
        this.store.select(getJobRelations)
          .pipe(take(1))
          .subscribe((data: any) => {
            const mappedOldRelations = data.map((relation: IJobRelation) => ({
              quoteJobRelationId: relation.quoteJobRelationId,
              jobId: relation.job.jobId,
              quoteRelationId: relation.quote.pairQuoteRelationId
            }));
            this.setCreateAndRemoveLists(mappedOldRelations, this.relatedJobRelationsIds);
          });
      } else if ($event.data === 'cancel') {
        console.log('cancelTO')
      }
    } else if ($event.event === 'AgGridJobRelationsContainer:ACTIVE_RELATIONS') {
      this.relatedJobRelationsIds = $event.data
    }
  };

  setCreateAndRemoveLists(oldRelations: IJobRelationCreate[], currentPairsIds: (number | string)[]) {
    const currentIds = currentPairsIds.map(id => Number(id));
    const currentIdsSet = new Set(currentIds);
    const oldIdsSet = new Set(oldRelations.map(rel => Number(rel.quoteRelationId)));

    const createList = currentIds
      .filter(id => !oldIdsSet.has(id))
      .map(id => ({
        jobId: this.currentJobId,
        quoteRelationId: id
      }));

    const deleteList = oldRelations
      .filter(rel => !currentIdsSet.has(Number(rel.quoteRelationId)))
      .map(rel => (rel as any).quoteJobRelationId)
      .filter(id => id !== undefined && id !== null);

    this.sendActions(createList, deleteList);
  };

  sendActions(createList: IJobRelationCreate[], deleteList: number[]) {
    if (createList.length !== 0) {
      console.log('createList', createList)
      this.store.dispatch(createJobRelations({ data: createList }));
    }
    if (deleteList.length !==0) {
      this.store.dispatch(deletingJobRelations({ jobRelationsIds: deleteList }));
    }
  };
}
