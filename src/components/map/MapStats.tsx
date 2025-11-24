import { Package, AlertTriangle, Truck, Clock } from 'lucide-react';
import { Shipment } from '../../types';

interface MapStatsProps {
  shipments: Shipment[];
}

export function MapStats({ shipments }: MapStatsProps) {
  const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
  const delayed = shipments.filter((s) => s.status === 'delayed').length;
  const atRisk = shipments.filter((s) => s.status === 'at_risk').length;
  const vehicles = new Set(
    shipments.filter((s) => s.status === 'in_transit').map((s) => s.vehicle.id)
  ).size;

  const stats = [
    {
      icon: Package,
      value: inTransit,
      label: 'In Transit',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: AlertTriangle,
      value: delayed,
      label: 'Delayed',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      icon: Clock,
      value: atRisk,
      label: 'At Risk',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      icon: Truck,
      value: vehicles,
      label: 'Vehicles',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border p-4 flex items-center gap-3"
        >
          <div className={`p-2 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
