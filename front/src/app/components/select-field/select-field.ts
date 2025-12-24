import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-select-field',
  imports: [MatFormFieldModule, MatSelectModule
  ],
  standalone: true,
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss'
})
export class SelectField {
  @Input() title: string = '';
  @Input() list: any = [];
  @Input() selected: any;
  @Input() disabled: boolean = false;

  @Output() emitter = new EventEmitter();

  click(data: any) {
    this.emitter.emit({
      event: 'SelectField:ITEM_SELECTED',
      data
    });
  }
}
