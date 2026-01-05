import {Component, inject} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import { Router, RouterOutlet} from '@angular/router';
import { toggleSidebar } from '../../+state/view/view.actions';
import { getActiveSidebarItem, getIsSidebarOpen, getSidebarList } from '../../+state/view/view.selectors';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { getChainsDataResponse, getFeatureName } from '../../+state/db-config/db-config.selectors';
import { HeaderContentLayout } from '../../components/layouts/header-content-layout/header-content-layout';
import { MainTitlePage } from '../../components/main-title-page/main-title-page';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    RouterOutlet,
    AsyncPipe,
    HeaderContentLayout,
    MainTitlePage,
    TitleCasePipe,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer {
  private store = inject(Store);
  private router = inject(Router);
  readonly dialog = inject(MatDialog);

  isSidebarOpen$ = this.store.select(getIsSidebarOpen);
  featureName$ = this.store.select(getFeatureName);
  sidebarList$ = this.store.select(getSidebarList);
  activeSidebarItem$ = this.store.select(getActiveSidebarItem);

  list$ = this.store.select(getChainsDataResponse).pipe(
    map(chains =>
      chains.map(chain => ({
        id: String(chain.chainId),
        name: chain.name,
      }))
    )
  );

  events($event: any) {
    if ($event.event === 'Sidebar:TOGGLE_CLICKED') {
      this.store.dispatch(toggleSidebar())
    } else if ($event.event === 'Sidebar:SET_ACTIVE_ITEM_CLICKED') {
      let address = $event.data;
      if (address) {
        this.router.navigate([`/data-view/${address}`]);
      }
    }
  }
}
