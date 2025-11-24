import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';

interface AlertsStatsProps {
  alerts: Alert[];
}

export function AlertsStats({ alerts }: AlertsStatsProps) {
  const critical = alerts.filter((a) => a.severity === 'critical' && !a.acknowledged).length;
  const warning = alerts.filter((a) => a.severity === 'warning' && !a.acknowledged).length;
  const info = alerts.filter((a) => a.severity === 'info' && !a.acknowledged).length;
  const acknowledged = alerts.filter((a) => a.acknowledged).length;

  const stats = [
    {
      icon: AlertTriangle,
      value: critical,
      label: 'Critical',
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      icon: AlertCircle,
      value: warning,
      label: 'Warning',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      icon: Info,
      value: info,
      label: 'Info',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: CheckCircle,
      value: acknowledged,
      label: 'Acknowledged',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="card p-4 flex items-center gap-4"
        >
          <div className={`p-3 rounded-xl ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
