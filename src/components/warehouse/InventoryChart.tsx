import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { WarehouseCategory } from '../../types';
import { useStore } from '../../store/useStore';

interface InventoryChartProps {
  categories: WarehouseCategory[];
}

export function InventoryChart({ categories }: InventoryChartProps) {
  const { darkMode } = useStore();

  const data = categories.map((cat) => ({
    name: cat.name,
    stock: cat.stock,
    capacity: cat.capacity,
    utilization: ((cat.stock / cat.capacity) * 100).toFixed(1),
    isLowStock: cat.stock < cat.lowStockThreshold,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Stock: {item.stock.toLocaleString()} / {item.capacity.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Utilization: {item.utilization}%
          </p>
          {item.isLowStock && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              Low Stock Alert
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getBarColor = (entry: any) => {
    if (entry.isLowStock) return '#ef4444';
    const util = parseFloat(entry.utilization);
    if (util > 90) return '#ef4444';
    if (util > 75) return '#eab308';
    return '#22c55e';
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Inventory by Category
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={darkMode ? '#334155' : '#e5e7eb'}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: darkMode ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="stock"
              radius={[0, 4, 4, 0]}
              background={{ fill: darkMode ? '#1e293b' : '#f3f4f6', radius: 4 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-gray-500 dark:text-gray-400">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-gray-500 dark:text-gray-400">High (75%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-500 dark:text-gray-400">Critical / Low Stock</span>
        </div>
      </div>
    </div>
  );
}
