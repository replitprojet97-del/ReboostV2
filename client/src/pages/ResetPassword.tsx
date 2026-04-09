import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Loader2, Lock, Check, X, Eye, EyeOff } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslations } from '@/lib/i18n';

export default function ResetPassword() {
  const t = useTranslations();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/reset-password/:token');
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = params?.token || '';

  useEffect(() => {
    if (!token) {
      setLocation('/auth');
    }
  }, [token, setLocation]);

  const passwordRequirements = [
    { key: 'minLength', test: (pwd: string) => pwd.length >= 12 },
    { key: 'uppercase', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { key: 'lowercase', test: (pwd: string) => /[a-z]/.test(pwd) },
    { key: 'number', test: (pwd: string) => /[0-9]/.test(pwd) },
    { key: 'specialChar', test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) },
  ];

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/reset-password', { token, password });
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t.resetPassword.success,
        description: t.resetPassword.successMessage,
      });
      setTimeout(() => {
        setLocation('/auth');
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: t.resetPassword.error,
        description: error.message || t.resetPassword.invalidToken,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t.resetPassword.error,
        description: t.resetPassword.passwordMismatch,
        variant: 'destructive',
      });
      return;
    }

    const allRequirementsMet = passwordRequirements.every(req => req.test(password));
    if (!allRequirementsMet) {
      toast({
        title: t.resetPassword.error,
        description: t.resetPassword.requirements,
        variant: 'destructive',
      });
      return;
    }

    resetPasswordMutation.mutate({ token, password });
  };

  return (
    <>
      <SEO 
        title={t.seo.resetPassword.title}
        description={t.seo.resetPassword.description}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-6 w-6 text-primary" />
              <CardTitle>{t.resetPassword.title}</CardTitle>
            </div>
            <CardDescription>
              {t.resetPassword.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{t.resetPassword.newPassword}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    autoFocus
                    data-testid="input-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t.resetPassword.confirmPassword}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    data-testid="input-confirm-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    data-testid="button-toggle-confirm-password"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {password && (
                <div className="space-y-2 bg-muted/50 p-4 rounded-lg border">
                  <p className="text-sm font-medium">{t.resetPassword.requirements}</p>
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => {
                      const labels = {
                        minLength: t.resetPassword.minLength,
                        uppercase: t.resetPassword.uppercase,
                        lowercase: t.resetPassword.lowercase,
                        number: t.resetPassword.number,
                        specialChar: t.resetPassword.specialChar,
                      };
                      return (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          {req.test(password) ? (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <X className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={req.test(password) ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'}>
                            {labels[req.key as keyof typeof labels]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {confirmPassword && password !== confirmPassword && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <X className="h-4 w-4" />
                  <span>{t.resetPassword.passwordMismatch}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={
                  !password ||
                  !confirmPassword ||
                  password !== confirmPassword ||
                  !passwordRequirements.every(req => req.test(password)) ||
                  resetPasswordMutation.isPending
                }
                className="w-full"
                data-testid="button-reset-password"
              >
                {resetPasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {t.resetPassword.resetPassword}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
