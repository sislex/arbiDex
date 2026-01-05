import {Component, Input} from '@angular/core';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-title-content-layout',
  imports: [
    UpperCasePipe
  ],
  standalone: true,
  templateUrl: './title-content-layout.html',
  styleUrl: './title-content-layout.scss'
})
export class TitleContentLayout {
  @Input() title: string = '';
}
