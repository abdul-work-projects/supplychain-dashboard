import { create } from 'zustand';
import {
  Shipment, Warehouse, Alert, KPIData, ChartDataPoint,
  FilterOptions, InventoryItem, RouteHeatmapData
} from '../types';
import {
  generateShipments, generateWarehouses, generateAlerts,
  generateKPIData, generateChartData, generateInventoryItems,
  generateRouteHeatmap
} from '../data/mockData';

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Data
  shipments: Shipment[];
  warehouses: Warehouse[];
  alerts: Alert[];
  kpiData: KPIData | null;
  chartData: {
    deliveryTrend: ChartDataPoint[];
    delayTrend: ChartDataPoint[];
    volumeTrend: ChartDataPoint[];
  } | null;
  inventoryItems: InventoryItem[];
  routeHeatmap: RouteHeatmapData[];

  // UI State
  selectedShipment: Shipment | null;
  selectedWarehouse: Warehouse | null;
  isDetailDrawerOpen: boolean;
  sidebarCollapsed: boolean;

  // Filters
  filters: FilterOptions;

  // Actions
  initializeData: () => void;
  setSelectedShipment: (shipment: Shipment | null) => void;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  setDetailDrawerOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;
  acknowledgeAlert: (alertId: string) => void;
  updateShipmentLocation: (shipmentId: string, location: { lat: number; lng: number }) => void;
  addAlert: (alert: Alert) => void;
}

const defaultFilters: FilterOptions = {
  status: [],
  priority: [],
  vehicleType: [],
  dateRange: { start: null, end: null },
  searchQuery: '',
};

export const useStore = create<AppState>((set, get) => ({
  // Theme
  darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.darkMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { darkMode: newMode };
    });
  },

  // Data
  shipments: [],
  warehouses: [],
  alerts: [],
  kpiData: null,
  chartData: null,
  inventoryItems: [],
  routeHeatmap: [],

  // UI State
  selectedShipment: null,
  selectedWarehouse: null,
  isDetailDrawerOpen: false,
  sidebarCollapsed: false,

  // Filters
  filters: defaultFilters,

  // Actions
  initializeData: () => {
    const shipments = generateShipments(500);
    const warehouses = generateWarehouses();
    const alerts = generateAlerts(shipments, warehouses);
    const kpiData = generateKPIData(shipments, warehouses);
    const chartData = generateChartData(30);
    const inventoryItems = warehouses.flatMap(w => generateInventoryItems(w.id, 50));
    const routeHeatmap = generateRouteHeatmap(shipments);

    set({
      shipments,
      warehouses,
      alerts,
      kpiData,
      chartData,
      inventoryItems,
      routeHeatmap,
    });

    // Initialize dark mode
    if (get().darkMode) {
      document.documentElement.classList.add('dark');
    }
  },

  setSelectedShipment: (shipment) => {
    set({ selectedShipment: shipment, isDetailDrawerOpen: !!shipment });
  },

  setSelectedWarehouse: (warehouse) => {
    set({ selectedWarehouse: warehouse });
  },

  setDetailDrawerOpen: (open) => {
    set({ isDetailDrawerOpen: open });
    if (!open) {
      set({ selectedShipment: null });
    }
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  updateFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  acknowledgeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  },

  updateShipmentLocation: (shipmentId, location) => {
    set((state) => ({
      shipments: state.shipments.map((shipment) =>
        shipment.id === shipmentId
          ? { ...shipment, currentLocation: location, updatedAt: new Date() }
          : shipment
      ),
    }));
  },

  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts],
    }));
  },
}));

// Selector hooks for filtered data
export const useFilteredShipments = () => {
  const { shipments, filters } = useStore();

  return shipments.filter((shipment) => {
    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(shipment.status)) {
      return false;
    }

    // Priority filter
    if (filters.priority.length > 0 && !filters.priority.includes(shipment.priority)) {
      return false;
    }

    // Vehicle type filter
    if (filters.vehicleType.length > 0 && !filters.vehicleType.includes(shipment.vehicle.type)) {
      return false;
    }

    // Date range filter
    if (filters.dateRange.start && shipment.createdAt < filters.dateRange.start) {
      return false;
    }
    if (filters.dateRange.end && shipment.createdAt > filters.dateRange.end) {
      return false;
    }

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        shipment.id.toLowerCase().includes(query) ||
        shipment.containerId.toLowerCase().includes(query) ||
        shipment.origin.city.toLowerCase().includes(query) ||
        shipment.destination.city.toLowerCase().includes(query) ||
        shipment.vehicle.driverName.toLowerCase().includes(query)
      );
    }

    return true;
  });
};

export const useUnacknowledgedAlerts = () => {
  const { alerts } = useStore();
  return alerts.filter((alert) => !alert.acknowledged);
};
