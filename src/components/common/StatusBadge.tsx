import { ShipmentStatus } from '../../types';
import clsx from 'clsx';

interface StatusBadgeProps {
  status: ShipmentStatus;
  size?: 'sm' | 'md';
}

const statusLabels: Record<ShipmentStatus, string> = {
  in_transit: 'In Transit',
  delivered: 'Delivered',
  delayed: 'Delayed',
  at_risk: 'At Risk',
  pending: 'Pending',
};

const statusStyles: Record<ShipmentStatus, string> = {
  in_transit: 'status-intransit',
  delivered: 'status-delivered',
  delayed: 'status-delayed',
  at_risk: 'status-atrisk',
  pending: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'status-badge',
        statusStyles[status],
        size === 'sm' && 'text-[10px] px-1.5 py-0.5'
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
