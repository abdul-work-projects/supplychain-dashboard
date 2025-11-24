import { useMemo, useState, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import { InventoryItem } from '../../types';
import clsx from 'clsx';

const columnHelper = createColumnHelper<InventoryItem>();

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: (info) => (
          <span className="font-mono text-sm text-gray-900 dark:text-white">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Product Name',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor('category', {
        header: 'Category',
        cell: (info) => (
          <span className="px-2 py-1 bg-gray-100 dark:bg-dark-border rounded text-xs font-medium text-gray-600 dark:text-gray-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('quantity', {
        header: 'Total Qty',
        cell: (info) => (
          <span className="font-medium text-gray-900 dark:text-white">
            {info.getValue().toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor('available', {
        header: 'Available',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {info.getValue().toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor('reserved', {
        header: 'Reserved',
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400">
            {info.getValue().toLocaleString()}
          </span>
        ),
      }),
      columnHelper.accessor('reorderPoint', {
        header: 'Reorder Point',
        cell: (info) => {
          const row = info.row.original;
          const isLowStock = row.available < info.getValue();
          return (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300">
                {info.getValue().toLocaleString()}
              </span>
              {isLowStock && (
                <span title="Below reorder point">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('lastUpdated', {
        header: 'Last Updated',
        cell: (info) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {format(info.getValue(), 'MMM d, h:mm a')}
          </span>
        ),
        sortingFn: 'datetime',
      }),
    ],
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div className="card overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <input
          type="text"
          placeholder="Search inventory..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="input w-full max-w-md"
        />
      </div>

      {/* Table Container */}
      <div
        ref={tableContainerRef}
        className="overflow-auto"
        style={{ maxHeight: '400px' }}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-dark-border z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="table-header whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className={clsx(
                          'flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200',
                          header.column.getCanSort() && 'cursor-pointer select-none'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="w-3 h-3" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-50" />
                            )}
                          </>
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              const isLowStock = row.original.available < row.original.reorderPoint;
              return (
                <tr
                  key={row.id}
                  className={clsx(
                    'border-b border-gray-100 dark:border-dark-border',
                    isLowStock && 'bg-red-50 dark:bg-red-900/10'
                  )}
                  style={{ height: `${virtualRow.size}px` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="table-cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-border">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {rows.length.toLocaleString()} items
        </span>
      </div>
    </div>
  );
}
