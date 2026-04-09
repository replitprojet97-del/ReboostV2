import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";
import { Check, CheckCheck, FileText, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getFileUrl } from "@/lib/utils";
import type { ChatMessage } from "@shared/schema";
import { PdfViewer } from "./PdfViewer";

interface MessageProps {
  message: ChatMessage;
  isOwn: boolean;
  senderName?: string;
  senderAvatar?: string;
  nextMessage?: ChatMessage | null;
}

export function Message({ message, isOwn, senderName, senderAvatar, nextMessage }: MessageProps) {
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isImageFile = (fileName?: string) => {
    if (!fileName) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const isPdfFile = (fileName?: string | null, fileUrl?: string | null) => {
    if (!fileName && !fileUrl) return false;
    if (fileName && fileName.toLowerCase().endsWith('.pdf')) return true;
    // Fallback: check URL if fileName is missing (for old messages)
    if (fileUrl && fileUrl.toLowerCase().includes('.pdf')) return true;
    return false;
  };

  // Get spacing based on current message type and next message type
  const getSpacing = () => {
    if (!nextMessage || !nextMessage.senderId || nextMessage.senderId !== message.senderId) {
      return "mb-5"; // Default spacing when next message is from different sender or doesn't exist
    }

    const currentIsPdf = message.fileUrl && isPdfFile(message.fileName, message.fileUrl);
    const currentIsImage = message.fileUrl && message.fileName && isImageFile(message.fileName);
    const nextIsImage = nextMessage.fileUrl && nextMessage.fileName && isImageFile(nextMessage.fileName);
    const nextIsPdf = nextMessage.fileUrl && isPdfFile(nextMessage.fileName, nextMessage.fileUrl);

    // PDF followed by image: increase spacing
    if (currentIsPdf && nextIsImage) return "mb-8";
    // Image followed by image: reduce spacing
    if (currentIsImage && nextIsImage) return "mb-2";
    // Image/PDF followed by text: default spacing
    if ((currentIsImage || currentIsPdf) && nextMessage.content) return "mb-5";
    // Default
    return "mb-5";
  };

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FileText className="h-4 w-4" />;
    
    const ext = fileName.toLowerCase().split('.').pop() || '';
    switch (ext) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-4 w-4" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn(
        "flex gap-3 mb-3 w-full",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}
      data-testid={`message-${message.id}`}
    >
      {!isOwn && (
        <Avatar className="h-8 w-8 flex-shrink-0 mt-1">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1 relative min-w-0",
          isOwn ? "items-end max-w-[75%]" : "items-start max-w-[75%]"
        )}
      >
        {!isOwn && senderName && (
          <span className="text-sm text-muted-foreground px-3" data-testid="text-sender-name">
            {senderName}
          </span>
        )}

        {/* File with timestamp directly below */}
        {message.fileUrl && message.fileName && isImageFile(message.fileName) && (
          <div className={cn("flex flex-col gap-1", getSpacing())}>
            <div
              className={cn(
                "p-1 rounded-2xl overflow-hidden",
                isOwn
                  ? "bg-primary/10 rounded-br-md"
                  : "bg-muted rounded-bl-md"
              )}
            >
              <img
                src={getFileUrl(message.fileUrl)}
                alt={message.fileName}
                className="max-w-xs rounded-xl max-h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(getFileUrl(message.fileUrl)!, '_blank')}
                data-testid={`img-attachment-${message.id}`}
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 px-1",
                isOwn ? "flex-row-reverse" : "flex-row"
              )}
            >
              <span className="text-xs text-muted-foreground" data-testid="text-timestamp">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>

              {isOwn && (
                <div data-testid="icon-read-status">
                  {message.isRead ? (
                    <CheckCheck className="h-3 w-3 text-primary" />
                  ) : (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {message.fileUrl && isPdfFile(message.fileName, message.fileUrl) && (
          <div className={cn("flex flex-col gap-1", getSpacing())}>
            <div
              className={cn(
                "p-2 rounded-2xl overflow-hidden",
                isOwn
                  ? "bg-primary/10 rounded-br-md"
                  : "bg-muted rounded-bl-md"
              )}
            >
              <PdfViewer
                storagePath={getFileUrl(message.fileUrl) || ''}
                fileName={message.fileName || 'Document.pdf'}
              />
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 px-1",
                isOwn ? "flex-row-reverse" : "flex-row"
              )}
            >
              <span className="text-xs text-muted-foreground" data-testid="text-timestamp">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>

              {isOwn && (
                <div data-testid="icon-read-status">
                  {message.isRead ? (
                    <CheckCheck className="h-3 w-3 text-primary" />
                  ) : (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {message.fileUrl && message.fileName && !isImageFile(message.fileName) && !isPdfFile(message.fileName, message.fileUrl) && (
          <div className={cn("flex flex-col gap-1", getSpacing())}>
            <div
              className={cn(
                "px-3 py-2 rounded-2xl",
                isOwn
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
            >
              <a
                href={getFileUrl(message.fileUrl)}
                download
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                data-testid={`link-file-${message.id}`}
              >
                {getFileIcon(message.fileName)}
                <span className="text-sm truncate flex-1">
                  {message.fileName}
                </span>
                <Download className="h-4 w-4 flex-shrink-0" />
              </a>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 px-1",
                isOwn ? "flex-row-reverse" : "flex-row"
              )}
            >
              <span className="text-xs text-muted-foreground" data-testid="text-timestamp">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>

              {isOwn && (
                <div data-testid="icon-read-status">
                  {message.isRead ? (
                    <CheckCheck className="h-3 w-3 text-primary" />
                  ) : (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Text only messages */}
        {message.content && (
          <div
            className={cn(
              "flex flex-col gap-1 relative z-10",
              getSpacing(),
              isOwn ? "items-end" : "items-start"
            )}
          >
            <div
              className={cn(
                "px-4 py-2.5 rounded-2xl max-w-full",
                isOwn
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-muted text-foreground rounded-bl-md"
              )}
            >
              <p 
                className="text-sm whitespace-pre-wrap break-words"
                style={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
                data-testid="text-message-content"
              >
                {message.content}
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 px-1",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}>
              <span className="text-xs text-muted-foreground" data-testid="text-timestamp">
                {formatDistanceToNow(new Date(message.createdAt), {
                  addSuffix: true,
                  locale: enUS,
                })}
              </span>

              {isOwn && (
                <div data-testid="icon-read-status">
                  {message.isRead ? (
                    <CheckCheck className="h-3 w-3 text-primary" />
                  ) : (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
