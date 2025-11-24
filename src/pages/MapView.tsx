import { Layout } from '../components/layout';
import { ShipmentMap, MapFilters, MapLegend, MapStats } from '../components/map';
import { useStore, useFilteredShipments } from '../store/useStore';
import { PageLoader } from '../components/common';

export function MapView() {
  const { shipments } = useStore();
  const filteredShipments = useFilteredShipments();

  if (shipments.length === 0) {
    return (
      <Layout title="Map View">
        <PageLoader />
      </Layout>
    );
  }

  return (
    <Layout title="Map View">
      {/* Stats Bar */}
      <div className="mb-4">
        <MapStats shipments={filteredShipments} />
      </div>

      {/* Map Container */}
      <div className="relative">
        {/* Filters */}
        <div className="absolute top-4 left-4 z-10">
          <MapFilters />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10">
          <MapLegend />
        </div>

        {/* Shipment count */}
        <div className="absolute top-4 right-4 z-10 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border px-4 py-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredShipments.length}
            </span>{' '}
            shipments
          </span>
        </div>

        {/* Map */}
        <div className="card h-[calc(100vh-280px)] min-h-[500px]">
          <ShipmentMap
            shipments={filteredShipments}
            showRoutes={true}
            className="w-full h-full"
          />
        </div>
      </div>
    </Layout>
  );
}
