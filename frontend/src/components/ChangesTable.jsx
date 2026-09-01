const rowColor = {
  added: 'bg-green-50', removed: 'bg-red-50',
  modified: 'bg-yellow-50', frequency_change: 'bg-yellow-50',
};

export default function ChangesTable({ changes }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left border-b">
          <th className="p-2">Type</th><th className="p-2">Airline</th>
          <th className="p-2">Origin</th><th className="p-2">Destination</th>
          <th className="p-2">Field</th><th className="p-2">Old</th><th className="p-2">New</th>
        </tr>
      </thead>
      <tbody>
        {changes.map((c, i) => (
          <tr key={i} className={`${rowColor[c.change_type] || ''} border-b`}>
            <td className="p-2">{c.change_type}</td>
            <td className="p-2">{c.airline}</td>
            <td className="p-2">{c.origin}</td>
            <td className="p-2">{c.destination}</td>
            <td className="p-2">{c.field_changed ?? '-'}</td>
            <td className="p-2">{c.old_value ?? '-'}</td>
            <td className="p-2">{c.new_value ?? '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
