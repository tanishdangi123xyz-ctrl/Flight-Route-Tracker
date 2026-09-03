import { useEffect, useState } from 'react';

export default function FlapNumber({ value, digits = 4 }) {
  const target = String(value ?? 0).padStart(digits, '0');
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (value === undefined || value === null) return;
    let ticks = 0;
    const maxTicks = 8;
    const interval = setInterval(() => {
      ticks += 1;
      if (ticks >= maxTicks) {
        setDisplay(target);
        clearInterval(interval);
        return;
      }
      setDisplay(
        target.split('').map((ch, i) => {
          const settleAt = maxTicks - (target.length - i);
          return ticks >= settleAt ? ch : String(Math.floor(Math.random() * 10));
        }).join('')
      );
    }, 60);
    return () => clearInterval(interval);
  }, [value, target]);

  return (
    <span className="inline-flex gap-[3px]">
      {display.split('').map((ch, i) => (
        <span
          key={i}
          className="flex items-center justify-center w-6 h-8 bg-ink border border-panelLine rounded-sm text-scope font-mono text-lg leading-none tabular-nums"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}