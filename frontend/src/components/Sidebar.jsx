import RadarPulse from './RadarPulse';
import FlapNumber from './FlapNumber';
import Legend from './Legend';

export default function Sidebar({
  snapshots, snapshotA, snapshotB, setSnapshotA, setSnapshotB,
  onCompare, onIngest, isIngesting,
  airlineFilter, setAirlineFilter, airportFilter, setAirportFilter, onApplyFilter,
  routeCount, changeCount,
}) {
  return (
    <aside className="w-full lg:w-[380px] flex-shrink-0 bg-panel/60 border-b lg:border-b-0 lg:border-r border-panelLine flex flex-col lg:h-screen lg:overflow-y-auto">
      <div className="p-6 border-b border-panelLine flex items-center gap-3 animate-enter">
        <RadarPulse />
        <h1 className="text-lg font-semibold tracking-tight leading-tight">
          Flight Route<br />Change Tracker
        </h1>
      </div>

      <div className="p-6 border-b border-panelLine grid grid-cols-2 gap-4 animate-enter" style={{ animationDelay: '0.05s' }}>
        <div>
          <p className="text-[10px] text-fog font-mono uppercase tracking-wider mb-1.5">Routes</p>
          <FlapNumber value={routeCount} digits={4} />
        </div>
        <div>
          <p className="text-[10px] text-fog font-mono uppercase tracking-wider mb-1.5">Snapshots</p>
          <FlapNumber value={snapshots.length} digits={2} />
        </div>
        <div className="col-span-2">
          <p className="text-[10px] text-fog font-mono uppercase tracking-wider mb-1.5">Changes detected</p>
          <FlapNumber value={changeCount} digits={3} />
        </div>
      </div>

      <div className="p-6 border-b border-panelLine space-y-3 animate-enter" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs uppercase tracking-[0.2em] text-fog font-mono">Compare snapshots</p>
        <select
          className="select-clean w-full bg-ink border border-panelLine text-paper rounded px-3 py-2 font-mono text-sm focus:border-scope outline-none"
          value={snapshotA} onChange={e => setSnapshotA(e.target.value)}
        >
          {snapshots.map(s => <option key={s.id} value={s.id}>#{s.id} · {s.source}</option>)}
        </select>
        <div className="text-center text-fog text-xs font-mono">↓ against ↓</div>
        <select
          className="select-clean w-full bg-ink border border-panelLine text-paper rounded px-3 py-2 font-mono text-sm focus:border-scope outline-none"
          value={snapshotB} onChange={e => setSnapshotB(e.target.value)}
        >
          {snapshots.map(s => <option key={s.id} value={s.id}>#{s.id} · {s.source}</option>)}
        </select>
        <button
          onClick={onCompare}
          className="w-full bg-scope/10 border border-scope/40 text-scope hover:bg-scope/20 hover:shadow-glow transition-all px-4 py-2.5 rounded font-medium text-sm"
        >
          Compare
        </button>
      </div>

      <div className="p-6 border-b border-panelLine space-y-3 animate-enter" style={{ animationDelay: '0.15s' }}>
        <p className="text-xs uppercase tracking-[0.2em] text-fog font-mono">Filter routes</p>
        <input
          className="w-full bg-ink border border-panelLine text-paper placeholder-fog/50 rounded px-3 py-2 font-mono text-sm focus:border-scope outline-none"
          placeholder="Airline — 6E" value={airlineFilter} onChange={e => setAirlineFilter(e.target.value)}
        />
        <input
          className="w-full bg-ink border border-panelLine text-paper placeholder-fog/50 rounded px-3 py-2 font-mono text-sm focus:border-scope outline-none"
          placeholder="Airport — BOM" value={airportFilter} onChange={e => setAirportFilter(e.target.value)}
        />
        <button
          onClick={onApplyFilter}
          className="w-full bg-panelLine text-paper hover:bg-panelLine/70 transition-colors px-4 py-2.5 rounded font-medium text-sm"
        >
          Apply filter
        </button>
      </div>

      <div className="p-6 border-b border-panelLine space-y-3 animate-enter" style={{ animationDelay: '0.2s' }}>
        <p className="text-xs uppercase tracking-[0.2em] text-fog font-mono">Legend</p>
        <Legend />
      </div>

      <div className="p-6 lg:mt-auto animate-enter" style={{ animationDelay: '0.25s' }}>
        <button
          onClick={onIngest}
          disabled={isIngesting}
          className="w-full bg-amber/10 border border-amber/40 text-amber hover:bg-amber/20 hover:shadow-glowAmber transition-all px-4 py-2.5 rounded font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isIngesting && <span className="w-3 h-3 border-2 border-amber/40 border-t-amber rounded-full animate-spin" />}
          {isIngesting ? 'Pulling latest data…' : 'Refresh data'}
        </button>
      </div>
    </aside>
  );
}