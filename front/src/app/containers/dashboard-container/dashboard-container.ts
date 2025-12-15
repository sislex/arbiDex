import { Component } from '@angular/core';
import {Dashboard} from '../../components/dashboard/dashboard';

@Component({
  selector: 'app-dashboard-container',
  imports: [
    Dashboard
  ],
  standalone: true,
  templateUrl: './dashboard-container.html',
  styleUrl: './dashboard-container.scss',
})
export class DashboardContainer {

}
