import { ShipmentStatus } from '../../types';

const legendItems: { status: ShipmentStatus; label: string; color: string }[] = [
  { status: 'in_transit', label: 'In Transit', color: '#3b82f6' },
  { status: 'at_risk', label: 'At Risk', color: '#eab308' },
  { status: 'delayed', label: 'Delayed', color: '#ef4444' },
  { status: 'delivered', label: 'Delivered', color: '#6b7280' },
  { status: 'pending', label: 'Pending', color: '#8b5cf6' },
];

export function MapLegend() {
  return (
    <div className="bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border p-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Status Legend
      </h4>
      <div className="space-y-2">
        {legendItems.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
