import { Component, inject } from '@angular/core';
import { Actions } from '../../../components/actions/actions';
import {
  AgGridBotRelationsContainer
} from '../../ag-grid/ag-grid-bot-relations-container/ag-grid-bot-relations-container';
import { AsyncPipe } from '@angular/common';
import { ButtonPanel } from '../../../components/button-panel/button-panel';
import { ContentFooterLayout } from '../../../components/layouts/content-footer-layout/content-footer-layout';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import {
  AgGridServerRelationsContainer
} from '../../ag-grid/ag-grid-server-relations-container/ag-grid-server-relations-container';
import { setActiveServer } from '../../../+state/relations/relations.actions';
import { setBotsData } from '../../../+state/db-config/db-config.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { getActiveSidebarItem } from '../../../+state/view/view.selectors';

@Component({
  selector: 'app-server-page-container',
  imports: [
    Actions,
    AgGridBotRelationsContainer,
    AsyncPipe,
    ButtonPanel,
    ContentFooterLayout,
    TitleContentLayout,
    AgGridServerRelationsContainer,
  ],
  templateUrl: './server-page-container.html',
  styleUrl: './server-page-container.scss',
})
export class ServerPageContainer {
  private router = inject(Router);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  footerButtons = ['save', 'get config', 'cancel'];
  currentServerId: number;

  activeSidebarItem$ = this.store.select(getActiveSidebarItem);

  constructor() {
    this.currentServerId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(setActiveServer({ serverId: this.currentServerId }));
    this.store.dispatch(setBotsData());
  };

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/servers`]);
      }
    }
  }

  events($event: any) {
  //   if ($event.event === 'ButtonPanel:BUTTON_CLICKED') {
  //     if ($event.data === 'save') {
  //       this.store.select(getJobRelations)
  //         .pipe(take(1))
  //         .subscribe((data: any) => {
  //           const mappedOldRelations = data.map((relation: IJobRelation) => ({
  //             quoteJobRelationId: relation.quoteJobRelationId,
  //             jobId: relation.job.jobId,
  //             quoteRelationId: relation.quote.pairQuoteRelationId
  //           }));
  //           this.setCreateAndRemoveLists(mappedOldRelations, this.relatedJobRelationsIds);
  //         });
  //     } else if ($event.data === 'get config') {
  //       this.store.dispatch(setPreConfig({ data: this.relatedFullJobData }))
  //     } else if ($event.data === 'cancel') {
  //       console.log('cancelTO')
  //     }
  //   } else if ($event.event === 'AgGridJobRelationsContainer:ACTIVE_RELATIONS') {
  //     this.relatedJobRelationsIds = $event.data
  //     this.relatedFullJobData = $event.fullData
  //   }
  };
}
