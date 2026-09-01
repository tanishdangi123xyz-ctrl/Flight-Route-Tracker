const ITEMS = [
  { code: '6E', name: 'IndiGo', color: '#5EEAD4' },
  { code: 'AI', name: 'Air India', color: '#F0A93A' },
  { code: 'SG', name: 'SpiceJet', color: '#C084FC' },
];

export default function Legend() {
  return (
    <div className="space-y-2">
      {ITEMS.map(i => (
        <div key={i.code} className="flex items-center gap-2 text-xs font-mono text-fog">
          <span className="w-4 h-[2px] rounded-full" style={{ background: i.color, boxShadow: `0 0 6px ${i.color}` }} />
          <span className="text-paper">{i.code}</span>
          <span>{i.name}</span>
        </div>
      ))}
    </div>
  );
}