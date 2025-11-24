import {
  Package,
  AlertTriangle,
  Warehouse,
  Truck,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Layout } from '../components/layout';
import {
  KPICard,
  TrendChart,
  AlertsFeed,
  ShipmentStatusChart,
  RecentShipments,
} from '../components/dashboard';
import { useStore, useUnacknowledgedAlerts } from '../store/useStore';
import { PageLoader } from '../components/common';

export function Dashboard() {
  const { shipments, kpiData, chartData, alerts } = useStore();
  const unacknowledgedAlerts = useUnacknowledgedAlerts();

  if (!kpiData || !chartData) {
    return (
      <Layout title="Dashboard">
        <PageLoader />
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <KPICard
          title="Shipments In Transit"
          value={kpiData.shipmentsInTransit}
          change={kpiData.shipmentsInTransitChange}
          icon={<Package className="w-6 h-6" />}
          iconBgColor="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <KPICard
          title="Delayed Shipments"
          value={kpiData.delayedShipments}
          change={kpiData.delayedShipmentsChange}
          icon={<AlertTriangle className="w-6 h-6" />}
          iconBgColor="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-600 dark:text-red-400"
        />
        <KPICard
          title="Warehouse Utilization"
          value={`${kpiData.warehouseUtilization}%`}
          change={kpiData.warehouseUtilizationChange}
          icon={<Warehouse className="w-6 h-6" />}
          iconBgColor="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
        <KPICard
          title="Active Vehicles"
          value={kpiData.activeVehicles}
          change={kpiData.activeVehiclesChange}
          icon={<Truck className="w-6 h-6" />}
          iconBgColor="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card p-6 flex items-center gap-6">
          <div className="p-4 rounded-xl bg-green-100 dark:bg-green-900/30">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              On-Time Delivery Rate
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {kpiData.onTimeDeliveryRate}%
            </p>
          </div>
        </div>
        <div className="card p-6 flex items-center gap-6">
          <div className="p-4 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
            <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Average Delivery Time
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white">
              {kpiData.avgDeliveryTime} days
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TrendChart
          data={chartData.deliveryTrend}
          title="On-Time Delivery Rate (%)"
          color="#22c55e"
          type="area"
          valueFormatter={(v) => `${v}%`}
          gradientId="deliveryGradient"
        />
        <TrendChart
          data={chartData.delayTrend}
          title="Daily Delays"
          color="#ef4444"
          valueFormatter={(v) => v.toString()}
        />
        <TrendChart
          data={chartData.volumeTrend}
          title="Shipment Volume"
          color="#3b82f6"
          type="area"
          gradientId="volumeGradient"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ShipmentStatusChart shipments={shipments} />
        </div>
        <div className="lg:col-span-1">
          <RecentShipments shipments={shipments} maxItems={4} />
        </div>
        <div className="lg:col-span-1">
          <AlertsFeed alerts={unacknowledgedAlerts} maxItems={4} />
        </div>
      </div>
    </Layout>
  );
}
