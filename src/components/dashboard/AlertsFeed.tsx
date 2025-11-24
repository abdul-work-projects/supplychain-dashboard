import { format } from 'date-fns';
import {
  AlertTriangle,
  CloudRain,
  FileWarning,
  Clock,
  Truck,
  Warehouse,
  Navigation,
  Package,
  Check,
} from 'lucide-react';
import { Alert, AlertType } from '../../types';
import { useStore } from '../../store/useStore';
import clsx from 'clsx';

const alertIcons: Record<AlertType, React.ElementType> = {
  weather: CloudRain,
  customs: FileWarning,
  late_pickup: Clock,
  carrier_delay: Truck,
  warehouse_congestion: Warehouse,
  route_deviation: Navigation,
  low_stock: Package,
};

const severityStyles = {
  critical: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
  warning: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
  info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
};

const severityIconStyles = {
  critical: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

interface AlertsFeedProps {
  alerts: Alert[];
  maxItems?: number;
  showAcknowledge?: boolean;
}

export function AlertsFeed({
  alerts,
  maxItems = 5,
  showAcknowledge = true,
}: AlertsFeedProps) {
  const { acknowledgeAlert } = useStore();
  const displayAlerts = alerts.slice(0, maxItems);

  if (displayAlerts.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Alerts
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-12 h-12 mb-2 opacity-50" />
          <p>No active alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Alerts
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {alerts.filter((a) => !a.acknowledged).length} unread
        </span>
      </div>

      <div className="space-y-3">
        {displayAlerts.map((alert) => {
          const Icon = alertIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={clsx(
                'p-4 rounded-lg border-l-4 transition-all',
                severityStyles[alert.severity],
                alert.acknowledged && 'opacity-60'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={clsx('w-5 h-5 mt-0.5', severityIconStyles[alert.severity])}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {alert.title}
                    </p>
                    {showAcknowledge && !alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        title="Acknowledge"
                      >
                        <Check className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{format(alert.timestamp, 'MMM d, h:mm a')}</span>
                    {alert.shipmentId && (
                      <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                        {alert.shipmentId}
                      </span>
                    )}
                    {alert.location && (
                      <span>{alert.location.city}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {alerts.length > maxItems && (
        <button className="w-full mt-4 py-2 text-sm text-primary-600 dark:text-primary-400 hover:underline">
          View all {alerts.length} alerts
        </button>
      )}
    </div>
  );
}
