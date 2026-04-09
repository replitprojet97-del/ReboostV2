import { Switch, Route } from 'wouter';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import DashboardWrapper from '@/pages/DashboardWrapper';
import IndividualLoans from '@/pages/IndividualLoans';
import LoanRequestDashboard from '@/pages/LoanRequestDashboard';
import LoanOfferDetail from '@/pages/LoanOfferDetail';
import TransferFlow from '@/pages/TransferFlow';
import Transfers from '@/pages/Transfers';
import BankAccounts from '@/pages/BankAccounts';
import History from '@/pages/History';
import Settings from '@/pages/Settings';
import Contracts from '@/pages/Contracts';
import TwoFactorSetup from '@/pages/TwoFactorSetup';
import SuspendedUser from '@/pages/SuspendedUser';
import NotFound from '@/pages/not-found';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBanner from '@/components/NotificationBanner';
import UserProfileHeader from '@/components/UserProfileHeader';
import NotificationBell from '@/components/NotificationBell';
import { LoanDialogProvider } from '@/contexts/LoanDialogContext';
import { ScrollingInfoBanner } from '@/components/fintech';
import { ChatWidget } from '@/components/chat';
import { useUser } from '@/hooks/use-user';
import { useDataSocket } from '@/hooks/useDataSocket';

function DataSocketHandler() {
  useDataSocket();
  return null;
}

function ChatWidgetWrapper() {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <ChatWidget
      userId={user.id}
      userName={user.username}
      userAvatar={user.profilePhoto || undefined}
    />
  );
}

export default function ProtectedLayout() {
  const { data: user } = useUser();
  
  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-mobile': '18rem',
  };

  // Show suspension page if user is suspended
  if (user?.status === 'suspended') {
    return <SuspendedUser />;
  }

  return (
    <>
      {user && <DataSocketHandler />}
      <LoanDialogProvider>
        <TopBar />
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex min-h-screen w-full pt-10">
            <AppSidebar />
            <div className="flex flex-col flex-1 min-w-0">
              {/* Fintech Premium Header */}
              <header className="sticky top-0 z-40 border-b border-border bg-background/60 backdrop-blur-xl transition-all duration-300">
                <div className="flex items-center justify-between px-4 h-16 md:px-6">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" className="hover:bg-muted rounded-full w-10 h-10 flex items-center justify-center transition-colors" />
                    <div className="hidden md:block">
                       <ScrollingInfoBanner />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <NotificationBell />
                    <div className="hidden sm:block">
                      <UserProfileHeader />
                    </div>
                  </div>
                </div>
                {/* Mobile Info Banner */}
                <div className="md:hidden px-4 pb-3">
                  <ScrollingInfoBanner />
                </div>
              </header>
              
              {/* Legacy Notification Banner (if needed) */}
              <div className="hidden">
                <NotificationBanner />
              </div>
              
              <main className="flex-1 overflow-auto bg-background">
                <Switch>
                  <Route path="/dashboard" component={DashboardWrapper} />
                  <Route path="/loans" component={IndividualLoans} />
                  <Route path="/loans/repayments" component={IndividualLoans} />
                  <Route path="/loans/new" component={LoanRequestDashboard} />
                  <Route path="/loan-request" component={LoanRequestDashboard} />
                  <Route path="/loan-offers/:offerId" component={LoanOfferDetail} />
                  <Route path="/contracts" component={Contracts} />
                  <Route path="/transfer/new" component={TransferFlow} />
                  <Route path="/transfer/:id" component={TransferFlow} />
                  <Route path="/transfers" component={Transfers} />
                  <Route path="/accounts" component={BankAccounts} />
                  <Route path="/history" component={History} />
                  <Route path="/settings" component={Settings} />
                  <Route path="/security/2fa" component={TwoFactorSetup} />
                  <Route component={NotFound} />
                </Switch>
              </main>
              <ChatWidgetWrapper />
            </div>
          </div>
        </SidebarProvider>
      </LoanDialogProvider>
    </>
  );
}
