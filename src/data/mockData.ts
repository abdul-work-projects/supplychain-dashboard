import {
  Shipment, Warehouse, Alert, KPIData, ChartDataPoint,
  ShipmentStatus, VehicleType, AlertType, AlertSeverity,
  Location, Coordinates, InventoryItem, RouteHeatmapData
} from '../types';

// Major logistics hubs around the world
const locations: Location[] = [
  { name: 'Port of Shanghai', city: 'Shanghai', country: 'China', coordinates: { lat: 31.2304, lng: 121.4737 } },
  { name: 'Port of Singapore', city: 'Singapore', country: 'Singapore', coordinates: { lat: 1.2644, lng: 103.8200 } },
  { name: 'Port of Rotterdam', city: 'Rotterdam', country: 'Netherlands', coordinates: { lat: 51.9025, lng: 4.4790 } },
  { name: 'Port of Los Angeles', city: 'Los Angeles', country: 'USA', coordinates: { lat: 33.7405, lng: -118.2793 } },
  { name: 'Port of Hamburg', city: 'Hamburg', country: 'Germany', coordinates: { lat: 53.5461, lng: 9.9660 } },
  { name: 'Port of Busan', city: 'Busan', country: 'South Korea', coordinates: { lat: 35.0950, lng: 129.0095 } },
  { name: 'Port of Dubai', city: 'Dubai', country: 'UAE', coordinates: { lat: 25.2697, lng: 55.3095 } },
  { name: 'Port of Hong Kong', city: 'Hong Kong', country: 'China', coordinates: { lat: 22.2855, lng: 114.1577 } },
  { name: 'Port of New York', city: 'New York', country: 'USA', coordinates: { lat: 40.6892, lng: -74.0445 } },
  { name: 'Port of Antwerp', city: 'Antwerp', country: 'Belgium', coordinates: { lat: 51.2630, lng: 4.3947 } },
  { name: 'Chicago Distribution Center', city: 'Chicago', country: 'USA', coordinates: { lat: 41.8781, lng: -87.6298 } },
  { name: 'Frankfurt Logistics Hub', city: 'Frankfurt', country: 'Germany', coordinates: { lat: 50.1109, lng: 8.6821 } },
  { name: 'Tokyo Distribution Center', city: 'Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lng: 139.6503 } },
  { name: 'Mumbai Port', city: 'Mumbai', country: 'India', coordinates: { lat: 18.9388, lng: 72.8354 } },
  { name: 'Sydney Distribution Hub', city: 'Sydney', country: 'Australia', coordinates: { lat: -33.8688, lng: 151.2093 } },
];

const cargoDescriptions = [
  'Electronics - Consumer Goods',
  'Automotive Parts',
  'Pharmaceutical Products',
  'Textile & Apparel',
  'Industrial Machinery',
  'Food & Beverages',
  'Chemical Products',
  'Raw Materials',
  'Furniture & Home Goods',
  'Medical Equipment',
];

const driverNames = [
  'John Smith', 'Maria Garcia', 'Wei Chen', 'Ahmed Hassan',
  'Hans Mueller', 'Kim Park', 'James Wilson', 'Elena Petrova',
  'Raj Patel', 'Carlos Rodriguez', 'Yuki Tanaka', 'Michael Brown'
];

const delayReasons = [
  'Weather conditions',
  'Port congestion',
  'Customs clearance delay',
  'Vehicle maintenance',
  'Driver rest required',
  'Route deviation',
  'Documentation issues',
  'Border crossing delay',
];

function randomId(): string {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateRoute(from: Coordinates, to: Coordinates, points: number = 10): Coordinates[] {
  const route: Coordinates[] = [from];
  for (let i = 1; i < points - 1; i++) {
    const progress = i / (points - 1);
    const lat = from.lat + (to.lat - from.lat) * progress + randomFloat(-2, 2);
    const lng = from.lng + (to.lng - from.lng) * progress + randomFloat(-2, 2);
    route.push({ lat, lng });
  }
  route.push(to);
  return route;
}

function generateSensorData(count: number): { temperature: number; humidity: number; doorOpen: boolean; timestamp: Date }[] {
  const data = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    data.push({
      temperature: randomFloat(-5, 25),
      humidity: randomFloat(30, 80),
      doorOpen: Math.random() > 0.95,
      timestamp: new Date(now.getTime() - (count - i) * 3600000),
    });
  }
  return data;
}

function generateEvents(status: ShipmentStatus, createdAt: Date): { id: string; type: 'created' | 'loaded' | 'departed' | 'checkpoint' | 'delay' | 'arrived' | 'delivered'; description: string; timestamp: Date; location?: Location }[] {
  const events: { id: string; type: 'created' | 'loaded' | 'departed' | 'checkpoint' | 'delay' | 'arrived' | 'delivered'; description: string; timestamp: Date; location?: Location }[] = [
    { id: randomId(), type: 'created', description: 'Shipment created', timestamp: createdAt },
    { id: randomId(), type: 'loaded', description: 'Cargo loaded onto vehicle', timestamp: new Date(createdAt.getTime() + 7200000) },
    { id: randomId(), type: 'departed', description: 'Departed from origin', timestamp: new Date(createdAt.getTime() + 10800000) },
  ];

  if (status === 'in_transit' || status === 'delayed' || status === 'at_risk') {
    events.push({
      id: randomId(),
      type: 'checkpoint',
      description: 'Passed checkpoint',
      timestamp: new Date(createdAt.getTime() + 86400000),
      location: randomFromArray(locations),
    });
  }

  if (status === 'delayed') {
    events.push({
      id: randomId(),
      type: 'delay',
      description: randomFromArray(delayReasons),
      timestamp: new Date(createdAt.getTime() + 172800000),
    });
  }

  if (status === 'delivered') {
    events.push(
      { id: randomId(), type: 'arrived', description: 'Arrived at destination', timestamp: new Date(createdAt.getTime() + 259200000) },
      { id: randomId(), type: 'delivered', description: 'Cargo delivered', timestamp: new Date(createdAt.getTime() + 266400000) }
    );
  }

  return events;
}

export function generateShipments(count: number): Shipment[] {
  const shipments: Shipment[] = [];
  const statuses: ShipmentStatus[] = ['in_transit', 'in_transit', 'in_transit', 'delivered', 'delayed', 'at_risk', 'pending'];
  const vehicleTypes: VehicleType[] = ['truck', 'ship', 'plane', 'train'];
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'medium', 'low'];

  for (let i = 0; i < count; i++) {
    const origin = randomFromArray(locations);
    let destination = randomFromArray(locations);
    while (destination.name === origin.name) {
      destination = randomFromArray(locations);
    }

    const status = randomFromArray(statuses);
    const createdAt = new Date(Date.now() - randomBetween(1, 30) * 86400000);
    const originalEta = new Date(createdAt.getTime() + randomBetween(3, 14) * 86400000);
    const eta = status === 'delayed'
      ? new Date(originalEta.getTime() + randomBetween(1, 5) * 86400000)
      : originalEta;

    const plannedRoute = generateRoute(origin.coordinates, destination.coordinates);
    const progress = status === 'delivered' ? 1 : status === 'pending' ? 0 : randomFloat(0.1, 0.9);
    const currentIndex = Math.floor(progress * (plannedRoute.length - 1));
    const currentLocation = plannedRoute[currentIndex];
    const actualRoute = plannedRoute.slice(0, currentIndex + 1);

    const vehicleType = randomFromArray(vehicleTypes);
    const capacity = vehicleType === 'ship' ? randomBetween(10000, 50000) :
                     vehicleType === 'plane' ? randomBetween(50, 150) :
                     vehicleType === 'train' ? randomBetween(2000, 8000) : randomBetween(20, 40);

    shipments.push({
      id: `SHP-${randomId()}`,
      containerId: `CNT-${randomId()}`,
      origin,
      destination,
      currentLocation,
      status,
      priority: randomFromArray(priorities),
      eta,
      originalEta,
      createdAt,
      updatedAt: new Date(),
      vehicle: {
        id: `VH-${randomId()}`,
        type: vehicleType,
        licensePlate: `${randomId().substring(0, 3)}-${randomBetween(100, 999)}`,
        driverName: randomFromArray(driverNames),
        driverPhone: `+1-${randomBetween(200, 999)}-${randomBetween(100, 999)}-${randomBetween(1000, 9999)}`,
        capacity,
        currentLoad: randomBetween(Math.floor(capacity * 0.5), capacity),
      },
      route: {
        planned: plannedRoute,
        actual: actualRoute,
      },
      sensorData: generateSensorData(24),
      events: generateEvents(status, createdAt),
      delayReason: status === 'delayed' ? randomFromArray(delayReasons) : undefined,
      cargoDescription: randomFromArray(cargoDescriptions),
      weight: randomBetween(1000, 50000),
      value: randomBetween(10000, 5000000),
    });
  }

  return shipments;
}

