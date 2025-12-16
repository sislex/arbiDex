import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-input-field',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconButton, MatIconModule],
  standalone: true,
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss'
})
export class InputField {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() inputValue: string | number = '';
  @Input() title: string = '';
  @Input() type: 'number' | 'text' = 'text';

  @Output() emitter = new EventEmitter();

  clearInput() {
    this.inputValue = '';
    this.onInputChange(this.inputValue);
  };

  onInputChange(data: any) {
    this.emitter.emit({
      event: 'InputField:INPUT_CHANGED',
      data
    });
  }
}
