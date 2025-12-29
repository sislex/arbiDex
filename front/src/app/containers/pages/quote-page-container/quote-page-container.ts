import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
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
  private store = inject(Store);
  footerButtons = ['save', 'cancel'];

  activeSidebarItem$ = this.store.select(getActiveSidebarItem);

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/quotes`]);
      }
    }
  }
}