export function generateWarehouses(): Warehouse[] {
  const warehouseLocations = locations.slice(0, 8);
  const categories = ['Electronics', 'Automotive', 'Consumer Goods', 'Raw Materials', 'Perishables'];

  return warehouseLocations.map((loc) => {
    const capacity = randomBetween(50000, 200000);
    const currentStock = randomBetween(Math.floor(capacity * 0.3), Math.floor(capacity * 0.95));

    return {
      id: `WH-${randomId()}`,
      name: `${loc.city} Warehouse`,
      location: loc,
      capacity,
      currentStock,
      utilization: parseFloat(((currentStock / capacity) * 100).toFixed(1)),
      categories: categories.map(cat => {
        const catCapacity = Math.floor(capacity / categories.length);
        const stock = randomBetween(Math.floor(catCapacity * 0.2), catCapacity);
        return {
          name: cat,
          stock,
          capacity: catCapacity,
          lowStockThreshold: Math.floor(catCapacity * 0.2),
        };
      }),
      inboundToday: randomBetween(50, 500),
      outboundToday: randomBetween(50, 500),
      alerts: randomBetween(0, 5),
    };
  });
}

export function generateInventoryItems(warehouseId: string, count: number): InventoryItem[] {
  const skuPrefixes = ['ELC', 'AUT', 'CON', 'RAW', 'PER'];
  const productNames = [
    'Laptop Computers', 'Smartphone Units', 'Car Batteries', 'Engine Parts',
    'Furniture Sets', 'Kitchen Appliances', 'Steel Coils', 'Plastic Pellets',
    'Fresh Produce', 'Dairy Products', 'Clothing Items', 'Footwear'
  ];

  return Array.from({ length: count }, () => {
    const quantity = randomBetween(100, 10000);
    const reserved = randomBetween(0, Math.floor(quantity * 0.3));
    return {
      id: `INV-${randomId()}`,
      sku: `${randomFromArray(skuPrefixes)}-${randomBetween(10000, 99999)}`,
      name: randomFromArray(productNames),
      category: randomFromArray(['Electronics', 'Automotive', 'Consumer Goods', 'Raw Materials', 'Perishables']),
      warehouseId,
      quantity,
      reserved,
      available: quantity - reserved,
      reorderPoint: randomBetween(50, 500),
      lastUpdated: new Date(Date.now() - randomBetween(0, 86400000)),
      forecastedDemand: Array.from({ length: 7 }, () => randomBetween(50, 500)),
    };
  });
}

