export type ShipmentStatus = 'in_transit' | 'delivered' | 'delayed' | 'at_risk' | 'pending';
export type VehicleType = 'truck' | 'ship' | 'plane' | 'train';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 'weather' | 'customs' | 'late_pickup' | 'carrier_delay' | 'warehouse_congestion' | 'route_deviation' | 'low_stock';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  name: string;
  city: string;
  country: string;
  coordinates: Coordinates;
}

export interface Vehicle {
  id: string;
  type: VehicleType;
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  capacity: number;
  currentLoad: number;
}

export interface SensorData {
  temperature: number;
  humidity: number;
  doorOpen: boolean;
  timestamp: Date;
}

export interface ShipmentEvent {
  id: string;
  type: 'created' | 'loaded' | 'departed' | 'checkpoint' | 'delay' | 'arrived' | 'delivered';
  description: string;
  timestamp: Date;
  location?: Location;
}

export interface Shipment {
  id: string;
  containerId: string;
  origin: Location;
  destination: Location;
  currentLocation: Coordinates;
  status: ShipmentStatus;
  priority: 'high' | 'medium' | 'low';
  eta: Date;
  originalEta: Date;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  route: {
    planned: Coordinates[];
    actual: Coordinates[];
  };
  sensorData: SensorData[];
  events: ShipmentEvent[];
  delayReason?: string;
  cargoDescription: string;
  weight: number;
  value: number;
}

export interface Warehouse {
  id: string;
  name: string;
  location: Location;
  capacity: number;
  currentStock: number;
  utilization: number;
  categories: WarehouseCategory[];
  inboundToday: number;
  outboundToday: number;
  alerts: number;
}

export interface WarehouseCategory {
  name: string;
  stock: number;
  capacity: number;
  lowStockThreshold: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  warehouseId: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  lastUpdated: Date;
  forecastedDemand: number[];
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  shipmentId?: string;
  warehouseId?: string;
  location?: Location;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface KPIData {
  shipmentsInTransit: number;
  shipmentsInTransitChange: number;
  delayedShipments: number;
  delayedShipmentsChange: number;
  warehouseUtilization: number;
  warehouseUtilizationChange: number;
  activeVehicles: number;
  activeVehiclesChange: number;
  onTimeDeliveryRate: number;
  avgDeliveryTime: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface RouteHeatmapData {
  id: string;
  from: Coordinates;
  to: Coordinates;
  intensity: number;
  shipmentCount: number;
}

export interface FilterOptions {
  status: ShipmentStatus[];
  priority: ('high' | 'medium' | 'low')[];
  vehicleType: VehicleType[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  regions: string[];
}
