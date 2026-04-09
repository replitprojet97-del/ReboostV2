import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Save, Send, ShieldCheck, KeyRound, QrCode, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { useTranslations } from "@/lib/i18n";

export default function AdminSettings() {
  const { toast } = useToast();
  const t = useTranslations();
  const { data: user } = useUser();
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const [transferFee, setTransferFee] = useState(25);
  const [minCodes, setMinCodes] = useState(1);
  const [maxCodes, setMaxCodes] = useState(3);
  const [defaultCodes, setDefaultCodes] = useState(2);
  const [threshold, setThreshold] = useState(50000);
  
  const [messageUserId, setMessageUserId] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('info');
  
  const [twoFactorData, setTwoFactorData] = useState({
    qrCode: '',
    secret: '',
    verificationCode: '',
    showSetup: false,
  });

  const { data: users } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const feeSetting = settings.find((s: any) => s.settingKey === "default_transfer_fee");
      const codesSettings = settings.find((s: any) => s.settingKey === "validation_codes_count");
      const thresholdSetting = settings.find((s: any) => s.settingKey === "validation_code_amount_threshold");

      if (feeSetting) setTransferFee(feeSetting.settingValue.amount);
      if (codesSettings) {
        setMinCodes(codesSettings.settingValue.min);
        setMaxCodes(codesSettings.settingValue.max);
        setDefaultCodes(codesSettings.settingValue.default);
      }
      if (thresholdSetting) setThreshold(thresholdSetting.settingValue.amount);
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      return await apiRequest("PUT", `/api/admin/settings/${key}`, { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les modifications ont été enregistrées avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les paramètres",
        variant: "destructive",
      });
    },
  });

  const handleSaveTransferFee = () => {
    updateSettingMutation.mutate({
      key: "default_transfer_fee",
      value: { amount: transferFee, currency: "EUR" },
    });
  };

  const handleSaveCodeSettings = () => {
    updateSettingMutation.mutate({
      key: "validation_codes_count",
      value: { min: minCodes, max: maxCodes, default: defaultCodes },
    });
  };

  const handleSaveThreshold = () => {
    updateSettingMutation.mutate({
      key: "validation_code_amount_threshold",
      value: { amount: threshold, currency: "EUR" },
    });
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/messages', data);
      return await response.json();
    },
    onSuccess: () => {
      setMessageUserId('');
      setMessageSubject('');
      setMessageContent('');
      setMessageSeverity('info');
      toast({
        title: "Message envoyé",
        description: "Le message a été envoyé à l'utilisateur",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    },
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
        description: error.message || t.twoFactorAuth.setup.errorMessage,
      });
    },
  });

  const handleSendMessage = () => {
    if (!messageUserId || !messageSubject || !messageContent) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate({
      userId: messageUserId,
      subject: messageSubject,
      content: messageContent,
      severity: messageSeverity,
    });
  };

  const handleSetup2FA = () => {
    setup2FAMutation.mutate();
  };

  const handleVerify2FA = () => {
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

  if (isLoading) {
    return (
      <AdminLayout
        title="Paramètres"
        description="Configurer les frais et les codes de validation"
      >
        <div className="space-y-6" data-testid="loading-admin-settings">
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Paramètres"
      description="Configurer les frais et les codes de validation"
    >
      <div className="grid gap-6 md:grid-cols-2" data-testid="page-admin-settings">
        <Card data-testid="card-transfer-fee">
          <CardHeader>
            <CardTitle>Frais de Transfert</CardTitle>
            <CardDescription>Montant des frais par défaut pour les transferts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-fee">Montant des frais (€)</Label>
              <Input
                id="transfer-fee"
                type="number"
                value={transferFee}
                onChange={(e) => setTransferFee(parseFloat(e.target.value))}
                min={0}
                step={0.01}
                data-testid="input-transfer-fee"
              />
            </div>
            <Button
              onClick={handleSaveTransferFee}
              disabled={updateSettingMutation.isPending}
              data-testid="button-save-transfer-fee"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        <Card data-testid="card-validation-threshold">
          <CardHeader>
            <CardTitle>Seuil de Validation</CardTitle>
            <CardDescription>Montant déclenchant plusieurs codes de validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threshold">Montant seuil (€)</Label>
              <Input
                id="threshold"
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                min={0}
                step={1000}
                data-testid="input-threshold"
              />
            </div>
            <Button
              onClick={handleSaveThreshold}
              disabled={updateSettingMutation.isPending}
              data-testid="button-save-threshold"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2" data-testid="card-validation-codes">
          <CardHeader>
            <CardTitle>Codes de Validation</CardTitle>
            <CardDescription>Configuration du nombre de codes requis pour la validation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="min-codes">Minimum</Label>
                <Input
                  id="min-codes"
                  type="number"
                  value={minCodes}
                  onChange={(e) => setMinCodes(parseInt(e.target.value))}
                  min={1}
                  max={5}
                  data-testid="input-min-codes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-codes">Par défaut</Label>
                <Input
                  id="default-codes"
                  type="number"
                  value={defaultCodes}
                  onChange={(e) => setDefaultCodes(parseInt(e.target.value))}
                  min={minCodes}
                  max={maxCodes}
                  data-testid="input-default-codes"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-codes">Maximum</Label>
                <Input
                  id="max-codes"
                  type="number"
                  value={maxCodes}
                  onChange={(e) => setMaxCodes(parseInt(e.target.value))}
                  min={1}
                  max={5}
                  data-testid="input-max-codes"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveCodeSettings}
              disabled={updateSettingMutation.isPending}
              data-testid="button-save-codes"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2" data-testid="card-admin-2fa">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {t.settings.twoFactorAuth}
            </CardTitle>
            <CardDescription>{t.settings.twoFactorAuthDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!user?.twoFactorEnabled && !twoFactorData.showSetup && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border">
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
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
                    data-testid="button-enable-admin-2fa"
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
                <div className="flex items-start gap-4 p-5 rounded-xl bg-primary/5 border border-primary/30">
                  <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">{t.twoFactorAuth.setup.step1}</p>
                    <p className="text-muted-foreground">
                      {t.twoFactorAuth.setup.step1Description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 p-8 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <QrCode className="h-4 w-4" />
                    <span>{t.twoFactorAuth.setup.qrCodeInstructions}</span>
                  </div>
                  {twoFactorData.qrCode && (
                    <div className="p-4 bg-white rounded-lg shadow-lg">
                      <img
                        src={twoFactorData.qrCode}
                        alt="QR Code 2FA"
                        className="w-48 h-48"
                        data-testid="img-admin-2fa-qr-code"
                      />
                    </div>
                  )}
                  <div className="w-full max-w-md space-y-2">
                    <p className="text-xs text-center text-muted-foreground">
                      {t.twoFactorAuth.setup.cantScanQR}
                    </p>
                    <div className="flex items-center justify-center gap-2 p-3 bg-background rounded-lg border border-border font-mono text-sm">
                      <code className="text-primary">{twoFactorData.secret}</code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="adminVerificationCode" className="text-sm font-medium">
                      {t.twoFactorAuth.setup.enterCode}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t.twoFactorAuth.setup.step3Description}
                    </p>
                    <Input
                      id="adminVerificationCode"
                      type="text"
                      placeholder={t.twoFactorAuth.setup.codePlaceholder}
                      maxLength={6}
                      value={twoFactorData.verificationCode}
                      onChange={(e) => setTwoFactorData({ ...twoFactorData, verificationCode: e.target.value.replace(/\D/g, '') })}
                      className="text-center text-2xl tracking-widest font-mono"
                      data-testid="input-admin-2fa-code"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handleCancel2FASetup}
                    disabled={verify2FAMutation.isPending}
                    data-testid="button-cancel-admin-2fa-setup"
                  >
                    {t.twoFactorAuth.setup.cancel}
                  </Button>
                  <Button
                    onClick={handleVerify2FA}
                    disabled={verify2FAMutation.isPending || twoFactorData.verificationCode.length !== 6}
                    data-testid="button-verify-admin-2fa"
                  >
                    {verify2FAMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t.twoFactorAuth.setup.verifying}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        {t.twoFactorAuth.setup.verify}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {user?.twoFactorEnabled && !twoFactorData.showSetup && (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-5 rounded-xl bg-accent/10 border border-accent/30">
                  <div className="flex-shrink-0 p-2 bg-accent/10 rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-accent">{t.twoFactorAuth.settings.enabled}</p>
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.twoFactorAuth.settings.enabledMessage}
                    </p>
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={handleDisable2FA}
                    disabled={disable2FAMutation.isPending}
                    data-testid="button-disable-admin-2fa"
                  >
                    {disable2FAMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t.twoFactorAuth.disable.disabling}
                      </>
                    ) : (
                      t.twoFactorAuth.disable.disable
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2" data-testid="card-send-message">
          <CardHeader>
            <CardTitle>Envoyer un message à un utilisateur</CardTitle>
            <CardDescription>Communiquer directement avec les utilisateurs via leur Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-select">Utilisateur</Label>
                <Select value={messageUserId} onValueChange={setMessageUserId}>
                  <SelectTrigger data-testid="select-user">
                    <SelectValue placeholder="Sélectionner un utilisateur" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(users) && users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.fullName} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity-select">Priorité</Label>
                <Select value={messageSeverity} onValueChange={setMessageSeverity}>
                  <SelectTrigger data-testid="select-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Avertissement</SelectItem>
                    <SelectItem value="error">Erreur</SelectItem>
                    <SelectItem value="success">Succès</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-subject">Sujet</Label>
              <Input
                id="message-subject"
                placeholder="Objet du message"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                data-testid="input-message-subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-content">Contenu</Label>
              <Textarea
                id="message-content"
                placeholder="Contenu du message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                data-testid="textarea-message-content"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4 mr-2" />
              {sendMessageMutation.isPending ? 'Envoi...' : 'Envoyer'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
