import { Edit2, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type React from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
  type GetRowIdParams,
  type GridApi,
  type ModelUpdatedEvent,
  type RowClickedEvent,
  type RowDoubleClickedEvent,
  type RowClassParams,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import { agGridLocaleRu } from '../utils/agGridLocale';

ModuleRegistry.registerModules([AllCommunityModule]);

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
  headerRender?: () => React.ReactNode;
}

interface DataTableProps {
  title?: string;
  headerActions?: React.ReactNode;
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  loadingText?: string;
  /** Drives AG Grid filter/sort menu strings and the actions column header. */
  language?: 'en' | 'ru';
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  extraActions?: (row: any) => React.ReactNode;
  onRowClick?: (row: any) => void;
  onRowDoubleClick?: (row: any) => void;
  selectedRow?: any;
  selectionMode?: 'none' | 'single' | 'multiple';
  onFilteredDataChange?: (filteredData: any[]) => void;
  /** Stable row identity for AG Grid (e.g. pair rating rows). */
  getRowId?: (params: GetRowIdParams<any>) => string;
  /** Row id to highlight (e.g. bot line on server page). */
  highlightRowId?: string | null;
  getRowHighlightId?: (row: any) => string;
  /** Actions column: first (default, pinned left) or last (pinned right). */
  actionsColumnPosition?: 'first' | 'last';
}

