import { format } from 'date-fns';
import { ArrowRight, MapPin } from 'lucide-react';
import { Shipment } from '../../types';
import { useStore } from '../../store/useStore';
import { StatusBadge } from '../common/StatusBadge';
import clsx from 'clsx';

interface RecentShipmentsProps {
  shipments: Shipment[];
  maxItems?: number;
}

export function RecentShipments({ shipments, maxItems = 5 }: RecentShipmentsProps) {
  const { setSelectedShipment } = useStore();
  const recentShipments = [...shipments]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, maxItems);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Shipments
      </h3>

      <div className="space-y-4">
        {recentShipments.map((shipment) => (
          <div
            key={shipment.id}
            onClick={() => setSelectedShipment(shipment)}
            className="p-4 rounded-lg border border-gray-200 dark:border-dark-border hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {shipment.id}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {shipment.containerId}
                </p>
              </div>
              <StatusBadge status={shipment.status} />
            </div>

            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                {shipment.origin.city}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400 truncate max-w-[100px]">
                {shipment.destination.city}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>ETA: {format(shipment.eta, 'MMM d, h:mm a')}</span>
              <span
                className={clsx(
                  'px-2 py-0.5 rounded',
                  shipment.priority === 'high' &&
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                  shipment.priority === 'medium' &&
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                  shipment.priority === 'low' &&
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                )}
              >
                {shipment.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
