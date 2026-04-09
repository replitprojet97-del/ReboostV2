import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';

export default function PageLoader() {
  const [location] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const previousLocationRef = useRef(location);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (location !== previousLocationRef.current) {
      setIsLoading(true);
      setProgress(10);
      previousLocationRef.current = location;

      // Simulate progress animation
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            // Slow down as we approach completion
            return prev + Math.random() * (100 - prev) * 0.1;
          }
          return prev;
        });
      }, 300);

      // Complete loading after duration
      completeTimeoutRef.current = setTimeout(() => {
        setProgress(100);
        
        // Hide loader after completion animation
        setTimeout(() => {
          setIsLoading(false);
          setProgress(0);
        }, 300);
      }, 1200);

      return () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (completeTimeoutRef.current) clearTimeout(completeTimeoutRef.current);
      };
    }
  }, [location]);

  if (!isLoading) return null;

  return (
    <>
      {/* Professional linear progress bar */}
      <div 
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-accent via-primary to-accent z-50 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
        data-testid="loader-progress-bar"
      />
      
      {/* Subtle fade overlay - only visible at start */}
      {progress < 50 && (
        <div 
          className="fixed inset-0 bg-background/5 z-40 pointer-events-none transition-opacity duration-300"
          style={{ opacity: Math.max(0, (50 - progress) / 50) * 0.3 }}
        />
      )}
    </>
  );
}
