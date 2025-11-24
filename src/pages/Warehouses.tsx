import { useState } from 'react';
import { Layout } from '../components/layout';
import {
  WarehouseCard,
  InventoryChart,
  InventoryTable,
  StockForecast,
} from '../components/warehouse';
import { useStore } from '../store/useStore';
import { PageLoader } from '../components/common';
import { Warehouse } from '../types';

export function Warehouses() {
  const { warehouses, inventoryItems } = useStore();
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  if (warehouses.length === 0) {
    return (
      <Layout title="Warehouses">
        <PageLoader />
      </Layout>
    );
  }

  const activeWarehouse = selectedWarehouse || warehouses[0];
  const warehouseInventory = inventoryItems.filter(
    (item) => item.warehouseId === activeWarehouse.id
  );

  return (
    <Layout title="Warehouses">
      {/* Warehouse Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {warehouses.map((warehouse) => (
          <WarehouseCard
            key={warehouse.id}
            warehouse={warehouse}
            onClick={() => setSelectedWarehouse(warehouse)}
            isSelected={activeWarehouse.id === warehouse.id}
          />
        ))}
      </div>

      {/* Selected Warehouse Details */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {activeWarehouse.name} - Detailed View
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <InventoryChart categories={activeWarehouse.categories} />
          <StockForecast items={warehouseInventory} />
        </div>

        <InventoryTable items={warehouseInventory} />
      </div>
    </Layout>
  );
}
