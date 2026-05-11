import { Edit2, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useRef } from 'react';
import type React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type GridApi,
  type ModelUpdatedEvent,
  type RowClickedEvent,
  type RowClassParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onRowClick?: (row: any) => void;
  selectedRow?: any;
  selectionMode?: 'none' | 'single' | 'multiple';
  onFilteredDataChange?: (filteredData: any[]) => void;
}

export function DataTable({
  columns,
  data,
  onEdit,
  onDelete,
  onRowClick,
  selectedRow,
  selectionMode = 'none',
  onFilteredDataChange,
}: DataTableProps) {
  const gridApiRef = useRef<GridApi | null>(null);

  const emitFilteredData = useCallback(
    (api: GridApi) => {
      if (!onFilteredDataChange) {
        return;
      }

      const filteredData: any[] = [];
      api.forEachNodeAfterFilterAndSort((node) => {
        if (node.data) {
          filteredData.push(node.data);
        }
      });
      onFilteredDataChange(filteredData);
    },
    [onFilteredDataChange],
  );

  const columnDefs = useMemo<ColDef[]>(() => {
    const gridColumns: ColDef[] = columns.map((column) => ({
      field: column.key,
      headerName: column.label,
      sortable: Boolean(column.sortable),
      filter: column.filterable ? 'agTextColumnFilter' : false,
      floatingFilter: Boolean(column.filterable),
      flex: 1,
      minWidth: column.key === 'checkbox' || column.key === 'actions' ? 64 : 120,
      suppressHeaderMenuButton: !column.filterable,
      cellRenderer: column.render
        ? (params: any) => column.render?.(params.value, params.data)
        : undefined,
    }));

    if (onEdit || onDelete) {
      gridColumns.unshift({
        colId: 'actions',
        headerName: 'ACTIONS',
        width: 96,
        minWidth: 96,
        maxWidth: 116,
        sortable: false,
        filter: false,
        pinned: 'left',
        cellRenderer: (params: any) => (
          <div className="flex h-full items-center gap-2">
            {onEdit && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(params.data);
                }}
                className="p-1.5 hover:bg-accent rounded transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(params.data);
                }}
                className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            )}
          </div>
        ),
      });
    }

    return gridColumns;
  }, [columns, onDelete, onEdit]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      filterParams: {
        buttons: ['reset'],
        debounceMs: 150,
      },
    }),
    [],
  );

  const handleModelUpdated = useCallback(
    (event: ModelUpdatedEvent) => {
      emitFilteredData(event.api);
    },
    [emitFilteredData],
  );

  const handleRowClicked = useCallback(
    (event: RowClickedEvent) => {
      if (event.data) {
        onRowClick?.(event.data);
      }
    },
    [onRowClick],
  );

  const getRowClass = useCallback(
    (params: RowClassParams) => {
      return selectedRow && params.data === selectedRow ? 'ag-row-selected-local' : '';
    },
    [selectedRow],
  );

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <div className="ag-theme-quartz arb-dex-grid h-full w-full">
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          suppressCellFocus
          animateRows
          rowSelection={selectionMode === 'none' ? undefined : selectionMode}
          getRowClass={getRowClass}
          onGridReady={(event) => {
            gridApiRef.current = event.api;
            emitFilteredData(event.api);
          }}
          onModelUpdated={handleModelUpdated}
          onRowClicked={handleRowClicked}
        />
      </div>
    </div>
  );
}
