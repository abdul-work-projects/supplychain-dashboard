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
  CheckCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Alert, AlertType, AlertSeverity } from '../../types';
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

const severityConfig: Record<AlertSeverity, { bg: string; border: string; icon: string; badge: string }> = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/10',
    border: 'border-l-red-500',
    icon: 'text-red-500',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/10',
    border: 'border-l-yellow-500',
    icon: 'text-yellow-500',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    border: 'border-l-blue-500',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
};

interface AlertsListProps {
  alerts: Alert[];
  onViewShipment?: (shipmentId: string) => void;
}

export function AlertsList({ alerts, onViewShipment }: AlertsListProps) {
  const { acknowledgeAlert, setSelectedShipment, shipments } = useStore();

  const handleViewShipment = (shipmentId: string) => {
    const shipment = shipments.find((s) => s.id === shipmentId);
    if (shipment) {
      setSelectedShipment(shipment);
    }
    onViewShipment?.(shipmentId);
  };

  if (alerts.length === 0) {
    return (
      <div className="card p-12 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-100 dark:bg-dark-border rounded-full mb-4">
          <CheckCheck className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          All Clear!
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          No alerts matching your filters at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        const Icon = alertIcons[alert.type];
        const config = severityConfig[alert.severity];

        return (
          <div
            key={alert.id}
            className={clsx(
              'card p-5 border-l-4 transition-all',
              config.border,
              config.bg,
              alert.acknowledged && 'opacity-60'
            )}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={clsx('p-2 rounded-lg bg-white dark:bg-dark-card', config.icon)}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {alert.title}
                      </h3>
                      <span className={clsx('px-2 py-0.5 rounded text-xs font-medium', config.badge)}>
                        {alert.severity}
                      </span>
                      {alert.acknowledged && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                          Acknowledged
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {alert.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="p-2 rounded-lg hover:bg-white dark:hover:bg-dark-card transition-colors"
                        title="Acknowledge alert"
                      >
                        <Check className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {format(alert.timestamp, 'MMM d, yyyy h:mm a')}
                  </span>

                  {alert.location && (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location.city}, {alert.location.country}</span>
                    </div>
                  )}

                  {alert.shipmentId && (
                    <button
                      onClick={() => handleViewShipment(alert.shipmentId!)}
                      className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      <Package className="w-3 h-3" />
                      <span>{alert.shipmentId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}

                  {alert.warehouseId && (
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Warehouse className="w-3 h-3" />
                      <span>{alert.warehouseId}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
