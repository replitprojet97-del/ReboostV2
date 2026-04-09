import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/lib/i18n';
import { useUser } from '@/hooks/use-user';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Loader2, ShieldCheck, KeyRound, QrCode, AlertTriangle, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLayout from '@/components/admin/AdminLayout';
import SEO from '@/components/SEO';

export default function AdminSecurity() {
  const { toast } = useToast();
  const t = useTranslations();
  const { data: user, isLoading } = useUser();
  
  const [twoFactorData, setTwoFactorData] = useState({
    qrCode: '',
    secret: '',
    verificationCode: '',
    showSetup: false,
  });

  const setup2FAMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/2fa/setup', {});
      return response.json();
    },
    onSuccess: (data) => {
      setTwoFactorData({
        ...twoFactorData,
        qrCode: data.qrCode,
        secret: data.secret,
        showSetup: true,
        verificationCode: '',
      });
    },
    onError: (error: any) => {
      // Clear state on error to prevent stale data
      setTwoFactorData({
        qrCode: '',
        secret: '',
        verificationCode: '',
        showSetup: false,
      });
      toast({
        variant: 'destructive',
        title: t.common.error,
        description: error.message || t.twoFactorAuth.setup.errorMessage,
      });
    },
  });

  const verify2FAMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/2fa/verify', { token: code, secret: twoFactorData.secret });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      setTwoFactorData({
        qrCode: '',
        secret: '',
        verificationCode: '',
        showSetup: false,
      });
      toast({
        title: t.twoFactorAuth.settings.enabled,
        description: t.twoFactorAuth.settings.enabledMessage,
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t.common.error,
        description: error.message || t.twoFactorAuth.settings.invalidCode,
      });
    },
  });

  const disable2FAMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/2fa/disable', {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      toast({
        title: t.twoFactorAuth.settings.disabled,
        description: t.twoFactorAuth.settings.disabledMessage,
      });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: t.common.error,
        description: error.message || t.twoFactorAuth.disable.errorMessage,
      });
    },
  });

  const handleSetup2FA = () => {
    setup2FAMutation.mutate();
  };

  const handleVerify2FA = () => {
    // Guard against missing secret
    if (!twoFactorData.secret) {
      toast({
        variant: 'destructive',
        title: t.common.error,
        description: t.twoFactorAuth.setup.errorMessage,
      });
      // Reset state if secret is missing
      setTwoFactorData({
        qrCode: '',
        secret: '',
        verificationCode: '',
        showSetup: false,
      });
      return;
    }
    
    if (!twoFactorData.verificationCode || twoFactorData.verificationCode.length !== 6) {
      toast({
        variant: 'destructive',
        title: t.common.error,
        description: t.twoFactorAuth.setup.errorMessage,
      });
      return;
    }
    verify2FAMutation.mutate(twoFactorData.verificationCode);
  };

  const handleDisable2FA = () => {
    disable2FAMutation.mutate();
  };

  const handleCancel2FASetup = () => {
    setTwoFactorData({
      qrCode: '',
      secret: '',
      verificationCode: '',
      showSetup: false,
    });
  };

  if (isLoading || !user) {
    return (
      <AdminLayout
        title={t.admin.sidebar.security || "Sécurité"}
        description="Chargement..."
      >
        <Skeleton className="h-96" />
      </AdminLayout>
    );
  }

  return (
    <>
      <SEO 
        title="Sécurité - Admin"
        description="Gestion de la sécurité du compte administrateur"
      />
      <AdminLayout
        title={t.admin.sidebar.security || "Sécurité"}
        description="Gérez les paramètres de sécurité de votre compte administrateur"
      >
        <Card data-testid="card-admin-2fa">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>{t.settings.twoFactorAuth}</CardTitle>
            </div>
            <CardDescription>{t.settings.twoFactorAuthDesc}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!user?.twoFactorEnabled && !twoFactorData.showSetup && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-md bg-muted/30 border border-border">
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-md">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium">{t.twoFactorAuth.setup.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.twoFactorAuth.setup.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      onClick={handleSetup2FA}
                      disabled={setup2FAMutation.isPending}
                      data-testid="button-enable-2fa"
                    >
                      {setup2FAMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t.twoFactorAuth.setup.verifying}
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4 mr-2" />
                          {t.settings.enable2FA}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {twoFactorData.showSetup && (
                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 rounded-md bg-primary/5 border border-primary/30">
                    <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">{t.twoFactorAuth.setup.step1}</p>
                      <p className="text-muted-foreground">
                        {t.twoFactorAuth.setup.step1Description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-6 p-8 bg-muted/30 rounded-md border border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <QrCode className="h-4 w-4" />
                      <span>{t.twoFactorAuth.setup.qrCodeInstructions}</span>
                    </div>
                    {twoFactorData.qrCode && (
                      <div className="p-4 bg-white rounded-md shadow-lg">
                        <img
                          src={twoFactorData.qrCode}
                          alt="QR Code 2FA"
                          className="w-48 h-48"
                          data-testid="img-2fa-qr-code"
                        />
                      </div>
                    )}
                    <div className="w-full max-w-md space-y-2">
                      <p className="text-xs text-center text-muted-foreground">
                        {t.twoFactorAuth.setup.cantScanQR}
                      </p>
                      <div className="flex items-center justify-center gap-2 p-3 bg-background rounded-md border border-border font-mono text-sm">
                        <Shield className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <code className="break-all">{twoFactorData.secret}</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-md bg-primary/5 border border-primary/30">
                    <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-primary mb-1">{t.twoFactorAuth.setup.step2}</p>
                      <p className="text-muted-foreground">
                        {t.twoFactorAuth.setup.step2Description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="verificationCode" className="text-sm font-medium">
                        {t.twoFactorAuth.setup.enterCode}
                      </Label>
                      <Input
                        id="verificationCode"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        value={twoFactorData.verificationCode}
                        onChange={(e) => setTwoFactorData({ ...twoFactorData, verificationCode: e.target.value.replace(/\D/g, '') })}
                        placeholder="123456"
                        className="text-center text-lg tracking-widest font-mono"
                        data-testid="input-2fa-verification-code"
                      />
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={handleCancel2FASetup}
                        className="flex-1"
                        data-testid="button-cancel-2fa"
                      >
                        {t.common.cancel}
                      </Button>
                      <Button
                        onClick={handleVerify2FA}
                        disabled={verify2FAMutation.isPending || twoFactorData.verificationCode.length !== 6}
                        className="flex-1"
                        data-testid="button-verify-2fa"
                      >
                        {verify2FAMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t.twoFactorAuth.setup.verifying}
                          </>
                        ) : (
                          t.twoFactorAuth.setup.verify
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {user?.twoFactorEnabled && !twoFactorData.showSetup && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900">
                    <div className="flex-shrink-0 p-2 bg-green-100 dark:bg-green-900/50 rounded-md">
                      <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        {t.twoFactorAuth.settings.enabled}
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        {t.twoFactorAuth.settings.enabledMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={handleDisable2FA}
                      disabled={disable2FAMutation.isPending}
                      data-testid="button-disable-2fa"
                    >
                      {disable2FAMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t.common.processing}
                        </>
                      ) : (
                        t.settings.disable2FA
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    </>
  );
}
