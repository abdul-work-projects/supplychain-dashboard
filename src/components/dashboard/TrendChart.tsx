import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ChartDataPoint } from '../../types';
import { useStore } from '../../store/useStore';

interface TrendChartProps {
  data: ChartDataPoint[];
  title: string;
  color: string;
  type?: 'line' | 'area';
  valueFormatter?: (value: number) => string;
  gradientId?: string;
}

export function TrendChart({
  data,
  title,
  color,
  type = 'line',
  valueFormatter = (v) => v.toLocaleString(),
  gradientId = 'gradient',
}: TrendChartProps) {
  const { darkMode } = useStore();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {label}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {payload[0].dataKey}: {valueFormatter(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (type === 'area') {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={darkMode ? '#334155' : '#e5e7eb'}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#334155' : '#e5e7eb'}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
