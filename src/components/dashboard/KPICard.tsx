import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  iconBgColor,
  iconColor,
}: KPICardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === 0 || change === undefined;

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={clsx('p-3 rounded-xl', iconBgColor)}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={clsx(
              'flex items-center gap-1 text-sm font-medium',
              isPositive && 'text-green-600 dark:text-green-400',
              isNegative && 'text-red-600 dark:text-red-400',
              isNeutral && 'text-gray-500 dark:text-gray-400'
            )}
          >
            {isPositive && <TrendingUp className="w-4 h-4" />}
            {isNegative && <TrendingDown className="w-4 h-4" />}
            {isNeutral && <Minus className="w-4 h-4" />}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {changeLabel}
          </span>
        </div>
      )}
    </div>
  );
}
