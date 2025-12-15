import {Component, inject, OnInit} from '@angular/core';
import {Sidebar} from '../../components/sidebar/sidebar';
import {Store} from '@ngrx/store';
import {ActivatedRoute, Router, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-sidebar-container',
  imports: [
    Sidebar,
    RouterOutlet,
  ],
  standalone: true,
  templateUrl: './sidebar-container.html',
  styleUrl: './sidebar-container.scss'
})
export class SidebarContainer implements OnInit {
  private store = inject(Store);
  private router = inject(Router);
  private route=inject(ActivatedRoute);

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
    if ($event.event === 'Sidebar:TOGGLE_CLICKED') {
      // this.store.dispatch(toggleSidebar())
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

  // onAction($event: any, note: string) {
  //   if ($event.event === 'Actions:ACTION_CLICKED') {
  //     if (note === 'info' ) {
  //       this.openEditDialog()
  //     }
  //   }
  // }
}
