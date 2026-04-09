import React from "react";

type Props = {
  value?: number;
};

export default function ProgressGlow({ value=50 }: Props) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative" data-testid="progress-glow">
      <div style={{ width: `${pct}%` }} className="h-full relative" data-testid="progress-glow-bar">

        <div className="absolute inset-0 bg-gradient-to-r from-[#7c3aed] via-[#5b21b6] to-[#3b82f6] opacity-95"
             style={{ boxShadow:'0 6px 24px rgba(91,33,182,0.32)', transition:'width 700ms cubic-bezier(.2,.9,.2,1)' }}/>

        <div className="absolute -left-16 top-0 bottom-0 w-32 animate-progress-slide"
             style={{background:'linear-gradient(90deg,rgba(255,255,255,0.22),rgba(255,255,255,0.06),rgba(255,255,255,0.18))', mixBlendMode:'overlay'}}/>
      </div>
    </div>
  );
}
