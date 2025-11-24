import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Shipment, ShipmentStatus } from '../../types';
import { useStore } from '../../store/useStore';

// Using a demo token - in production, use env variable
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface ShipmentMapProps {
  shipments: Shipment[];
  onShipmentClick?: (shipment: Shipment) => void;
  showRoutes?: boolean;
  className?: string;
}

const statusColors: Record<ShipmentStatus, string> = {
  in_transit: '#3b82f6',
  delivered: '#6b7280',
  delayed: '#ef4444',
  at_risk: '#eab308',
  pending: '#8b5cf6',
};

export function ShipmentMap({
  shipments,
  onShipmentClick,
  showRoutes = true,
  className = '',
}: ShipmentMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { darkMode, setSelectedShipment } = useStore();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: darkMode
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 1.5,
      projection: 'globe' as any,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map style on theme change
  useEffect(() => {
    if (!map.current) return;
    map.current.setStyle(
      darkMode
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/light-v11'
    );
  }, [darkMode]);

  // Add markers for shipments
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Group shipments by approximate location for clustering
    const locationGroups = new Map<string, Shipment[]>();
    shipments.forEach((shipment) => {
      const key = `${shipment.currentLocation.lat.toFixed(1)},${shipment.currentLocation.lng.toFixed(1)}`;
      if (!locationGroups.has(key)) {
        locationGroups.set(key, []);
      }
      locationGroups.get(key)!.push(shipment);
    });

    // Create markers
    locationGroups.forEach((groupShipments, _key) => {
      const shipment = groupShipments[0];
      const count = groupShipments.length;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'shipment-marker';
      el.style.cssText = `
        width: ${count > 1 ? 36 : 28}px;
        height: ${count > 1 ? 36 : 28}px;
        background-color: ${statusColors[shipment.status]};
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
      `;

      if (count > 1) {
        el.textContent = count > 99 ? '99+' : count.toString();
      }

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup
      const popupContent = `
        <div class="p-3 min-w-[200px]">
          <div class="font-semibold text-gray-900 dark:text-white mb-1">
            ${count > 1 ? `${count} Shipments` : shipment.id}
          </div>
          ${count === 1 ? `
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              ${shipment.containerId}
            </div>
            <div class="text-xs space-y-1">
              <div><span class="text-gray-500">From:</span> ${shipment.origin.city}</div>
              <div><span class="text-gray-500">To:</span> ${shipment.destination.city}</div>
              <div><span class="text-gray-500">Status:</span>
                <span class="px-1.5 py-0.5 rounded text-white text-[10px]" style="background:${statusColors[shipment.status]}">
                  ${shipment.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ` : `
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Click to view details
            </div>
          `}
        </div>
      `;

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
      }).setHTML(popupContent);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([shipment.currentLocation.lng, shipment.currentLocation.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (count === 1) {
          onShipmentClick?.(shipment);
          setSelectedShipment(shipment);
        }
      });

      markersRef.current.push(marker);
    });
  }, [shipments, mapLoaded, onShipmentClick, setSelectedShipment]);

  // Draw routes
  useEffect(() => {
    if (!map.current || !mapLoaded || !showRoutes) return;

    const addRoutes = () => {
      // Remove existing route layers
      if (map.current?.getSource('routes')) {
        map.current.removeLayer('routes-layer');
        map.current.removeSource('routes');
      }

      // Only show routes for in-transit shipments
      const inTransitShipments = shipments.filter(
        (s) => s.status === 'in_transit' || s.status === 'at_risk' || s.status === 'delayed'
      ).slice(0, 50); // Limit for performance

      const features = inTransitShipments.map((shipment) => ({
        type: 'Feature' as const,
        properties: {
          status: shipment.status,
        },
        geometry: {
          type: 'LineString' as const,
          coordinates: shipment.route.actual.map((c) => [c.lng, c.lat]),
        },
      }));

      if (features.length === 0) return;

      map.current?.addSource('routes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      map.current?.addLayer({
        id: 'routes-layer',
        type: 'line',
        source: 'routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': ['match', ['get', 'status'],
            'delayed', '#ef4444',
            'at_risk', '#eab308',
            '#3b82f6'
          ],
          'line-width': 2,
          'line-opacity': 0.6,
        },
      });
    };

    // Wait for style to load
    if (map.current.isStyleLoaded()) {
      addRoutes();
    } else {
      map.current.once('styledata', addRoutes);
    }
  }, [shipments, mapLoaded, showRoutes]);

  return (
    <div
      ref={mapContainer}
      className={`w-full h-full rounded-xl overflow-hidden ${className}`}
    />
  );
}
