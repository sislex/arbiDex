import {Component} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class Loader {
}
