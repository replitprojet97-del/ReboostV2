import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, clearCsrfToken, preloadCsrfToken } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaBuilding } from 'react-icons/fa';
import { ArrowLeft, Hash, FileText, Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useLanguage, useTranslations } from '@/lib/i18n';
import { translateBackendMessage } from '@/lib/translateBackendMessage';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import HeaderPremium from '@/components/HeaderPremium';
import FooterPremium from '@/components/premium/FooterPremium';

export default function Auth() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const loginSchema = useMemo(() => z.object({
    email: z.string().email(t.auth.emailInvalid),
    password: z.string().min(1, t.auth.required),
  }), [t]);

  const signupSchema = useMemo(() => z.object({
    accountType: z.enum(['personal', 'business']),
    email: z.string().email(t.auth.emailInvalid),
    password: z.string()
      .min(12, t.auth.passwordMinLength)
      .regex(/[A-Z]/, t.auth.passwordUppercase)
      .regex(/[a-z]/, t.auth.passwordLowercase)
      .regex(/[0-9]/, t.auth.passwordNumber)
      .regex(/[^A-Za-z0-9]/, t.auth.passwordSpecial),
    confirmPassword: z.string(),
    fullName: z.string().min(2, t.auth.required),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    siret: z.string().optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t.auth.passwordMatch,
    path: ['confirmPassword'],
  }).refine((data) => {
    if (data.accountType === 'business') {
      return !!data.companyName;
    }
    return true;
  }, {
    message: t.auth.companyRequired,
    path: ['companyName'],
  }), [t]);

  type LoginFormData = z.infer<typeof loginSchema>;
  type SignupFormData = z.infer<typeof signupSchema>;

  useEffect(() => {
    if (location === '/signup') {
      setActiveTab('signup');
    } else {
      setActiveTab('login');
    }
  }, [location]);

  useEffect(() => {
    preloadCsrfToken();
  }, []);

  useEffect(() => {
    const authMessage = sessionStorage.getItem('auth_redirect_message');
    
    if (authMessage) {
      toast({
        title: t.auth.sessionExpired,
        description: authMessage,
        variant: 'destructive',
      });
      sessionStorage.removeItem('auth_redirect_message');
      sessionStorage.removeItem('auth_redirect_from');
    }
  }, [toast, t]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      accountType: 'personal',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      companyName: '',
      siret: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.requiresAdmin2FASetup) {
        toast({
          title: t.auth.configurationRequired,
          description: translateBackendMessage(data.message, language) || t.auth.configurationRequiredDesc,
          variant: 'default',
        });
        setLocation(`/admin/setup-2fa?userId=${data.userId}&email=${encodeURIComponent(data.email)}`);
      } else if (data.requires2FA) {
        toast({
          title: t.common.success,
          description: translateBackendMessage(data.message, language) || t.auth.pleaseTwoFactorCode,
        });
        setLocation(`/verify-2fa?userId=${data.userId}`);
      } else if (data.requiresOtp) {
        toast({
          title: t.common.success,
          description: translateBackendMessage(data.message, language) || t.auth.verificationCodeSent,
        });
        setLocation(`/verify-otp/${data.userId}`);
      } else {
        clearCsrfToken();
        toast({
          title: t.auth.loginSuccess,
          description: t.auth.loginSuccessDesc,
        });
        if (data.user?.role === 'admin') {
          setLocation('/admin');
        } else {
          setLocation('/dashboard');
        }
      }
    },
    onError: (error: any) => {
      if (error.needsVerification) {
        toast({
          title: t.auth.emailNotVerified,
          description: translateBackendMessage(error.message, language),
          variant: 'destructive',
        });
      } else if (error.errorCode === 'ACCOUNT_SUSPENDED') {
        let description = translateBackendMessage(error.message, language) || t.auth.accountSuspendedDesc;
        
        if (error.suspendedUntil || error.reason) {
          let details = [];
          
          if (error.reason) {
            const suspensionReasons: Record<string, string> = {
              'violation_of_terms': t.auth.suspensionReasons.violationOfTerms || 'Violation des conditions d\'utilisation',
              'suspicious_activity': t.auth.suspensionReasons.suspiciousActivity || 'Activité suspecte détectée',
              'non_payment': t.auth.suspensionReasons.nonPayment || 'Non-paiement ou découvert',
              'kyc_verification_failed': t.auth.suspensionReasons.kycVerificationFailed || 'Vérification KYC échouée',
              'regulatory_compliance': t.auth.suspensionReasons.regulatoryCompliance || 'Problème de conformité réglementaire',
              'security_breach': t.auth.suspensionReasons.securityBreach || 'Faille de sécurité du compte',
              'user_requested': t.auth.suspensionReasons.userRequested || 'Demandé par l\'utilisateur',
              'administrative_decision': t.auth.suspensionReasons.administrativeDecision || 'Décision administrative',
            };
            const translatedReason = suspensionReasons[error.reason] || error.reason;
            details.push(`${t.auth.suspendedReason}: ${translatedReason}`);
          }
          
          if (error.suspendedUntil) {
            try {
              const suspendDate = new Date(error.suspendedUntil);
              const formattedDate = suspendDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              details.push(`${t.auth.suspendedUntil}: ${formattedDate}`);
            } catch (e) {
              // Ignore date formatting errors
            }
          }
          
          if (details.length > 0) {
            description += '\n\n' + details.join('\n');
          }
        }
        
        toast({
          title: t.auth.accountSuspended,
          description: description,
          variant: 'destructive',
        });
      } else if (error.errorCode === 'ACCOUNT_BLOCKED') {
        toast({
          title: t.auth.accountBlocked,
          description: translateBackendMessage(error.message, language) || t.auth.accountBlockedDesc,
          variant: 'destructive',
        });
      } else if (error.errorCode === 'ACCOUNT_INACTIVE') {
        toast({
          title: t.auth.accountInactive,
          description: translateBackendMessage(error.message, language) || t.auth.accountInactiveDesc,
          variant: 'destructive',
        });
      } else {
        toast({
          title: t.auth.loginError,
          description: translateBackendMessage(error.message, language) || t.auth.loginErrorDesc,
          variant: 'destructive',
        });
      }
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const response = await apiRequest('POST', '/api/auth/signup', { ...data, preferredLanguage: language });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t.auth.signupSuccess,
        description: translateBackendMessage(data.message, language),
      });
      setActiveTab('login');
      loginForm.setValue('email', signupForm.getValues('email'));
    },
    onError: (error: any) => {
      toast({
        title: t.auth.signupError,
        description: translateBackendMessage(error.message, language) || t.auth.signupErrorDesc,
        variant: 'destructive',
      });
    },
  });

  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onSignupSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-foreground/5 flex flex-col">
      <HeaderPremium />
      
      <main className="relative flex-1 flex">
        {/* LEFT COLUMN - FIXED PREMIUM BRANDING PANEL (DESKTOP ONLY) */}
        <div className="hidden lg:flex fixed left-0 top-[60px] w-[45%] h-[calc(100vh-60px)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex-col items-center justify-center px-12 py-24 overflow-hidden">
          
          {/* ABSTRACT PREMIUM SHAPES */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-tr from-indigo-500/8 to-blue-500/4 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-600/5 to-transparent rounded-full blur-3xl" />
          </div>

          {/* PREMIUM CONTENT */}
          <div className="relative z-10 text-center max-w-sm">
            <div className="mb-6 inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              {t.auth.panelTitle}
            </h2>
            
            <p className="text-white/80 text-lg font-medium mb-3">
              {t.auth.panelSubtitle}
            </p>
            
            <div className="space-y-4 mt-12 text-left">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/90 font-semibold text-sm">{t.auth.subtitle}</p>
                  <p className="text-white/60 text-xs mt-1">{t.auth.bankEncryption}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/90 font-semibold text-sm">{t.auth.verifiedAuth}</p>
                  <p className="text-white/60 text-xs mt-1">{t.auth.twoFactorAvailable}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/90 font-semibold text-sm">{t.auth.complianceStandard}</p>
                  <p className="text-white/60 text-xs mt-1">{t.auth.internationalCertifications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - INDEPENDENT SCROLLING AUTHENTICATION PANEL */}
        <div className="w-full lg:ml-[45%] flex flex-col items-center justify-center bg-white dark:bg-slate-950 px-4 sm:px-8 py-8 lg:py-0 min-h-screen lg:min-h-auto overflow-y-auto">
          {/* Subtle vertical divider (desktop only) */}
          <div className="hidden lg:block fixed left-[45%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200/40 to-transparent dark:via-slate-700/30"></div>
          
          <div className="w-full max-w-[440px] flex flex-col justify-center lg:min-h-screen lg:py-0 lg:mx-auto">
            {/* PREMIUM FORM PANEL - INTEGRATED DESIGN */}
            <div className="p-8 sm:p-10 lg:p-0 lg:pr-16">

              {/* HEADER */}
              <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  {activeTab === 'login' ? t.auth.login : t.auth.signup}
                </h1>
                <p className="text-muted-foreground text-sm">{t.auth.subtitle || 'Accédez à votre compte Solventis'}</p>
              </div>

              {/* ELEGANT TABS WITH UNDERLINE ANIMATION */}
              <div className="mb-10 pb-4 border-b border-gray-200 dark:border-slate-700">
                <div className="flex gap-10">
                  <button
                    onClick={() => setActiveTab('login')}
                    className={`pb-4 px-1 font-semibold text-base relative transition-colors duration-200 ${
                      activeTab === 'login' 
                        ? 'text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="tab-login"
                  >
                    {t.auth.loginTab}
                    {activeTab === 'login' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full animate-in fade-in slide-in-from-left-4 duration-300" />
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('signup')}
                    className={`pb-4 px-1 font-semibold text-base relative transition-colors duration-200 ${
                      activeTab === 'signup' 
                        ? 'text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    data-testid="tab-signup"
                  >
                    {t.auth.signupTab}
                    {activeTab === 'signup' && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-full animate-in fade-in slide-in-from-right-4 duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN FORM */}
              {activeTab === 'login' && (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-7 auth-form-generous">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                  className="mb-2 -mt-2"
                  data-testid="button-back-login"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.auth.backToHome}
                </Button>
              </Link>

              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">{t.auth.email}</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                        <FaEnvelope className="text-muted-foreground" />
                        <Input
                          {...field}
                          type="text"
                          autoComplete="email"
                          placeholder={t.auth.emailPlaceholder}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          data-testid="input-login-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">{t.auth.password}</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                        <FaLock className="text-muted-foreground" />
                        <Input
                          {...field}
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          data-testid="input-login-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          data-testid="button-toggle-login-password"
                        >
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Link href="/forgot-password">
                  <button
                    type="button"
                    className="text-sm text-accent hover:text-accent/80 font-medium transition-colors"
                    data-testid="link-forgot-password"
                  >
                    {t.auth.forgotPasswordLink}
                  </button>
                </Link>
              </div>

                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 font-bold rounded-lg"
                    data-testid="button-submit-login"
                  >
                    {loginMutation.isPending ? t.auth.loggingIn : t.auth.login}
                  </Button>
                </form>
              </Form>
              )}

              {/* SIGNUP FORM */}
              {activeTab === 'signup' && (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-7 auth-form-generous">
              <Link href="/">
                <Button
                  type="button"
                  variant="ghost"
                  className="mb-2 -mt-2"
                  data-testid="button-back-signup"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t.auth.backToHome}
                </Button>
              </Link>

              {/* ACCOUNT TYPE */}
              <FormField
                control={signupForm.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-base">{t.auth.accountType}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setAccountType(value as 'personal' | 'business');
                        }}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem
                            value="personal"
                            id="personal"
                            className="peer sr-only"
                            data-testid="radio-personal"
                          />
                          <Label
                            htmlFor="personal"
                            className="flex flex-col items-center justify-center border-2 border-border bg-muted/30 rounded-lg p-4 cursor-pointer transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                            data-testid="label-personal"
                          >
                            <FaUser className="text-2xl mb-2 text-accent" />
                            <span className="font-semibold text-foreground">{t.auth.personal}</span>
                            <span className="text-xs text-muted-foreground text-center mt-1">{t.auth.personalLoan}</span>
                          </Label>
                        </div>

                        <div>
                          <RadioGroupItem
                            value="business"
                            id="business"
                            className="peer sr-only"
                            data-testid="radio-business"
                          />
                          <Label
                            htmlFor="business"
                            className="flex flex-col items-center justify-center border-2 border-border bg-muted/30 rounded-lg p-4 cursor-pointer transition-all peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10"
                            data-testid="label-business"
                          >
                            <FaBuilding className="text-2xl mb-2 text-accent" />
                            <span className="font-semibold text-foreground">{t.auth.business}</span>
                            <span className="text-xs text-muted-foreground text-center mt-1">{t.auth.businessLoan}</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FORM INPUTS */}
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">{t.auth.fullName} *</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                        <FaUser className="text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder={t.auth.fullNamePlaceholder}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          data-testid="input-fullName"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signupForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">{t.auth.phone}</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                        <FaPhone className="text-muted-foreground" />
                        <Input
                          {...field}
                          placeholder={t.auth.phonePlaceholder}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          data-testid="input-phone"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUSINESS FIELDS */}
              {accountType === 'business' && (
                <div className="space-y-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <FormField
                    control={signupForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">{t.auth.companyName} *</FormLabel>
                        <FormControl>
                          <div className="flex items-center border border-border bg-card rounded-lg px-4 py-3 gap-3">
                            <FaBuilding className="text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder={t.auth.companyNamePlaceholder}
                              className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              data-testid="input-companyName"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="siret"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">{t.auth.siret}</FormLabel>
                        <FormControl>
                          <div className="flex items-center border border-border bg-card rounded-lg px-4 py-3 gap-3">
                            <Hash className="text-muted-foreground h-4 w-4" />
                            <Input
                              {...field}
                              placeholder={t.auth.siretPlaceholder}
                              className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                              data-testid="input-siret"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold">{t.auth.email} *</FormLabel>
                    <FormControl>
                      <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                        <FaEnvelope className="text-muted-foreground" />
                        <Input
                          {...field}
                          type="text"
                          autoComplete="email"
                          placeholder={t.auth.emailPlaceholder}
                          className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                          data-testid="input-signup-email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">{t.auth.password} *</FormLabel>
                      <FormControl>
                        <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                          <FaLock className="text-muted-foreground" />
                          <Input
                            {...field}
                            type={showSignupPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            data-testid="input-signup-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            data-testid="button-toggle-signup-password"
                          >
                            {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">{t.auth.confirmPassword} *</FormLabel>
                      <FormControl>
                        <div className="flex items-center border border-border bg-muted/40 dark:bg-primary/5 rounded-lg px-4 py-3 gap-3">
                          <FaLock className="text-muted-foreground" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            data-testid="input-confirmPassword"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            data-testid="button-toggle-confirm-password"
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 font-bold rounded-lg"
                    data-testid="button-submit-signup"
                  >
                    {signupMutation.isPending ? t.auth.signingUp : t.auth.signup}
                  </Button>
                </form>
              </Form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
