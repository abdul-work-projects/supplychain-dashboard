import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { ShipmentStatus, VehicleType } from '../../types';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

const statusOptions: { value: ShipmentStatus; label: string; color: string }[] = [
  { value: 'in_transit', label: 'In Transit', color: 'bg-blue-500' },
  { value: 'delivered', label: 'Delivered', color: 'bg-gray-500' },
  { value: 'delayed', label: 'Delayed', color: 'bg-red-500' },
  { value: 'at_risk', label: 'At Risk', color: 'bg-yellow-500' },
  { value: 'pending', label: 'Pending', color: 'bg-purple-500' },
];

const vehicleOptions: { value: VehicleType; label: string }[] = [
  { value: 'truck', label: 'Truck' },
  { value: 'ship', label: 'Ship' },
  { value: 'plane', label: 'Plane' },
  { value: 'train', label: 'Train' },
];

export function MapFilters() {
  const { filters, updateFilters, resetFilters } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.status.length > 0 ||
    filters.vehicleType.length > 0 ||
    filters.priority.length > 0;

  const toggleStatus = (status: ShipmentStatus) => {
    const newStatuses = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    updateFilters({ status: newStatuses });
  };

  const toggleVehicle = (vehicle: VehicleType) => {
    const newVehicles = filters.vehicleType.includes(vehicle)
      ? filters.vehicleType.filter((v) => v !== vehicle)
      : [...filters.vehicleType, vehicle];
    updateFilters({ vehicleType: newVehicles });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
          hasActiveFilters
            ? 'bg-primary-600 text-white hover:bg-primary-700'
            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border border border-gray-200 dark:border-dark-border'
        )}
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {hasActiveFilters && (
          <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
            {filters.status.length + filters.vehicleType.length + filters.priority.length}
          </span>
        )}
        <ChevronDown className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border z-50 p-4">
          {/* Status */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleStatus(option.value)}
                  className={clsx(
                    'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    filters.status.includes(option.value)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  <span className={clsx('w-2 h-2 rounded-full', option.color)} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Vehicle Type
            </h4>
            <div className="flex flex-wrap gap-2">
              {vehicleOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleVehicle(option.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    filters.vehicleType.includes(option.value)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
            <button
              onClick={() => {
                resetFilters();
                setIsOpen(false);
              }}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Reset all
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="btn-primary text-sm"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="absolute top-full left-0 mt-2 flex flex-wrap gap-2">
          {filters.status.map((status) => (
            <span
              key={status}
              className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-dark-card rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border"
            >
              {status.replace('_', ' ')}
              <button
                onClick={() => toggleStatus(status)}
                className="hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
