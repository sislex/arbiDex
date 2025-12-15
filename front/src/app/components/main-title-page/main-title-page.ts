import {Component, Input} from '@angular/core';
import {UpperCasePipe} from '@angular/common';

@Component({
  selector: 'app-main-title-page',
    imports: [
        UpperCasePipe
    ],
  templateUrl: './main-title-page.html',
  styleUrl: './main-title-page.scss',
})
export class MainTitlePage {
  @Input() title: string = '';

}
