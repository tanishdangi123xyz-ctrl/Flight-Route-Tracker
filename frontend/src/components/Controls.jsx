export default function Controls({
  snapshots, snapshotA, snapshotB, setSnapshotA, setSnapshotB,
  onCompare, onIngest, airlineFilter, setAirlineFilter,
  airportFilter, setAirportFilter, onApplyFilter,
}) {
  return (
    <div className="bg-slate-800 text-white p-4 rounded-lg mb-4 space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <select className="text-black rounded px-2 py-1" value={snapshotA} onChange={e => setSnapshotA(e.target.value)}>
          {snapshots.map(s => <option key={s.id} value={s.id}>#{s.id} {s.source}</option>)}
        </select>
        <select className="text-black rounded px-2 py-1" value={snapshotB} onChange={e => setSnapshotB(e.target.value)}>
          {snapshots.map(s => <option key={s.id} value={s.id}>#{s.id} {s.source}</option>)}
        </select>
        <button onClick={onCompare} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Compare</button>
        <button onClick={onIngest} className="bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded">Run Ingest Now</button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          className="text-black rounded px-2 py-1"
          placeholder="Airline code (e.g. 6E)"
          value={airlineFilter}
          onChange={e => setAirlineFilter(e.target.value)}
        />
        <input
          className="text-black rounded px-2 py-1"
          placeholder="Airport IATA (e.g. BOM)"
          value={airportFilter}
          onChange={e => setAirportFilter(e.target.value)}
        />
        <button onClick={onApplyFilter} className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded">Apply</button>
      </div>
    </div>
  );
}
