import { Edit2, Trash2, ArrowUpDown, Filter } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

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
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) =>
          String(row[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, sortColumn, sortDirection]);

  useEffect(() => {
    if (onFilteredDataChange) {
      onFilteredDataChange(filteredAndSortedData);
    }
  }, [filteredAndSortedData, onFilteredDataChange]);

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-muted z-10">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left px-3 py-2 border-b border-border"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {column.label}
                  </span>
                  {column.sortable && (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="p-0.5 hover:bg-accent rounded transition-colors"
                    >
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                  {column.filterable && (
                    <button className="p-0.5 hover:bg-accent rounded transition-colors">
                      <Filter className="w-3 h-3 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {column.filterable && (
                  <input
                    type="text"
                    value={filters[column.key] || ''}
                    onChange={(e) =>
                      setFilters({ ...filters, [column.key]: e.target.value })
                    }
                    placeholder="Filter..."
                    className="mt-1 w-full px-2 py-1 text-xs bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-left px-3 py-2 border-b border-border w-20">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedData.map((row, idx) => (
            <tr
              key={idx}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-border transition-colors ${
                selectedRow === row
                  ? 'bg-accent/50'
                  : 'hover:bg-muted/50 cursor-pointer'
              }`}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-3 py-2">
                  <span className="text-sm text-foreground">
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </span>
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(row);
                        }}
                        className="p-1.5 hover:bg-accent rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(row);
                        }}
                        className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
