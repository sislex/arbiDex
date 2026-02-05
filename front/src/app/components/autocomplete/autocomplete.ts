import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, startWith, debounceTime } from 'rxjs/operators';
import {ISelectMenu} from '../../models/db-config';
@Component({
  selector: 'app-autocomplete',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss',
})
export class Autocomplete implements OnInit, OnChanges {
  @Input() title: string = '';
  @Input() list: ISelectMenu[] = [];
  @Input() selected: any;
  @Input() disabled: boolean = false;

  @Output() emitter = new EventEmitter();

  myControl = new FormControl<string | ISelectMenu | null>('');
  filteredOptions$: Observable<ISelectMenu[]> = of([]);

  ngOnInit() {
    this.filteredOptions$ = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        let name = '';
        if (typeof value === 'string') {
          name = value;
        } else if (value && typeof value === 'object') {
          name = value.name;
        }

        return name ? this._filter(name) : this.list.slice(0, 100);
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selected'] || changes['list']) {
      const initialItem = this.list.find(item => item.id === this.selected);
      if (initialItem) {
        this.myControl.setValue(initialItem, { emitEvent: false });
      }
    }

    if (this.disabled) {
      this.myControl.disable();
    } else {
      this.myControl.enable();
    }
  }

  displayFn(item: ISelectMenu | null): string {
    if (!item) return '';
    return item.address ? `${item.name} (${item.address})` : item.name;
  }

  private _filter(name: string): ISelectMenu[] {
    const filterValue = name.toLowerCase();
    return this.list
      .filter(option => option.name.toLowerCase().includes(filterValue))
      .slice(0, 100);
  }

  onOptionSelected(event: any) {
    const id = event.option.value.id;
    this.emitter.emit({
      event: 'SelectField:ITEM_SELECTED',
      data: id
    });
  }

}
