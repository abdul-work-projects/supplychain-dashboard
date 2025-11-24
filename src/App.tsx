import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard, Shipments, MapView, Warehouses, Alerts, Settings } from './pages';
import { ShipmentDetailDrawer } from './components/shipments';
import { useStore } from './store/useStore';
import { useRealTimeUpdates } from './hooks';

function App() {
  const { initializeData } = useStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Enable real-time updates simulation
  useRealTimeUpdates(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/shipments" element={<Shipments />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      {/* Global Detail Drawer */}
      <ShipmentDetailDrawer />
    </Router>
  );
}

export default App;
