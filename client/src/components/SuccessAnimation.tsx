import { CheckCircle2 } from 'lucide-react';

interface SuccessAnimationProps {
  size?: number;
  loop?: boolean;
  className?: string;
}

export default function SuccessAnimation({ 
  size = 150, 
  loop = false,
  className = ""
}: SuccessAnimationProps) {
  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <style>{`
        @keyframes successPulse {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes successRing {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 30px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        
        .success-checkmark {
          animation: successPulse 0.6s ease-out forwards;
        }
        
        .success-ring {
          animation: successRing 1s ease-out;
        }
      `}</style>
      <div className="relative flex items-center justify-center success-ring">
        <CheckCircle2 
          className="success-checkmark text-green-500 dark:text-green-400"
          style={{ 
            width: size,
            height: size,
            strokeWidth: 1.5
          }}
        />
      </div>
    </div>
  );
}