export function DataTable({
  title,
  headerActions,
  columns,
  data,
  isLoading = false,
  loadingText = 'Loading…',
  language = 'en',
  onEdit,
  onDelete,
  extraActions,
  onRowClick,
  onRowDoubleClick,
  selectedRow,
  selectionMode = 'none',
  onFilteredDataChange,
  getRowId,
  highlightRowId,
  getRowHighlightId,
  actionsColumnPosition = 'first',
}: DataTableProps) {
  const rows = Array.isArray(data) ? data : [];
  const gridApiRef = useRef<GridApi | null>(null);
  const [filteredCount, setFilteredCount] = useState(rows.length);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const emitFilteredData = useCallback(
    (api: GridApi) => {
      try {
        const filteredData: any[] = [];
        api.forEachNodeAfterFilterAndSort((node) => {
          if (node.data) {
            filteredData.push(node.data);
          }
        });
        setFilteredCount(filteredData.length);
        const model = api.getFilterModel?.();
        const keys =
          model != null && typeof model === 'object' ? Object.keys(model as object) : [];
        setHasActiveFilters(keys.length > 0);
        onFilteredDataChange?.(filteredData);
      } catch {
        setFilteredCount(rows.length);
        setHasActiveFilters(false);
      }
    },
    [onFilteredDataChange, rows.length],
  );

  useEffect(() => {
    if (isLoading) {
      gridApiRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => {
    if (gridApiRef.current) {
      emitFilteredData(gridApiRef.current);
      return;
    }

    setFilteredCount(rows.length);
    setHasActiveFilters(false);
  }, [rows, emitFilteredData]);

  const actionsHeader = language === 'ru' ? 'ДЕЙСТВИЯ' : 'ACTIONS';
  const editTitle = language === 'ru' ? 'Изменить' : 'Edit';
  const deleteTitle = language === 'ru' ? 'Удалить' : 'Delete';

  const localeText = useMemo(() => (language === 'ru' ? agGridLocaleRu : undefined), [language]);

  const columnDefs = useMemo<ColDef[]>(() => {
    const gridColumns: ColDef[] = columns.map((column) => {
      const isCheckboxColumn = column.key === 'checkbox';
      const isAddressColumn = column.key.toLowerCase().includes('address');
      const HeaderComponent = column.headerRender
        ? () => <div className="flex h-full items-center justify-center">{column.headerRender?.()}</div>
        : undefined;
      return {
        field: column.key,
        headerName: column.headerRender ? undefined : column.label,
        headerComponent: HeaderComponent,
        sortable: Boolean(column.sortable),
        resizable: !isCheckboxColumn,
        filter: column.filterable ? 'agTextColumnFilter' : false,
        floatingFilter: false,
        ...(isCheckboxColumn
          ? {
              pinned: 'left' as const,
              width: 56,
              minWidth: 56,
              maxWidth: 56,
              flex: 0,
              lockPinned: true,
              suppressSizeToFit: true,
            }
          : {
              flex: 1,
              minWidth: 120,
            }),
        suppressHeaderMenuButton: true,
        suppressHeaderFilterButton: !column.filterable,
        menuTabs: column.filterable ? ['filterMenuTab'] : [],
        tooltipValueGetter: isAddressColumn
          ? (params: any) => {
              const value = params?.value;
              if (value === null || value === undefined || value === '') return null;
              return String(value);
            }
          : undefined,
        cellRenderer: column.render
          ? (params: any) => column.render?.(params.value, params.data)
          : undefined,
      };
    });

    if (onEdit || onDelete || extraActions) {
      const actionsCol: ColDef = {
        colId: 'actions',
        headerName: actionsHeader,
        width: extraActions ? 132 : 96,
        minWidth: extraActions ? 132 : 96,
        resizable: true,
        sortable: false,
        filter: false,
        pinned: actionsColumnPosition === 'last' ? 'right' : 'left',
        cellRenderer: (params: any) => (
          <div className="flex h-full items-center gap-2">
            {extraActions?.(params.data)}
            {onEdit && (
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(params.data);
                }}
                className="p-1.5 hover:bg-accent rounded transition-colors"
                title={editTitle}
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
                title={deleteTitle}
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            )}
          </div>
        ),
      };

      if (actionsColumnPosition === 'last') {
        gridColumns.push(actionsCol);
      } else {
        gridColumns.unshift(actionsCol);
      }
    }

    return gridColumns;
  }, [
    actionsColumnPosition,
    actionsHeader,
    columns,
    deleteTitle,
    editTitle,
    extraActions,
    onDelete,
    onEdit,
  ]);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      filterParams: {
        defaultOption: 'contains',
        filterOptions: ['contains'],
        maxNumConditions: 1,
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

  const handleRowDoubleClicked = useCallback(
    (event: RowDoubleClickedEvent) => {
      if (event.data) {
        onRowDoubleClick?.(event.data);
      }
    },
    [onRowDoubleClick],
  );

  const getRowClass = useCallback(
    (params: RowClassParams) => {
      const classes: string[] = [];
      if (selectedRow && params.data === selectedRow) {
        classes.push('ag-row-selected-local');
      }
      if (
        highlightRowId &&
        getRowHighlightId &&
        params.data &&
        getRowHighlightId(params.data) === highlightRowId
      ) {
        classes.push('ag-row-highlight-green');
      }
      return classes.join(' ');
    },
    [getRowHighlightId, highlightRowId, selectedRow],
  );

  return (
    <div className="flex-1 min-h-0 min-w-0 flex flex-col overflow-hidden">
      {(title || headerActions) && (
        <div className="h-11 shrink-0 border-b border-border bg-background flex items-center justify-between gap-3 px-4">
          <h2 className="text-sm text-foreground">
            {title}{' '}
            <span className="text-muted-foreground">
              {hasActiveFilters
                ? `(${filteredCount}/${rows.length})`
                : `(${rows.length})`}
            </span>
          </h2>
          {headerActions ? <div className="shrink-0">{headerActions}</div> : null}
        </div>
      )}
      <div className="ag-theme-quartz arb-dex-grid flex-1 min-h-0 min-w-0 w-full">
        {isLoading ? (
          <div className="size-full flex items-center justify-center">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="size-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
              <span className="text-sm">{loadingText}</span>
            </div>
          </div>
        ) : (
          <AgGridReact
            rowData={rows}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            localeText={localeText}
            enableBrowserTooltips
            enableCellTextSelection
            ensureDomOrder
            suppressCellFocus
            animateRows
            rowSelection={selectionMode === 'none' ? undefined : selectionMode}
            getRowId={getRowId}
            getRowClass={getRowClass}
            onGridReady={(event) => {
              gridApiRef.current = event.api;
              emitFilteredData(event.api);
            }}
            onGridPreDestroyed={() => {
              gridApiRef.current = null;
            }}
            onModelUpdated={handleModelUpdated}
            onRowClicked={handleRowClicked}
            onRowDoubleClicked={handleRowDoubleClicked}
          />
        )}
      </div>
    </div>
  );
}
