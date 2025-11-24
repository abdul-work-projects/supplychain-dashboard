import { Layout } from '../components/layout';
import { ShipmentsTable, ShipmentsFilters } from '../components/shipments';
import { useFilteredShipments, useStore } from '../store/useStore';
import { PageLoader } from '../components/common';

export function Shipments() {
  const { shipments } = useStore();
  const filteredShipments = useFilteredShipments();

  if (shipments.length === 0) {
    return (
      <Layout title="Shipments">
        <PageLoader />
      </Layout>
    );
  }

  return (
    <Layout title="Shipments">
      <ShipmentsFilters />
      <ShipmentsTable shipments={filteredShipments} />
    </Layout>
  );
}
