import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-toolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, UpperCasePipe],
  standalone: true,
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class Toolbar {
  @Input() header: string = '';
  @Input() menuItemList: any = [];

  @Output() emitter = new EventEmitter();

  menuClick(data: any) {
    this.emitter.emit({
      event: 'Toolbar:MENU_CLICKED',
      data
    });
  }
}
