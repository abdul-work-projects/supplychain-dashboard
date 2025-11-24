import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { Shipment, ShipmentStatus } from '../../types';
import { useStore } from '../../store/useStore';

interface ShipmentStatusChartProps {
  shipments: Shipment[];
}

const statusConfig: Record<
  ShipmentStatus,
  { label: string; color: string }
> = {
  in_transit: { label: 'In Transit', color: '#3b82f6' },
  delivered: { label: 'Delivered', color: '#6b7280' },
  delayed: { label: 'Delayed', color: '#ef4444' },
  at_risk: { label: 'At Risk', color: '#eab308' },
  pending: { label: 'Pending', color: '#8b5cf6' },
};

export function ShipmentStatusChart({ shipments }: ShipmentStatusChartProps) {
  const { darkMode } = useStore();

  const statusCounts = shipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {} as Record<ShipmentStatus, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: statusConfig[status as ShipmentStatus].label,
    value: count,
    color: statusConfig[status as ShipmentStatus].color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / shipments.length) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {item.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {item.value.toLocaleString()} shipments ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Shipment Status Distribution
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {shipments.length.toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total Shipments
        </p>
      </div>
    </div>
  );
}
