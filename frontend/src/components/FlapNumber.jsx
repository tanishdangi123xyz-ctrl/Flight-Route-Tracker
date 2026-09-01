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
    <span className="inline-flex font-mono tabular-nums tracking-wider text-lg">
      {display.split('').map((ch, i) => (
        <span key={i} className="inline-block w-[1ch] text-center bg-ink border border-panelLine rounded-sm mx-[1px] px-1 py-0.5 text-scope">
          {ch}
        </span>
      ))}
    </span>
  );
}