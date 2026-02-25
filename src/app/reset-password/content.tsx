'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, ArrowRight, Check, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('توکن بازنشانی رمز عبور معتبر نیست.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('توکن بازنشانی رمز عبور معتبر نیست.');
      return;
    }

    if (password !== confirmPassword) {
      setError('رمز عبور و تکرار آن مطابقت ندارند.');
      return;
    }

    if (password.length < 8) {
      setError('رمز عبور باید حداقل ۸ کاراکتر باشد.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطایی در بازنشانی رمز عبور رخ داد.');
      }

      setIsSuccess(true);
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login?message=password-reset-success');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/images/logotype.svg"
              alt="لوگوی زوفیرا"
              width={120}
              height={60}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            بازنشانی رمز عبور
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            رمز عبور جدید خود را وارد کنید.
          </p>
        </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  رمز عبور جدید
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  تکرار رمز عبور جدید
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-right">
                <p className="text-sm text-cyan-800">
                  <strong>نکته:</strong> رمز عبور باید حداقل ۸ کاراکتر باشد و شامل حروف و اعداد باشد.
                </p>
              </div>
              
              <Button type="submit" className="w-full !mt-6" disabled={loading || !token}>
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                ) : (
                  <>
                    <KeyRound className="ml-2 h-4 w-4" />
                    <span>بازنشانی رمز عبور</span>
                  </>
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  رمز عبور با موفقیت تغییر یافت!
                </h3>
                <p className="text-sm text-muted-foreground">
                  در حال انتقال به صفحه ورود...
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-right">
                <p className="text-sm text-green-800">
                  اکنون می‌توانید با رمز عبور جدید خود وارد حساب کاربری شوید.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 space-x-reverse bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800 pr-1">{error}</p>
            </div>
          )}

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
          >
            <ArrowRight className="ml-1 h-4 w-4" />
            بازگشت به صفحه ورود
          </Link>
        </div>
      </div>
    </div>
  );
}
