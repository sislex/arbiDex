import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import {
  AgGridQuoteRelationsContainer
} from '../../ag-grid/ag-grid-quote-relations-container/ag-grid-quote-relations-container';
import { ContentFooterLayout } from '../../../components/layouts/content-footer-layout/content-footer-layout';
import { ButtonPanel } from '../../../components/button-panel/button-panel';
import { getActiveSidebarItem } from '../../../+state/view/view.selectors';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import {setOneQuoteData, setPairsData} from '../../../+state/db-config/db-config.actions';
import {
  createQuoteRelations,
  deletingQuoteRelations,
  setQuoteRelationsDataList,
} from '../../../+state/relations/relations.actions';
import {
  getQuoteRelationsByQuoteId, getQuoteRelationsByQuoteIdIsLoaded,
  getQuoteRelationsByQuoteIdIsLoading
} from '../../../+state/relations/relations.selectors';
import { take } from 'rxjs';
import { IQuoteRelations, IQuoteRelationsCreate } from '../../../models/relations';
import {AgGridOneQuoteContainer} from '../../ag-grid/ag-grid-one-quote-container/ag-grid-one-quote-container';
import {
  AgGridQuoteNotRelationsContainer
} from '../../ag-grid/ag-grid-quote-not-relations-container/ag-grid-quote-not-relations-container';
import {Loader} from '../../../components/loader/loader';
import {
  getPairsDataIsLoaded,
  getPairsDataIsLoading,
  getQuotesDataIsLoaded,
  getQuotesDataIsLoading
} from '../../../+state/db-config/db-config.selectors';

@Component({
  selector: 'app-quote-page-container',
  imports: [
    MatTabsModule,
    Actions,
    TitleContentLayout,
    AgGridQuoteRelationsContainer,
    ContentFooterLayout,
    ButtonPanel,
    AsyncPipe,
    AgGridOneQuoteContainer,
    AgGridQuoteNotRelationsContainer,
    Loader,
  ],
  templateUrl: './quote-page-container.html',
  styleUrl: './quote-page-container.scss',
})
export class QuotePageContainer {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  footerButtons = ['save', 'cancel'];
  activeSidebarItem$ = this.store.select(getActiveSidebarItem);


  quotesDataIsLoading$ = this.store.select(getQuotesDataIsLoading);
  quotesDataIsLoaded$ = this.store.select(getQuotesDataIsLoaded);
  pairsDataIsLoading$ = this.store.select(getPairsDataIsLoading);
  pairsDataIsLoaded$ = this.store.select(getPairsDataIsLoaded);
  quoteRelationsIsLoading$ = this.store.select(getQuoteRelationsByQuoteIdIsLoading);
  quoteRelationsIsLoaded$ = this.store.select(getQuoteRelationsByQuoteIdIsLoaded);

  relatedPairsIds: number[] = [];
  newRelations: number[] = [];
  oldRelations: number[] = [];
  currentQuoteId: number;

  constructor() {
    this.currentQuoteId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(setPairsData());
    this.store.dispatch(
      setQuoteRelationsDataList({ quoteId: this.currentQuoteId }),
    );
    this.store.dispatch(setOneQuoteData({id: this.currentQuoteId}))

  };

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/quotes`]);
      }
    }
  };

  events($event: any) {
    if ($event.event === 'ButtonPanel:BUTTON_CLICKED') {
      if ($event.data === 'save') {
        this.store.select(getQuoteRelationsByQuoteId)
          .pipe(take(1))
          .subscribe((data: any) => {
            const mappedOldRelations = data.map((relation: IQuoteRelations) => ({
              pairQuoteRelationId: relation.pairQuoteRelationId,
              pairId: relation.pair.pairId,
              quoteId: relation.quote.quoteId
            }));
            this.setCreateAndRemoveLists(mappedOldRelations, this.relatedPairsIds);
          });
      } else if ($event.data === 'cancel') {
        console.log('cancelTO')
      }
    } else if ($event.event === 'AgGridQuoteRelationsContainer:ACTIVE_RELATIONS') {
      this.oldRelations = $event.data
      this.relatedPairsIds = [
        ...(this.newRelations),
        ...(this.oldRelations)
      ]
    } else if ($event.event === 'AgGridQuoteNotRelationsContainer:ACTIVE_RELATIONS') {
      this.newRelations= $event.data
      this.relatedPairsIds = [
        ...(this.newRelations),
        ...(this.oldRelations)
      ]
    }
  };

  setCreateAndRemoveLists(oldRelations: IQuoteRelationsCreate[], currentPairsIds: (number | string)[]) {
    const currentIds = currentPairsIds.map(id => Number(id));
    const currentIdsSet = new Set(currentIds);
    const oldIdsSet = new Set(oldRelations.map(rel => Number(rel.pairId)));

    const createList = currentIds
      .filter(id => !oldIdsSet.has(id))
      .map(id => ({
        quoteId: this.currentQuoteId,
        pairId: id
      }));

    const deleteList = oldRelations
      .filter(rel => !currentIdsSet.has(Number(rel.pairId)))
      .map(rel => (rel as any).pairQuoteRelationId)
      .filter(id => id !== undefined && id !== null);

    this.sendActions(createList, deleteList);
  };

  sendActions(createList: IQuoteRelationsCreate[], deleteList: number[]) {
    if (createList.length !== 0) {
      this.store.dispatch(createQuoteRelations({ quoteId: this.currentQuoteId, data: createList }));
    }
    if (deleteList.length !==0) {
      this.store.dispatch(deletingQuoteRelations({ quoteId: this.currentQuoteId, quoteRelationsIds: deleteList }));
    }
  };
}
