import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import {
  AgGridQuotePairRelationsContainer
} from '../../ag-grid/ag-grid-quote-pair-relations-container/ag-grid-quote-pair-relations-container';
import {
  AgGridQuoteJobRelationsContainer
} from '../../ag-grid/ag-grid-quote-job-relations-container/ag-grid-quote-job-relations-container';
import { Router } from '@angular/router';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';

@Component({
  selector: 'app-quote-page-container',
  imports: [
    MatTabsModule,
    AgGridQuotePairRelationsContainer,
    AgGridQuoteJobRelationsContainer,
    Actions,
    TitleContentLayout,
  ],
  templateUrl: './quote-page-container.html',
  styleUrl: './quote-page-container.scss',
})
export class QuotePageContainer {
  private router = inject(Router);

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/quotes`]);
      }
    }
  }
}
