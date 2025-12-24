import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Component, EventEmitter, Input, Output } from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid.html',
  styleUrl: './ag-grid.scss'
})
export class AgGrid {
  @Input() rowData: any[] = [];
  @Input() colDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {};

  @Output() emitter = new EventEmitter();

  onRowDoubleClicked($event: any) {
    this.emitter.emit({
      event: 'AgGrid:DOUBLE_CLICKED_ROW',
      row: $event
    });
  }
}
