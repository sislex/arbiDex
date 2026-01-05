import { Component, inject, OnInit } from '@angular/core';
import { SidebarContainer } from '../sidebar-container/sidebar-container';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { setActiveSidebarItem } from '../../+state/view/view.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  imports: [SidebarContainer],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  ngOnInit() {
    const updateFeatureFromRoute = () => {
      let route = this.router.routerState.root;

      while (route.firstChild) {
        route = route.firstChild;
      }

      const feature = route.snapshot.data['feature'];

      if (feature) {
        this.store.dispatch(
          setActiveSidebarItem({ item: feature }),
        );
      }
    };

    updateFeatureFromRoute();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => updateFeatureFromRoute());
  }
}
