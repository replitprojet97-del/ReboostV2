import { useEffect, useState, useRef, useCallback } from "react";

export default function CircularTransferProgress({ percent }: { percent: number }) {
  const r = 52;
  const circumference = 2 * Math.PI * r;

  const [displayedPercent, setDisplayedPercent] = useState(0);
  
  const currentValueRef = useRef(0);
  const targetQueueRef = useRef<number[]>([]);
  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const animateToTarget = useCallback((target: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    isAnimatingRef.current = true;
    const start = currentValueRef.current;
    const step = 0.5;
    const intervalDuration = 30;
    const direction = target > start ? 1 : -1;

    if (start === target) {
      isAnimatingRef.current = false;
      processQueue();
      return;
    }

    intervalRef.current = setInterval(() => {
      currentValueRef.current += step * direction;

      if ((direction > 0 && currentValueRef.current >= target) || 
          (direction < 0 && currentValueRef.current <= target)) {
        currentValueRef.current = target;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setDisplayedPercent(target);
        isAnimatingRef.current = false;
        processQueue();
        return;
      }

      setDisplayedPercent(currentValueRef.current);
    }, intervalDuration);
  }, []);

  const processQueue = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    if (targetQueueRef.current.length > 0) {
      const nextTarget = targetQueueRef.current.shift()!;
      animateToTarget(nextTarget);
    }
  }, [animateToTarget]);

  useEffect(() => {
    const lastInQueue = targetQueueRef.current[targetQueueRef.current.length - 1];
    const currentTarget = lastInQueue !== undefined ? lastInQueue : currentValueRef.current;
    
    if (percent !== currentTarget) {
      targetQueueRef.current.push(percent);
      
      if (!isAnimatingRef.current) {
        processQueue();
      }
    }
  }, [percent, processQueue]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = (displayedPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle cx="80" cy="80" r={r} stroke="#E5E7EB" strokeWidth="10" fill="none" />
          <circle
            cx="80"
            cy="80"
            r={r}
            stroke="url(#gradient)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: "stroke-dashoffset 50ms linear" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">
            {Math.round(displayedPercent)}%
          </span>
        </div>
      </div>
    </div>
  );
}
