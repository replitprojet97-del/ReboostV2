import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface PdfViewerProps {
  storagePath: string;
  fileName: string;
}

export function PdfViewer({ storagePath, fileName }: PdfViewerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile on mount
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);

  // On mobile, show open button instead of iframe (iframe has rendering issues on mobile)
  if (isMobile) {
    return (
      <div className="w-full rounded-md overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6"
        style={{
          minHeight: '200px',
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{fileName}</p>
            <p className="text-xs text-muted-foreground">PDF Preview</p>
          </div>
          <Button
            asChild
            className="w-full"
            data-testid="btn-open-pdf-mobile"
          >
            <a href={storagePath} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-2" />
              Open PDF
            </a>
          </Button>
        </div>
      </div>
    );
  }

  // Desktop: show iframe preview
  return (
    <div className="relative group">
      <div 
        className="w-full rounded-md overflow-y-auto bg-slate-100 dark:bg-slate-900 flex items-center justify-center"
        style={{
          maxHeight: '400px',
          aspectRatio: '0.707', // A4 ratio (210/297)
        }}
      >
        <iframe
          src={storagePath}
          title={fileName}
          className="w-full h-full"
          style={{ border: 'none' }}
          data-testid="pdf-preview-iframe"
        />
      </div>

      {/* Download button on hover */}
      <Button
        size="sm"
        variant="ghost"
        asChild
        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
        data-testid="btn-download-pdf-viewer"
      >
        <a href={storagePath} download={fileName}>
          <Download className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
