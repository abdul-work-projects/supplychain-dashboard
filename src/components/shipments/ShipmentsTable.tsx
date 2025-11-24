import { useMemo, useState, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { format } from 'date-fns';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Truck,
  Ship,
  Plane,
  Train,
} from 'lucide-react';
import { Shipment, VehicleType } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

const columnHelper = createColumnHelper<Shipment>();

const vehicleIcons: Record<VehicleType, React.ElementType> = {
  truck: Truck,
  ship: Ship,
  plane: Plane,
  train: Train,
};

interface ShipmentsTableProps {
  shipments: Shipment[];
}

export function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  const { setSelectedShipment } = useStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Shipment ID',
        cell: (info) => (
          <div className="font-medium text-gray-900 dark:text-white">
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('containerId', {
        header: 'Container ID',
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor((row) => `${row.origin.city} → ${row.destination.city}`, {
        id: 'route',
        header: 'Route',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                {row.origin.city}
              </span>
              <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 truncate max-w-[80px]">
                {row.destination.city}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
        filterFn: 'equals',
      }),
      columnHelper.accessor('eta', {
        header: 'ETA',
        cell: (info) => (
          <span className="text-gray-700 dark:text-gray-300">
            {format(info.getValue(), 'MMM d, h:mm a')}
          </span>
        ),
        sortingFn: 'datetime',
      }),
      columnHelper.accessor((row) => row.vehicle.type, {
        id: 'vehicleType',
        header: 'Vehicle',
        cell: (info) => {
          const type = info.getValue();
          const Icon = vehicleIcons[type];
          return (
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300 capitalize">
                {type}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor((row) => row.vehicle.id, {
        id: 'vehicleId',
        header: 'Vehicle ID',
        cell: (info) => (
          <span className="text-gray-500 dark:text-gray-400 font-mono text-xs">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => {
          const priority = info.getValue();
          return (
            <span
              className={clsx(
                'px-2 py-1 rounded text-xs font-medium',
                priority === 'high' &&
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                priority === 'medium' &&
                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                priority === 'low' &&
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
              )}
            >
              {priority}
            </span>
          );
        },
      }),
      columnHelper.accessor('delayReason', {
        header: 'Delay Reason',
        cell: (info) => {
          const reason = info.getValue();
          return reason ? (
            <span className="text-gray-600 dark:text-gray-400 text-sm">
              {reason}
            </span>
          ) : (
            <span className="text-gray-400 dark:text-gray-500">-</span>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: shipments,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 56,
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
      {/* Table Container */}
      <div
        ref={tableContainerRef}
        className="overflow-auto"
        style={{ maxHeight: 'calc(100vh - 300px)', minHeight: '400px' }}
      >
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-50 dark:bg-dark-border z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="table-header whitespace-nowrap"
                    style={{ width: header.getSize() }}
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
              return (
                <tr
                  key={row.id}
                  onClick={() => setSelectedShipment(row.original)}
                  className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border cursor-pointer transition-colors"
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
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {rows.length.toLocaleString()} of{' '}
            {shipments.length.toLocaleString()} shipments
          </span>
          <span>
            {sorting.length > 0 && (
              <span>
                Sorted by {sorting[0].id} ({sorting[0].desc ? 'desc' : 'asc'})
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
