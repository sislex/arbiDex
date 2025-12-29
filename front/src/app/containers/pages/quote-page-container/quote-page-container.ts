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
import { setPairsData } from '../../../+state/db-config/db-config.actions';
import { setQuoteRelationsDataList } from '../../../+state/relations/relations.actions';

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

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.store.dispatch(setPairsData());
    this.store.dispatch(
      setQuoteRelationsDataList({ quoteId: id }),
    );
  }

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
        console.log('saveTO')
      } else if ($event.data === 'cancel') {
        console.log('cancelTO')
      }
    }
  };
}
