import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatWindow } from "./ChatWindow";
import { useConversations, useCreateConversation } from "@/lib/chatQueries";
import { useChatNotifications } from "@/hooks/useChatNotifications";
import { useLanguage, translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ChatWidgetProps {
  userId: string;
  userName?: string;
  userAvatar?: string;
  position?: "bottom-right" | "bottom-left";
  playNotificationSound?: boolean;
}

export function ChatWidget({
  userId,
  userName,
  userAvatar,
  position = "bottom-right",
  playNotificationSound = false,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = translations[language || 'fr'] || translations['fr'] || {};

  const { data: conversations = [] } = useConversations(userId);
  const createConversationMutation = useCreateConversation();
  const { totalUnreadCount } = useChatNotifications(userId);

  useEffect(() => {
    if (conversations.length > 0) {
      const activeConv = conversations.find((c) => c.status === "open") || conversations[0];
      setConversationId(activeConv.id);
    }
  }, [conversations]);

  const handleToggle = async () => {
    if (!isOpen && !conversationId) {
      try {
        const newConv = await createConversationMutation.mutateAsync({
          userId,
          status: "open",
        });
        setConversationId(newConv.id);
      } catch (error) {
        console.error("Failed to create conversation:", error);
      }
    }

    setIsOpen(!isOpen);
  };

  const positionClasses = {
    "bottom-right": "bottom-4 right-4 sm:bottom-6 sm:right-6",
    "bottom-left": "bottom-4 left-4 sm:bottom-6 sm:left-6",
  };

  const chatPositionClasses = {
    "bottom-right": "right-0 sm:right-0",
    "bottom-left": "left-0 sm:left-0",
  };

  return (
    <>
      <div
        className={cn("fixed z-50", positionClasses[position])}
        data-testid="chat-widget-container"
      >
        <AnimatePresence>
          {isOpen && conversationId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed sm:absolute bottom-0 sm:bottom-20 inset-x-0 sm:inset-x-auto",
                chatPositionClasses[position],
                "w-full sm:w-[min(400px,calc(100vw-2rem))]",
                "h-[85vh] sm:h-[min(600px,80vh)]",
                "shadow-2xl rounded-t-lg sm:rounded-lg overflow-hidden",
                "z-[60]"
              )}
              data-testid="chat-widget-popup"
            >
              <ChatWindow
                conversationId={conversationId}
                currentUserId={userId}
                title="Support"
                subtitle={undefined}
                onClose={() => setIsOpen(false)}
                getUserName={(id) => (id === userId ? userName || "You" : "Support")}
                getUserAvatar={(id) => (id === userId ? userAvatar || "" : "")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="icon"
          onClick={handleToggle}
          className={cn(
            "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all",
            isOpen && "rotate-0"
          )}
          data-testid="button-toggle-chat"
        >
          {isOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          ) : (
            <>
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              {totalUnreadCount > 0 && !isOpen && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs"
                  data-testid="badge-unread-count"
                >
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </Badge>
              )}
            </>
          )}
        </Button>
      </div>
    </>
  );
}
