import { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

export function GlassPanel({ children, className = '', intensity = 'medium' }: GlassPanelProps) {
  const intensityClasses = {
    light: 'bg-white/30 dark:bg-black/20 backdrop-blur-md border-white/20 dark:border-white/5',
    medium: 'bg-white/50 dark:bg-black/40 backdrop-blur-xl border-white/30 dark:border-white/10',
    strong: 'bg-white/70 dark:bg-black/60 backdrop-blur-2xl border-white/40 dark:border-white/20',
  };

  return (
    <div
      className={`shadow-2xl shadow-black/5 ${intensityClasses[intensity]} ${className}`}
      style={{ borderRadius: 'var(--dashboard-radius)' }}
    >
      {children}
    </div>
  );
}
