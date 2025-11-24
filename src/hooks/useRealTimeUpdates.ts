import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Alert, AlertType, AlertSeverity } from '../types';

function randomId(): string {
  return Math.random().toString(36).substring(2, 11).toUpperCase();
}

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const alertMessages: Record<AlertType, { title: string; messages: string[] }> = {
  weather: {
    title: 'Weather Alert',
    messages: [
      'Severe storm warning in transit area',
      'Heavy fog causing visibility issues',
      'Hurricane approaching shipping route',
    ],
  },
  customs: {
    title: 'Customs Hold',
    messages: [
      'Documentation review required',
      'Random inspection selected',
      'Import permit verification needed',
    ],
  },
  late_pickup: {
    title: 'Late Pickup',
    messages: [
      'Pickup delayed by 2 hours',
      'Vehicle arrived late at origin',
      'Loading dock congestion',
    ],
  },
  carrier_delay: {
    title: 'Carrier Delay',
    messages: [
      'Vehicle breakdown reported',
      'Driver rest period extended',
      'Route congestion detected',
    ],
  },
  warehouse_congestion: {
    title: 'Warehouse Congestion',
    messages: [
      'Receiving dock at capacity',
      'Storage space limited',
      'Processing backlog detected',
    ],
  },
  route_deviation: {
    title: 'Route Deviation',
    messages: [
      'Vehicle off planned route',
      'Alternative route taken due to road closure',
      'GPS signal lost temporarily',
    ],
  },
  low_stock: {
    title: 'Low Stock Alert',
    messages: [
      'Inventory below reorder point',
      'Stock critically low',
      'Replenishment needed urgently',
    ],
  },
};

export function useRealTimeUpdates(enabled: boolean = true) {
  const { shipments, updateShipmentLocation, addAlert } = useStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alertIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || shipments.length === 0) return;

    // Simulate location updates every 3 seconds
    intervalRef.current = setInterval(() => {
      const inTransitShipments = shipments.filter(
        (s) => s.status === 'in_transit' || s.status === 'at_risk'
      );

      if (inTransitShipments.length === 0) return;

      // Update 1-3 random shipments
      const updateCount = randomBetween(1, 3);
      for (let i = 0; i < updateCount; i++) {
        const shipment = randomFromArray(inTransitShipments);
        const currentLat = shipment.currentLocation.lat;
        const currentLng = shipment.currentLocation.lng;

        // Move slightly towards destination
        const destLat = shipment.destination.coordinates.lat;
        const destLng = shipment.destination.coordinates.lng;

        const newLat = currentLat + (destLat - currentLat) * 0.01 + (Math.random() - 0.5) * 0.1;
        const newLng = currentLng + (destLng - currentLng) * 0.01 + (Math.random() - 0.5) * 0.1;

        updateShipmentLocation(shipment.id, { lat: newLat, lng: newLng });
      }
    }, 3000);

    // Simulate new alerts every 30-60 seconds
    alertIntervalRef.current = setInterval(() => {
      if (Math.random() > 0.5) return; // 50% chance of new alert

      const alertTypes: AlertType[] = [
        'weather',
        'customs',
        'late_pickup',
        'carrier_delay',
        'route_deviation',
      ];
      const type = randomFromArray(alertTypes);
      const severities: AlertSeverity[] = ['critical', 'warning', 'info'];
      const severity = randomFromArray(severities);

      const randomShipment = randomFromArray(shipments);

      const newAlert: Alert = {
        id: `ALT-${randomId()}`,
        type,
        severity,
        title: alertMessages[type].title,
        message: randomFromArray(alertMessages[type].messages),
        shipmentId: randomShipment.id,
        location: randomShipment.origin,
        timestamp: new Date(),
        acknowledged: false,
      };

      addAlert(newAlert);
    }, randomBetween(30000, 60000));

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (alertIntervalRef.current) {
        clearInterval(alertIntervalRef.current);
      }
    };
  }, [enabled, shipments, updateShipmentLocation, addAlert]);
}
