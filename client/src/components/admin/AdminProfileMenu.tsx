import { UserCircle, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLocation } from 'wouter';
import { useUser, getUserInitials } from '@/hooks/use-user';
import { useMutation } from '@tanstack/react-query';
import { queryClient, getApiUrl } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function AdminProfileMenu() {
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const { toast } = useToast();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const csrfToken = await fetch(getApiUrl('/api/csrf-token'), {
        credentials: 'include',
      }).then((res) => res.json()).then((data) => data.csrfToken);

      const response = await fetch(getApiUrl('/api/auth/logout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Échec de la déconnexion');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur de déconnexion',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          data-testid="button-profile"
        >
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-sm">
                {getUserInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <UserCircle size={32} className="text-gray-700" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user && (
          <>
            <div className="flex items-center gap-2 p-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  {getUserInitials(user.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" data-testid="text-admin-name">
                  {user.fullName}
                </p>
                <p className="text-xs text-muted-foreground truncate" data-testid="text-admin-email">
                  {user.email}
                </p>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">
                  Administrateur
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="text-red-600" 
          data-testid="button-admin-logout"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
