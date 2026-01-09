import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import type { ColDef, GridReadyEvent, GridApi } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-ag-grid',
  imports: [AgGridAngular],
  standalone: true,
  templateUrl: './ag-grid.html',
  styleUrl: './ag-grid.scss'
})
export class AgGrid implements OnChanges{
  @Input() rowData: any[] = [];
  @Input() colDefs: ColDef[] = [];
  @Input() defaultColDef: ColDef = {};
  @Input() isRowSelection: any = undefined;

  @Output() emitter = new EventEmitter();

  private gridApi!: GridApi;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.selectRows();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.rowData)
    if (changes['rowData'] && this.gridApi) {
      this.selectRows();
    }
  }

  private selectRows() {
    if (!this.gridApi) return;

    this.gridApi.forEachNode((node) => {
      if (node.data?.active) {
        node.setSelected(true);
      }
    });
  }

  onRowDoubleClicked($event: any) {
    this.emitter.emit({
      event: 'AgGrid:DOUBLE_CLICKED_ROW',
      row: $event
    });
  }

  onSelectionChanged($event: any) {
    this.emitter.emit({
      event: 'AgGrid:SET_CHECKBOX_ROW',
      row: $event
    });
  }
}
