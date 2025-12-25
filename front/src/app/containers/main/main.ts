import { Component } from '@angular/core';
import {SidebarContainer} from '../sidebar-container/sidebar-container';

@Component({
  selector: 'app-main',
  imports: [
    SidebarContainer,
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
