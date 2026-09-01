import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
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
  const [isIngesting, setIsIngesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
    (async () => {
      const data = await loadSnapshots();
      if (data.length) await loadRoutes(data[0].id);
      setIsLoading(false);
    })();
  }, []);

  const handleIngest = async () => {
    setIsIngesting(true);
    try {
      await fetch(`${API}/api/ingest`, { method: 'POST' });
      await loadSnapshots();
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row lg:overflow-hidden">
      <Sidebar
        snapshots={snapshots}
        snapshotA={snapshotA} snapshotB={snapshotB}
        setSnapshotA={setSnapshotA} setSnapshotB={setSnapshotB}
        onCompare={() => { loadChanges(snapshotA, snapshotB); loadRoutes(snapshotB); }}
        onIngest={handleIngest}
        isIngesting={isIngesting}
        airlineFilter={airlineFilter} setAirlineFilter={setAirlineFilter}
        airportFilter={airportFilter} setAirportFilter={setAirportFilter}
        onApplyFilter={() => loadRoutes(snapshotB, airlineFilter, airportFilter)}
        routeCount={routes.length}
        changeCount={changes.length}
      />

      <main className="flex-1 lg:h-screen lg:overflow-y-auto">
        <div className="p-6 animate-enter">
          <MapView routes={routes} isLoading={isLoading} />
        </div>

        <div className="px-6 pb-8 animate-enter" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-fog">Detected changes</h2>
            {snapshotA && snapshotB && (
              <span className="text-xs font-mono text-fog">#{snapshotA} → #{snapshotB}</span>
            )}
          </div>
          <ChangesTable changes={changes} />
        </div>
      </main>
    </div>
  );
}