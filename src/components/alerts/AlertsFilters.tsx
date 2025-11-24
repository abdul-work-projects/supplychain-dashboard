import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { AlertSeverity, AlertType } from '../../types';
import clsx from 'clsx';

interface AlertsFiltersProps {
  selectedSeverities: AlertSeverity[];
  selectedTypes: AlertType[];
  showAcknowledged: boolean;
  onSeverityChange: (severities: AlertSeverity[]) => void;
  onTypeChange: (types: AlertType[]) => void;
  onShowAcknowledgedChange: (show: boolean) => void;
  onReset: () => void;
}

const severityOptions: { value: AlertSeverity; label: string; color: string }[] = [
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
  { value: 'warning', label: 'Warning', color: 'bg-yellow-500' },
  { value: 'info', label: 'Info', color: 'bg-blue-500' },
];

const typeOptions: { value: AlertType; label: string }[] = [
  { value: 'weather', label: 'Weather' },
  { value: 'customs', label: 'Customs' },
  { value: 'late_pickup', label: 'Late Pickup' },
  { value: 'carrier_delay', label: 'Carrier Delay' },
  { value: 'warehouse_congestion', label: 'Warehouse' },
  { value: 'route_deviation', label: 'Route' },
  { value: 'low_stock', label: 'Low Stock' },
];

export function AlertsFilters({
  selectedSeverities,
  selectedTypes,
  showAcknowledged,
  onSeverityChange,
  onTypeChange,
  onShowAcknowledgedChange,
  onReset,
}: AlertsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSeverity = (severity: AlertSeverity) => {
    if (selectedSeverities.includes(severity)) {
      onSeverityChange(selectedSeverities.filter((s) => s !== severity));
    } else {
      onSeverityChange([...selectedSeverities, severity]);
    }
  };

  const toggleType = (type: AlertType) => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const hasFilters = selectedSeverities.length > 0 || selectedTypes.length > 0 || !showAcknowledged;

  return (
    <div className="card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Severity Quick Filters */}
          <div className="flex gap-2">
            {severityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleSeverity(option.value)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedSeverities.includes(option.value)
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                <span className={clsx('w-2 h-2 rounded-full', option.color)} />
                {option.label}
              </button>
            ))}
          </div>

          {/* More Filters Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isExpanded
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {hasFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="pt-4 border-t border-gray-200 dark:border-dark-border space-y-4">
          {/* Alert Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alert Type
            </label>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleType(option.value)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedTypes.includes(option.value)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-dark-border dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Show Acknowledged */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showAcknowledged}
                onChange={(e) => onShowAcknowledgedChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Show acknowledged alerts
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
