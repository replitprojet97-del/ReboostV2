import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocation } from 'wouter';
import { Clock, Users, FileText, CheckCircle } from 'lucide-react';

interface AdminNotification {
  id: string;
  type: 'loan_pending' | 'kyc_pending' | 'contract_signed' | 'user_pending';
  title: string;
  description: string;
  count: number;
  href: string;
  createdAt: string;
}

export default function AdminNotificationBell() {
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  const { data: notifications, isLoading } = useQuery<AdminNotification[]>({
    queryKey: ['/api/admin/notifications'],
  });

  const totalCount = notifications?.reduce((sum, n) => sum + n.count, 0) || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'loan_pending':
        return <FileText className="h-4 w-4 text-amber-600" />;
      case 'kyc_pending':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'contract_signed':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'user_pending':
        return <Users className="h-4 w-4 text-purple-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleNotificationClick = (href: string) => {
    setOpen(false);
    setLocation(href);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell size={22} className="text-indigo-600" />
          {totalCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {totalCount > 99 ? '99+' : totalCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[min(320px,calc(100vw-2rem))]">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {totalCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {totalCount}
            </Badge>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="py-2">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.href)}
                  className="w-full px-4 py-3 hover-elevate text-left flex items-start gap-3 border-b last:border-b-0"
                  data-testid={`notification-${notification.type}`}
                >
                  <div className="mt-0.5 bg-secondary/40 p-2 rounded-lg">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {notification.title}
                      </p>
                      {notification.count > 0 && (
                        <Badge variant="default" className="shrink-0">
                          {notification.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(notification.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                Aucune action en attente
              </p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
