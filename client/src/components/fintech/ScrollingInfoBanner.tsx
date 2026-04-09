import { useState, useEffect } from 'react';
import { Info, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface InfoMessage {
  id: string;
  textKey: 'message1' | 'message2' | 'message3' | 'message4';
  type: 'info' | 'warning' | 'success' | 'update';
}

const messageConfigs: InfoMessage[] = [
  {
    id: '1',
    textKey: 'message1',
    type: 'info',
  },
  {
    id: '2',
    textKey: 'message2',
    type: 'update',
  },
  {
    id: '3',
    textKey: 'message3',
    type: 'warning',
  },
  {
    id: '4',
    textKey: 'message4',
    type: 'success',
  },
];

export function ScrollingInfoBanner() {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messageConfigs.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentMessage = messageConfigs[currentIndex];

  const getIcon = () => {
    switch (currentMessage.type) {
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'success':
        return <CheckCircle className="w-4 h-4" />;
      case 'update':
        return <Clock className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getBgColor = () => {
    switch (currentMessage.type) {
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-200';
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200';
      case 'update':
        return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30 text-blue-900 dark:text-blue-200';
      default:
        return 'bg-muted/50 border-border text-foreground';
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${getBgColor()} animate-fade-in transition-all duration-500`}
      data-testid="info-banner"
    >
      <div className="flex-shrink-0">{getIcon()}</div>
      <p className="text-sm font-medium flex-1 min-w-0">
        {t.infoBanner.messages[currentMessage.textKey]}
      </p>
      <div className="flex gap-1">
        {messageConfigs.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-current w-4' : 'bg-current/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
