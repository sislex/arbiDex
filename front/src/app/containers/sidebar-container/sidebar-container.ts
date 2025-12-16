import {Component, inject, OnInit} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import { toggleSidebar } from '../../+state/view/view.actions';
import { getIsSidebarOpen } from '../../+state/view/view.selectors';
import { AsyncPipe } from '@angular/common';
import { getChainsDataResponse, getFeatureName } from '../../+state/db-config/db-config.selectors';
import { HeaderContentLayout } from '../../components/layouts/header-content-layout/header-content-layout';
import { TitleTableButton } from '../../components/title-table-button/title-table-button';
import { MainTitlePage } from '../../components/main-title-page/main-title-page';
import { MatDialog } from '@angular/material/dialog';
import { TokenFormContainer } from '../forms/token-form-container/token-form-container';
import { map } from 'rxjs';
import { createToken } from '../../+state/db-config/db-config.actions';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    RouterOutlet,
    AsyncPipe,
    HeaderContentLayout,
    TitleTableButton,
    MainTitlePage,
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

  getChainsData$ = this.store.select(getChainsDataResponse);
  chainNames$ = this.getChainsData$.pipe(
    map(chains => chains?.map(chain => chain.name) || [])
  );

  list = [
    'Tokens',
    'Pools',
    'Markets',
    'Dexes',
    'Chains'
  ];

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const table = this.route.snapshot.routeConfig?.path;
      console.log(this.route.snapshot.routeConfig?.path);


      // if (ipPort && tabId !== null) {
      //   const [ip, port] = ipPort.split(':');
      //   this.store.dispatch(setActiveTab({ tab: tabId }));
      //   this.store.dispatch(clearActiveElementData());
      //   this.store.dispatch(setActiveServer({ ip, port }));
      // }
    });
  }

  events($event: any) {
    console.log($event)
    if ($event.event === 'Sidebar:TOGGLE_CLICKED') {
      this.store.dispatch(toggleSidebar())
    } else if ($event.event === 'Sidebar:SET_ACTIVE_ITEM_CLICKED') {
      let address = $event.data;
      if (address) {
        this.router.navigate([`/data-view/${address}`]);

        // this.activeTab$.pipe(take(1)).subscribe(activeTab => {
        //   if (activeTab) {
        //     this.router.navigate([`/data-view/${address}`]);
        //
        //   }
        // });
      }
    }
  }

  onAction($event: any, note: string) {
    if ($event.event === 'Actions:ACTION_CLICKED') {
      if (note === 'add' ) {
        this.openEditDialog()
      }
    }
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(TokenFormContainer, {
      width: '90%',
      height: '90%',
      maxWidth: '100%',
      maxHeight: '100%',
      data: {
        title: 'Add new token',
        buttons: ['add', 'cancel'],
        form: {
          list: this.chainNames$,
          selected: '',
          address: '',
          symbol: '',
          decimals: null,
        }
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.data === 'add') {
          this.store.dispatch(createToken({data: result.formData}))
        } else {
        }
      } else {
        console.log('Deletion cancelled');
      }
    });
  }
}
