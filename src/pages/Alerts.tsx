import { useState, useMemo } from 'react';
import { Layout } from '../components/layout';
import { AlertsList, AlertsStats, AlertsFilters } from '../components/alerts';
import { useStore } from '../store/useStore';
import { PageLoader } from '../components/common';
import { AlertSeverity, AlertType } from '../types';

export function Alerts() {
  const { alerts } = useStore();
  const [selectedSeverities, setSelectedSeverities] = useState<AlertSeverity[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<AlertType[]>([]);
  const [showAcknowledged, setShowAcknowledged] = useState(true);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(alert.severity)) {
        return false;
      }
      if (selectedTypes.length > 0 && !selectedTypes.includes(alert.type)) {
        return false;
      }
      if (!showAcknowledged && alert.acknowledged) {
        return false;
      }
      return true;
    });
  }, [alerts, selectedSeverities, selectedTypes, showAcknowledged]);

  const handleReset = () => {
    setSelectedSeverities([]);
    setSelectedTypes([]);
    setShowAcknowledged(true);
  };

  if (alerts.length === 0) {
    return (
      <Layout title="Alerts">
        <PageLoader />
      </Layout>
    );
  }

  return (
    <Layout title="Alerts">
      <AlertsStats alerts={alerts} />
      <AlertsFilters
        selectedSeverities={selectedSeverities}
        selectedTypes={selectedTypes}
        showAcknowledged={showAcknowledged}
        onSeverityChange={setSelectedSeverities}
        onTypeChange={setSelectedTypes}
        onShowAcknowledgedChange={setShowAcknowledged}
        onReset={handleReset}
      />
      <AlertsList alerts={filteredAlerts} />
    </Layout>
  );
}
