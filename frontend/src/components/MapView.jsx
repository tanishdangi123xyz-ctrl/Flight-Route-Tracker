import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

export default function MapView({ routes }) {
  return (
    <MapContainer center={[20, 78]} zoom={4} className="h-[500px] w-full rounded-lg">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes
        .filter(r => r.origin_lat && r.dest_lat)
        .map((r, i) => (
          <Polyline
            key={i}
            positions={[[r.origin_lat, r.origin_lon], [r.dest_lat, r.dest_lon]]}
            pathOptions={{ color: '#4a90d9', weight: 2, opacity: 0.7 }}
          >
            <Popup>
              {r.airline}: {r.origin} → {r.destination}<br />
              Freq/week: {r.frequency_per_week ?? 'N/A'}<br />
              Aircraft: {r.aircraft ?? 'N/A'}
            </Popup>
          </Polyline>
        ))}
    </MapContainer>
  );
}