export function generateAlerts(shipments: Shipment[], warehouses: Warehouse[]): Alert[] {
  const alerts: Alert[] = [];
  const alertTypes: AlertType[] = ['weather', 'customs', 'late_pickup', 'carrier_delay', 'warehouse_congestion', 'route_deviation', 'low_stock'];
  const severities: AlertSeverity[] = ['critical', 'warning', 'info'];

  const alertMessages: Record<AlertType, { title: string; messages: string[] }> = {
    weather: {
      title: 'Weather Alert',
      messages: ['Severe storm warning in transit area', 'Heavy fog causing visibility issues', 'Hurricane approaching shipping route'],
    },
    customs: {
      title: 'Customs Hold',
      messages: ['Documentation review required', 'Random inspection selected', 'Import permit verification needed'],
    },
    late_pickup: {
      title: 'Late Pickup',
      messages: ['Pickup delayed by 2 hours', 'Vehicle arrived late at origin', 'Loading dock congestion'],
    },
    carrier_delay: {
      title: 'Carrier Delay',
      messages: ['Vehicle breakdown reported', 'Driver rest period extended', 'Route congestion detected'],
    },
    warehouse_congestion: {
      title: 'Warehouse Congestion',
      messages: ['Receiving dock at capacity', 'Storage space limited', 'Processing backlog detected'],
    },
    route_deviation: {
      title: 'Route Deviation',
      messages: ['Vehicle off planned route', 'Alternative route taken due to road closure', 'GPS signal lost temporarily'],
    },
    low_stock: {
      title: 'Low Stock Alert',
      messages: ['Inventory below reorder point', 'Stock critically low', 'Replenishment needed urgently'],
    },
  };

  // Generate alerts for delayed shipments
  shipments
    .filter(s => s.status === 'delayed' || s.status === 'at_risk')
    .slice(0, 20)
    .forEach(shipment => {
      const type = randomFromArray(['weather', 'customs', 'carrier_delay', 'route_deviation'] as AlertType[]);
      const severity = shipment.status === 'delayed' ? 'critical' : 'warning';
      alerts.push({
        id: `ALT-${randomId()}`,
        type,
        severity,
        title: alertMessages[type].title,
        message: randomFromArray(alertMessages[type].messages),
        shipmentId: shipment.id,
        location: shipment.origin,
        timestamp: new Date(Date.now() - randomBetween(0, 86400000)),
        acknowledged: Math.random() > 0.7,
      });
    });

  // Generate warehouse alerts
  warehouses
    .filter(w => w.utilization > 85 || w.alerts > 0)
    .forEach(warehouse => {
      const type = warehouse.utilization > 85 ? 'warehouse_congestion' : 'low_stock';
      alerts.push({
        id: `ALT-${randomId()}`,
        type,
        severity: warehouse.utilization > 90 ? 'critical' : 'warning',
        title: alertMessages[type].title,
        message: randomFromArray(alertMessages[type].messages),
        warehouseId: warehouse.id,
        location: warehouse.location,
        timestamp: new Date(Date.now() - randomBetween(0, 43200000)),
        acknowledged: false,
      });
    });

  // Add some random info alerts
  for (let i = 0; i < 5; i++) {
    const type = randomFromArray(alertTypes);
    alerts.push({
      id: `ALT-${randomId()}`,
      type,
      severity: 'info',
      title: alertMessages[type].title,
      message: randomFromArray(alertMessages[type].messages),
      timestamp: new Date(Date.now() - randomBetween(0, 172800000)),
      acknowledged: true,
    });
  }

  return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateKPIData(shipments: Shipment[], warehouses: Warehouse[]): KPIData {
  const inTransit = shipments.filter(s => s.status === 'in_transit').length;
  const delayed = shipments.filter(s => s.status === 'delayed').length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const avgUtilization = warehouses.reduce((sum, w) => sum + w.utilization, 0) / warehouses.length;
  const activeVehicles = new Set(shipments.filter(s => s.status === 'in_transit').map(s => s.vehicle.id)).size;

  return {
    shipmentsInTransit: inTransit,
    shipmentsInTransitChange: randomFloat(-5, 15),
    delayedShipments: delayed,
    delayedShipmentsChange: randomFloat(-20, 10),
    warehouseUtilization: parseFloat(avgUtilization.toFixed(1)),
    warehouseUtilizationChange: randomFloat(-3, 5),
    activeVehicles,
    activeVehiclesChange: randomFloat(-2, 8),
    onTimeDeliveryRate: parseFloat(((delivered / (delivered + delayed)) * 100).toFixed(1)) || 85,
    avgDeliveryTime: randomFloat(3.5, 7.5),
  };
}

export function generateChartData(days: number = 30): {
  deliveryTrend: ChartDataPoint[];
  delayTrend: ChartDataPoint[];
  volumeTrend: ChartDataPoint[];
} {
  const deliveryTrend: ChartDataPoint[] = [];
  const delayTrend: ChartDataPoint[] = [];
  const volumeTrend: ChartDataPoint[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    deliveryTrend.push({ date: dateStr, value: randomBetween(85, 98), label: 'On-time %' });
    delayTrend.push({ date: dateStr, value: randomBetween(5, 25), label: 'Delays' });
    volumeTrend.push({ date: dateStr, value: randomBetween(500, 1500), label: 'Shipments' });
  }

  return { deliveryTrend, delayTrend, volumeTrend };
}

export function generateRouteHeatmap(shipments: Shipment[]): RouteHeatmapData[] {
  const routeMap = new Map<string, RouteHeatmapData>();

  shipments.forEach(shipment => {
    const key = `${shipment.origin.name}-${shipment.destination.name}`;
    if (routeMap.has(key)) {
      const existing = routeMap.get(key)!;
      existing.shipmentCount++;
      existing.intensity = Math.min(existing.intensity + 0.1, 1);
    } else {
      routeMap.set(key, {
        id: key,
        from: shipment.origin.coordinates,
        to: shipment.destination.coordinates,
        intensity: 0.3,
        shipmentCount: 1,
      });
    }
  });

  return Array.from(routeMap.values());
}
