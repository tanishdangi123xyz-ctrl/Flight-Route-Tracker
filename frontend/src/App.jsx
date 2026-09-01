import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import Controls from './components/Controls';
import ChangesTable from './components/ChangesTable';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotA, setSnapshotA] = useState('');
  const [snapshotB, setSnapshotB] = useState('');
  const [routes, setRoutes] = useState([]);
  const [changes, setChanges] = useState([]);
  const [airlineFilter, setAirlineFilter] = useState('');
  const [airportFilter, setAirportFilter] = useState('');

  const loadSnapshots = async () => {
    const res = await fetch(`${API}/api/snapshots`);
    const data = await res.json();
    setSnapshots(data);
    if (data.length > 1) {
      setSnapshotA(data[1].id);
      setSnapshotB(data[0].id);
    }
    return data;
  };

  const loadRoutes = async (snapshotId, airline = '', airport = '') => {
    const params = new URLSearchParams();
    if (snapshotId) params.set('snapshot_id', snapshotId);
    if (airline) params.set('airline', airline);
    if (airport) params.set('airport', airport);
    const res = await fetch(`${API}/api/routes?${params}`);
    setRoutes(await res.json());
  };

  const loadChanges = async (fromId, toId) => {
    const res = await fetch(`${API}/api/changes?from_id=${fromId}&to_id=${toId}`);
    setChanges(await res.json());
  };

  useEffect(() => {
    loadSnapshots().then(data => data.length && loadRoutes(data[0].id));
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Flight Route Change Tracker</h1>
      <Controls
        snapshots={snapshots}
        snapshotA={snapshotA} snapshotB={snapshotB}
        setSnapshotA={setSnapshotA} setSnapshotB={setSnapshotB}
        onCompare={() => { loadChanges(snapshotA, snapshotB); loadRoutes(snapshotB); }}
        onIngest={async () => { await fetch(`${API}/api/ingest`, { method: 'POST' }); await loadSnapshots(); }}
        airlineFilter={airlineFilter} setAirlineFilter={setAirlineFilter}
        airportFilter={airportFilter} setAirportFilter={setAirportFilter}
        onApplyFilter={() => loadRoutes(snapshotB, airlineFilter, airportFilter)}
      />
      <MapView routes={routes} />
      <h2 className="text-xl font-semibold mt-6 mb-2">Detected Changes</h2>
      <ChangesTable changes={changes} />
    </div>
  );
}
