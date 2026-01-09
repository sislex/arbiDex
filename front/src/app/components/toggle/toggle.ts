import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-toggle',
  imports: [MatSlideToggleModule, FormsModule],
  standalone: true,
  templateUrl: './toggle.html',
  styleUrl: './toggle.scss',
})

export class Toggle {
  @Input() isChecked: boolean = false;
  @Input() description: string = '';
  @Input() title: string = '';

  @Output() emitter = new EventEmitter();

  onToggle($event: boolean) {
    this.emitter.emit({
      event: 'Toggle:TOGGLE_CLICKED',
      data: $event
    });
  }
}
