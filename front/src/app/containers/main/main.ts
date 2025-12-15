import { Component } from '@angular/core';
import {SidebarContainer} from '../sidebar-container/sidebar-container';
import {ToolbarContainer} from '../toolbar-container/toolbar-container';
import {HeaderContentLayout} from '../../components/layouts/header-content-layout/header-content-layout';

@Component({
  selector: 'app-main',
  imports: [
    SidebarContainer,
    ToolbarContainer,
    HeaderContentLayout
  ],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {

}
