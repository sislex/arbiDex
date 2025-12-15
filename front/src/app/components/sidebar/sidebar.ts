import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {TitleCasePipe, UpperCasePipe} from '@angular/common';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-sidebar',
  imports: [
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    UpperCasePipe,
    MatButtonToggleModule,
    TitleCasePipe,
  ],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  @Input() sidebarTitle: string = '';
  @Input() isSidebarOpen: boolean = true;
  @Input() list: any[] = [];
  @Input() activeItem: string = '';

  @Output() emitter = new EventEmitter();

  togglePanel() {
    this.emitter.emit({
      event: 'Sidebar:TOGGLE_CLICKED',
    });
  }

  setActiveItem(ipPort: string) {
    this.emitter.emit({
      event: 'Sidebar:SET_ACTIVE_ITEM_CLICKED',
      data: ipPort.toLowerCase(),
    });
  }

}
