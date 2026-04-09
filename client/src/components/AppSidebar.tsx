import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  CreditCard, 
  ArrowRightLeft, 
  History, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  FileText, 
  Building2, 
  LayoutDashboard,
  PieChart,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useTranslations } from '@/lib/i18n';
import { useLocation } from 'wouter';
import { useUser, getUserInitials, getAccountTypeLabel, useUserProfilePhotoUrl } from '@/hooks/use-user';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { useDataSocketUpdates } from '@/hooks/use-data-socket-updates';
import { cn } from '@/lib/utils';

import { useTheme } from '@/hooks/use-theme';

export default function AppSidebar() {
  const t = useTranslations();
  const [location, setLocation] = useLocation();
  const { setOpenMobile } = useSidebar();
  const { data: user, isLoading: isUserLoading } = useUser();
  const { theme } = useTheme();
  const profilePhotoUrl = useUserProfilePhotoUrl();

  const isAdminPath = location.startsWith('/admin');
  const isAdmin = user?.role === 'admin';

  useDataSocketUpdates();

  useEffect(() => {
    // We only want to close it if it was actually open to avoid unnecessary state updates
    setOpenMobile(false);
  }, [location]);

  const handleLogout = useCallback(() => {
    setOpenMobile(false);
    setLocation('/');
  }, [setLocation, setOpenMobile]);

  const handleNavigate = useCallback((url: string) => {
    setOpenMobile(false);
    setLocation(url);
  }, [setLocation, setOpenMobile]);

  const { data: loans } = useQuery<any[]>({
    queryKey: ['/api/loans'],
    enabled: !isAdminPath,
  });

  const { data: transfers } = useQuery<any[]>({
    queryKey: ['/api/transfers'],
    enabled: !isAdminPath,
  });

  const excludedStatuses = ['active', 'rejected', 'cancelled', 'completed', 'closed', 'repaid', 'defaulted', 'written_off'];
  const pendingLoansCount = loans?.filter(l => l.status && !excludedStatuses.includes(l.status)).length || 0;
  const inProgressTransfersCount = transfers?.filter(t => t.status === 'in-progress' || t.status === 'in_progress').length || 0;

  const mainSection = [
    { title: t.nav.dashboard, url: '/dashboard', icon: LayoutDashboard },
  ];

  const loansSection = [
    { title: t.nav.myLoans || 'Mes prêts', url: '/loans', icon: PieChart },
    { title: t.nav.contracts || 'Contrats', url: '/contracts', icon: FileText },
  ];

  const operationsSection = [
    { title: t.nav.transfers || 'Transferts', url: '/transfers', icon: ArrowRightLeft },
    { title: t.bankAccounts.title || 'Comptes bancaires', url: '/accounts', icon: Building2 },
    { title: t.nav.history || 'Historique', url: '/history', icon: Clock },
    { title: t.nav.settings || 'Paramètres', url: '/settings', icon: Settings },
  ];

  const renderMenuItem = (item: any) => {
    const isActive = location === item.url;
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => handleNavigate(item.url)}
          className={cn(
            "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 mx-2",
            isActive 
              ? "bg-white/10 text-white font-semibold shadow-sm border border-white/10" 
              : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white"
          )}
        >
          <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-sidebar-foreground/40 group-hover:text-white")} />
          <span className="flex-1 text-sm tracking-wide">{item.title}</span>
          {item.badge && (
            <Badge variant="default" className="bg-primary text-white h-4 px-1.5 text-[10px] min-w-[18px] flex items-center justify-center rounded-full font-bold border-none">
              {item.badge}
            </Badge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarContent className="px-0 py-0 overflow-y-auto interactive-scrollbar bg-sidebar">
        {/* Logo Section */}
        <div className="p-8 mt-4 flex flex-col items-start px-8 border-b border-white/5">
          <span className="text-2xl font-black tracking-tighter text-white leading-[0.85] uppercase">
            Kredit
          </span>
          <span className="text-2xl font-black tracking-tighter text-primary leading-[0.85] uppercase mt-1">
            Pass
          </span>
        </div>

        {/* Navigation Groups */}
        <div className="py-4 space-y-8">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-3">
              {t.nav.loansSection || 'PRÊTS'}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {loansSection.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-3">
              {t.nav.dashboard || 'TABLEAU DE BORD'}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {mainSection.map(renderMenuItem)}
              {operationsSection.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroup>
        </div>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-white/5 bg-black/10">
        <SidebarMenu>
          {/* User Profile Card */}
          {!isUserLoading && user && (
            <SidebarMenuItem>
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10 mb-2">
                <Avatar className="h-9 w-9 border-2 border-sidebar-border">
                  {profilePhotoUrl ? <AvatarImage src={profilePhotoUrl} /> : null}
                  <AvatarFallback className="bg-primary text-white font-bold text-xs">
                    {getUserInitials(user.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-white leading-tight">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                    {getAccountTypeLabel(user.accountType)}
                  </p>
                </div>
              </div>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">{t.nav.logout || 'Déconnexion'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
