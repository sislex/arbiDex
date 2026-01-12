import { Component, inject } from '@angular/core';
import { Actions } from '../../../components/actions/actions';
import { TitleContentLayout } from '../../../components/layouts/title-content-layout/title-content-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  setActiveBot,
} from '../../../+state/relations/relations.actions';
import { AsyncPipe } from '@angular/common';
import { ButtonPanel } from '../../../components/button-panel/button-panel';
import { ContentFooterLayout } from '../../../components/layouts/content-footer-layout/content-footer-layout';
import { getActiveSidebarItem } from '../../../+state/view/view.selectors';
import { setBotPreConfig } from '../../../+state/main/main.actions';
import {
  AgGridBotRelationsContainer
} from '../../ag-grid/ag-grid-bot-relations-container/ag-grid-bot-relations-container';
import { setJobsData } from '../../../+state/db-config/db-config.actions';

@Component({
  selector: 'app-bot-page-container',
  imports: [
    Actions,
    TitleContentLayout,
    AsyncPipe,
    ButtonPanel,
    ContentFooterLayout,
    AgGridBotRelationsContainer,
  ],
  templateUrl: './bot-page-container.html',
  styleUrl: './bot-page-container.scss',
})
export class BotPageContainer {
  private router = inject(Router);
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  footerButtons = ['send', 'get config', 'cancel'];
  activeSidebarItem$ = this.store.select(getActiveSidebarItem);

  relatedBotRelationsIds: number[] = [];
  relatedFullBotData: any[] = [];
  currentBotId: number;

  constructor() {
    this.currentBotId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(setActiveBot({ botId: this.currentBotId }));
    this.store.dispatch(setJobsData());
  };

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'reply') {
        this.router.navigate([`data-view/bots`]);
      }
    }
  }

  events($event: any) {
    if ($event.event === 'ButtonPanel:BUTTON_CLICKED') {
      if ($event.data === 'get config') {
        this.store.dispatch(setBotPreConfig({ data: this.relatedFullBotData, botId: this.currentBotId }))
      } else if ($event.data === 'cancel') {
        console.log('cancelTO')
      }
    } else if ($event.event === 'AgGridBotRelationsContainer:ACTIVE_RELATIONS') {
      this.relatedBotRelationsIds = $event.data
      this.relatedFullBotData = $event.fullData
    }
  };
}
