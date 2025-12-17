import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-field-title',
  imports: [],
  templateUrl: './field-title.html',
  styleUrl: './field-title.scss',
})
export class FieldTitle {
  @Input() title = '';

}
