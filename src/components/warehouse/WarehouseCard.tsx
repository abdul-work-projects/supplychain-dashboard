import { MapPin, Package, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { Warehouse } from '../../types';
import clsx from 'clsx';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onClick?: () => void;
  isSelected?: boolean;
}

export function WarehouseCard({ warehouse, onClick, isSelected }: WarehouseCardProps) {
  const utilizationColor =
    warehouse.utilization > 90
      ? 'text-red-600 dark:text-red-400'
      : warehouse.utilization > 75
      ? 'text-yellow-600 dark:text-yellow-400'
      : 'text-green-600 dark:text-green-400';

  const utilizationBgColor =
    warehouse.utilization > 90
      ? 'bg-red-500'
      : warehouse.utilization > 75
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <div
      onClick={onClick}
      className={clsx(
        'card p-5 cursor-pointer transition-all hover:shadow-md',
        isSelected && 'ring-2 ring-primary-500'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {warehouse.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <MapPin className="w-3 h-3" />
            <span>{warehouse.location.city}, {warehouse.location.country}</span>
          </div>
        </div>
        {warehouse.alerts > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
            <AlertTriangle className="w-3 h-3 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">
              {warehouse.alerts}
            </span>
          </div>
        )}
      </div>

      {/* Utilization */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Utilization</span>
          <span className={clsx('text-sm font-semibold', utilizationColor)}>
            {warehouse.utilization}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all', utilizationBgColor)}
            style={{ width: `${warehouse.utilization}%` }}
          />
        </div>
      </div>

      {/* Stock Info */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(warehouse.currentStock / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Current</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(warehouse.capacity / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Capacity</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {((warehouse.capacity - warehouse.currentStock) / 1000).toFixed(1)}k
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
        </div>
      </div>

      {/* Inbound/Outbound */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded">
            <ArrowDownRight className="w-3 h-3 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {warehouse.inboundToday}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Inbound</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded">
            <ArrowUpRight className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {warehouse.outboundToday}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Outbound</p>
          </div>
        </div>
      </div>
    </div>
  );
}
