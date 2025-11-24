import { useState } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { ShipmentStatus, VehicleType } from '../../types';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

const statusOptions: { value: ShipmentStatus; label: string }[] = [
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'at_risk', label: 'At Risk' },
  { value: 'pending', label: 'Pending' },
];

const priorityOptions = [
  { value: 'high' as const, label: 'High' },
  { value: 'medium' as const, label: 'Medium' },
  { value: 'low' as const, label: 'Low' },
];

const vehicleOptions: { value: VehicleType; label: string }[] = [
  { value: 'truck', label: 'Truck' },
  { value: 'ship', label: 'Ship' },
  { value: 'plane', label: 'Plane' },
  { value: 'train', label: 'Train' },
];

export function ShipmentsFilters() {
  const { filters, updateFilters, resetFilters } = useStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount =
    filters.status.length +
    filters.priority.length +
    filters.vehicleType.length +
    (filters.dateRange.start ? 1 : 0) +
    (filters.dateRange.end ? 1 : 0);

  const toggleArrayFilter = <T,>(
    current: T[],
    value: T,
    updateFn: (values: T[]) => void
  ) => {
    if (current.includes(value)) {
      updateFn(current.filter((v) => v !== value));
    } else {
      updateFn([...current, value]);
    }
  };

  return (
    <div className="card p-4 mb-6">
      {/* Search and quick filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, container, city, driver..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="input pl-10 w-full"
          />
        </div>

        {/* Status Quick Filter */}
        <div className="flex gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() =>
                toggleArrayFilter(filters.status, option.value, (status) =>
                  updateFilters({ status })
                )
              }
              className={clsx(
                'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                filters.status.includes(option.value)
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Advanced Filter Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
            showAdvanced || activeFilterCount > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      toggleArrayFilter(filters.priority, option.value, (priority) =>
                        updateFilters({ priority })
                      )
                    }
                    className={clsx(
                      'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                      filters.priority.includes(option.value)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vehicle Type
              </label>
              <div className="flex flex-wrap gap-2">
                {vehicleOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      toggleArrayFilter(
                        filters.vehicleType,
                        option.value,
                        (vehicleType) => updateFilters({ vehicleType })
                      )
                    }
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

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date Range
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={
                      filters.dateRange.start
                        ? filters.dateRange.start.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      updateFilters({
                        dateRange: {
                          ...filters.dateRange,
                          start: e.target.value ? new Date(e.target.value) : null,
                        },
                      })
                    }
                    className="input pl-10 w-full"
                  />
                </div>
                <span className="self-center text-gray-400">to</span>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={
                      filters.dateRange.end
                        ? filters.dateRange.end.toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      updateFilters({
                        dateRange: {
                          ...filters.dateRange,
                          end: e.target.value ? new Date(e.target.value) : null,
                        },
                      })
                    }
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
