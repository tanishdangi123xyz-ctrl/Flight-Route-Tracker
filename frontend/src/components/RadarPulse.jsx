export default function RadarPulse() {
  return (
    <div className="relative w-9 h-9 rounded-full border border-scope/30 bg-ink overflow-hidden flex items-center justify-center flex-shrink-0">
      <div
        className="absolute inset-0 radar-sweep"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(94,234,212,0.55) 25deg, transparent 60deg)' }}
      />
      <div className="w-1.5 h-1.5 rounded-full bg-scope shadow-glow z-10" />
    </div>
  );
}