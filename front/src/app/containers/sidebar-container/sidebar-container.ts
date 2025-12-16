import {Component, inject, OnInit} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { setActiveSidebarItem, toggleSidebar } from '../../+state/view/view.actions';
import { getActiveSidebarItem, getIsSidebarOpen, getSidebarList } from '../../+state/view/view.selectors';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { getChainsDataResponse, getFeatureName } from '../../+state/db-config/db-config.selectors';
import { HeaderContentLayout } from '../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../components/title-table-button/title-table-button';
import { MainTitlePage } from '../../components/main-title-page/main-title-page';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    RouterOutlet,
    AsyncPipe,
    HeaderContentLayout,
    TitleTableButton,
    MainTitlePage,
    TitleCasePipe,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route=inject(ActivatedRoute);
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

  ngOnInit() {
    const logFeature = () => {
      let route = this.route;
      while (route.firstChild) {
        route = route.firstChild;
      }
      this.store.dispatch(setActiveSidebarItem({item: route.snapshot.data['feature']}))
    };

    logFeature();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => logFeature());
  }

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
