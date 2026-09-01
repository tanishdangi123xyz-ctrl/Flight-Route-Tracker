import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

const AIRLINE_COLORS = { '6E': '#5EEAD4', 'AI': '#F0A93A', 'SG': '#C084FC' };
const colorFor = (code) => AIRLINE_COLORS[code] || '#8593A8';

export default function MapView({ routes, isLoading }) {
  const visible = routes.filter(r => r.origin_lat && r.dest_lat);

  return (
    <div className="relative rounded-lg overflow-hidden border border-panelLine h-[65vh] min-h-[420px]">
      {isLoading && (
        <div className="absolute inset-0 z-[1000] bg-ink flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border-2 border-scope/20 border-t-scope animate-spin" />
            <p className="text-fog font-mono text-xs uppercase tracking-wider">Acquiring signal…</p>
          </div>
        </div>
      )}

      {!isLoading && visible.length === 0 && (
        <div className="absolute inset-0 z-[900] bg-ink/90 flex items-center justify-center pointer-events-none">
          <p className="text-fog font-mono text-sm">No routes match this filter.</p>
        </div>
      )}

      <div className="absolute top-3 right-3 z-[500] bg-panel/80 backdrop-blur border border-panelLine rounded px-3 py-1.5 pointer-events-none">
        <p className="text-[10px] font-mono text-scope tracking-wider">{visible.length} ROUTES ON SCOPE</p>
      </div>

      <MapContainer center={[20, 78]} zoom={4} className="h-full w-full" style={{ background: '#0A0E14' }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {visible.map((r, i) => {
          const color = colorFor(r.airline);
          return (
            <Polyline
              key={i}
              positions={[[r.origin_lat, r.origin_lon], [r.dest_lat, r.dest_lon]]}
              pathOptions={{ color, weight: 1.4, opacity: 0.6 }}
              eventHandlers={{
                mouseover: (e) => { e.target.setStyle({ weight: 3, opacity: 1 }); e.target.bringToFront(); },
                mouseout: (e) => { e.target.setStyle({ weight: 1.4, opacity: 0.6 }); },
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <div style={{ color }} className="font-semibold">{r.airline} · {r.origin} → {r.destination}</div>
                  <div>Freq/week: {r.frequency_per_week ?? '—'}</div>
                  <div>Aircraft: {r.aircraft ?? '—'}</div>
                </div>
              </Popup>
            </Polyline>
          );
        })}
      </MapContainer>
    </div>
  );
}