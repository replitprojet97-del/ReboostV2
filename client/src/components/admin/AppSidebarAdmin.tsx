import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, Landmark, MessageSquare, FileText, BarChart2, MessagesSquare, Shield, LogOut } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useUser, getUserInitials, getAccountTypeLabel, useUserProfilePhotoUrl } from "@/hooks/use-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCallback } from "react";

export function AppSidebarAdmin() {
  const [location, setLocation] = useLocation();
  const { setOpenMobile } = useSidebar();
  const t = useTranslations();
  const { data: user, isLoading: isUserLoading } = useUser();
  const profilePhotoUrl = useUserProfilePhotoUrl();

  const handleNavigate = useCallback((url: string) => {
    setOpenMobile(false);
    setLocation(url);
  }, [setLocation, setOpenMobile]);

  const handleLogout = useCallback(() => {
    setOpenMobile(false);
    setLocation('/');
  }, [setLocation, setOpenMobile]);

  // Récupérer les compteurs de notifications en temps réel
  const { data: notificationCounts } = useQuery<{
    pendingLoans: number;
    signedContracts: number;
    transfersRequiringCode: number;
    unreadMessages: number;
    pendingKyc: number;
    total: number;
  }>({
    queryKey: ["/api/admin/notifications-count"],
    refetchInterval: 30000,
  });

  const menuItems = [
    { label: t.admin.sidebar.overview, link: "/admin", icon: LayoutDashboard, count: 0 },
    { 
      label: t.admin.sidebar.loans, 
      link: "/admin/loans", 
      icon: Landmark,
      count: (notificationCounts?.pendingLoans || 0) + (notificationCounts?.signedContracts || 0) + (notificationCounts?.transfersRequiringCode || 0)
    },
    { label: t.admin.sidebar.users, link: "/admin/users", icon: Users, count: 0 },
    { 
      label: t.admin.sidebar.chat || "Chat", 
      link: "/admin/chat", 
      icon: MessagesSquare, 
      count: notificationCounts?.unreadMessages || 0 
    },
    { label: t.admin.sidebar.contact, link: "/admin/contact", icon: MessageSquare, count: 0 },
    { label: "Sécurité", link: "/admin/security", icon: Shield, count: 0 },
  ];

  const renderMenuItem = (item: any) => {
    const isActive = location === item.link || (item.link !== "/admin" && location.startsWith(item.link));
    return (
      <SidebarMenuItem key={item.link}>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => handleNavigate(item.link)}
          className={cn(
            "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 mx-2",
            isActive 
              ? "bg-white/10 text-white font-semibold shadow-sm border border-white/10" 
              : "text-sidebar-foreground/60 hover:bg-white/5 hover:text-white"
          )}
        >
          <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-white" : "text-sidebar-foreground/40 group-hover:text-white")} />
          <span className="flex-1 text-sm tracking-wide">{item.label}</span>
          {item.count > 0 && (
            <Badge variant="destructive" className="bg-red-500 text-white h-4 px-1.5 text-[10px] min-w-[18px] flex items-center justify-center rounded-full font-bold border-none">
              {item.count}
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

        {/* Navigation Group */}
        <div className="py-4 space-y-8">
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40 mb-3">
              ADMINISTRATION
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {menuItems.map(renderMenuItem)}
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
                    Administrateur
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
