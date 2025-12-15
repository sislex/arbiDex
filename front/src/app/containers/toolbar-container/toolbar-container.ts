import {Component, inject} from '@angular/core';
import {Toolbar} from '../../components/toolbar/toolbar';
import {Store} from '@ngrx/store';
import {AsyncPipe} from '@angular/common';
import {getFeatureName} from '../../+state/db-config/db-config.selectors';

@Component({
  selector: 'app-toolbar-container',
  imports: [
    Toolbar,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './toolbar-container.html',
  styleUrl: './toolbar-container.scss'
})
export class ToolbarContainer {
  private store = inject(Store);

  featureName$ = this.store.select(getFeatureName);
  events(event: any) {

  }
}
