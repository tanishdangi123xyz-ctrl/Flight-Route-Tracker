const TYPE_STYLES = {
  added: { label: 'ADDED', color: 'text-good', bg: 'bg-good/10', border: 'border-good/30' },
  removed: { label: 'REMOVED', color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/30' },
  modified: { label: 'MODIFIED', color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/30' },
  frequency_change: { label: 'FREQ Δ', color: 'text-amber', bg: 'bg-amber/10', border: 'border-amber/30' },
};

export default function ChangesTable({ changes }) {
  if (!changes || changes.length === 0) {
    return (
      <div className="border border-panelLine rounded-lg p-8 text-center bg-panel">
        <p className="text-fog font-mono text-sm">No changes detected between these snapshots.</p>
        <p className="text-fog/60 font-mono text-xs mt-1">
          Try comparing snapshots further apart, or refresh the data to capture a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-panelLine rounded-lg overflow-hidden">
      <table className="w-full border-collapse font-mono text-sm">
        <thead>
          <tr className="bg-panel text-fog text-xs uppercase tracking-wider">
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Airline</th>
            <th className="p-3 text-left">Origin</th>
            <th className="p-3 text-left">Destination</th>
            <th className="p-3 text-left">Field</th>
            <th className="p-3 text-left">Old</th>
            <th className="p-3 text-left">New</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((c, i) => {
            const style = TYPE_STYLES[c.change_type] || TYPE_STYLES.modified;
            return (
              <tr key={i} className="border-t border-panelLine hover:bg-panel/60 transition-colors">
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs border ${style.bg} ${style.border} ${style.color}`}>
                    {style.label}
                  </span>
                </td>
                <td className="p-3 text-paper">{c.airline}</td>
                <td className="p-3 text-fog">{c.origin}</td>
                <td className="p-3 text-fog">{c.destination}</td>
                <td className="p-3 text-fog">{c.field_changed ?? '—'}</td>
                <td className="p-3 text-danger/80">{c.old_value ?? '—'}</td>
                <td className="p-3 text-good/80">{c.new_value ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}