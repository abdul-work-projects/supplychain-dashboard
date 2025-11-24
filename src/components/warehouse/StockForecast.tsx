import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { InventoryItem } from '../../types';
import { useStore } from '../../store/useStore';

interface StockForecastProps {
  items: InventoryItem[];
}

export function StockForecast({ items }: StockForecastProps) {
  const { darkMode } = useStore();

  // Aggregate forecast data
  const days = ['Today', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];

  const forecastData = days.map((day, index) => {
    const totalDemand = items.reduce(
      (sum, item) => sum + (item.forecastedDemand[index] || 0),
      0
    );
    const totalStock = items.reduce((sum, item) => sum + item.available, 0);
    const projectedStock = Math.max(0, totalStock - totalDemand * (index + 1));

    return {
      day,
      demand: totalDemand,
      projectedStock: projectedStock,
      reorderThreshold: totalStock * 0.3, // 30% threshold
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {Math.round(entry.value).toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        7-Day Stock Forecast
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData}>
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#334155' : '#e5e7eb'}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={forecastData[0]?.reorderThreshold || 0}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{
                value: 'Reorder Threshold',
                fill: darkMode ? '#ef4444' : '#ef4444',
                fontSize: 11,
                position: 'right',
              }}
            />
            <Area
              type="monotone"
              dataKey="projectedStock"
              name="Projected Stock"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#stockGradient)"
            />
            <Area
              type="monotone"
              dataKey="demand"
              name="Daily Demand"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#demandGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-gray-500 dark:text-gray-400">Projected Stock</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500" />
          <span className="text-gray-500 dark:text-gray-400">Daily Demand</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
          <span className="text-gray-500 dark:text-gray-400">Reorder Threshold</span>
        </div>
      </div>
    </div>
  );
}
