'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { SuccessMessage } from '@/components/SuccessMessage';
import toast from 'react-hot-toast';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { status } = useSession();
  const rawCallback = searchParams?.get('callbackUrl');
  const callbackUrl =
    rawCallback && rawCallback.startsWith('/') ? rawCallback : '/';

  // Redirect authenticated users away from login page
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  // If redirected back with NextAuth error in URL, show a friendly message
  useEffect(() => {
    const err = searchParams?.get('error');
    if (err) {
      setError('ایمیل یا رمز عبور وارد شده صحیح نمی‌باشد.');
    } else {
      setError(null);
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setError('ایمیل یا رمز عبور وارد شده صحیح نمی‌باشد.');
      } else if (result?.ok) {
        // موفقیت: به URL بازگشتی یا callbackUrl هدایت کن
        const url = result?.url || callbackUrl;
        toast.success('با موفقیت وارد شدید');
        router.replace(url);
      }
    } catch (error) {
      setError('خطایی در هنگام ورود رخ داد. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  // Avoid flashing the login form when session status is loading or already authenticated
  if (status === 'loading' || status === 'authenticated') {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-3">
      {/* ستون راست: فرم ورود */}
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 lg:col-span-2">
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
              ورود به حساب کاربری
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              حساب کاربری ندارید؟{' '}
              <Link
                href={`/register${
                  callbackUrl
                    ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : ''
                }`}
                className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                ثبت‌نام کنید
              </Link>
            </p>
          </div>

          <Suspense fallback={null}>
            <SuccessMessage />
          </Suspense>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                ایمیل
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@email.com"
                  required
                  className="pl-10 text-left"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  رمز عبور
                </label>
                <Link
                  href="/forgot-password"
                  className="ml-auto pr-1 inline-block text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline"
                >
                  فراموشی رمز عبور؟
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="pl-10 pr-10 text-left"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full !mt-6" disabled={loading}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
              ) : (
                <>
                  <LogIn className="ml-2 h-4 w-4" />
                  <span>ورود</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* ستون چپ: تصویر */}
      <div className="hidden lg:flex lg:items-center lg:justify-center bg-muted/40 relative overflow-hidden">
        <Image
          src="/images/3.jpg"
          alt="تصویر محصولات زوفیرا"
          width={800}
          height={1200}
          priority
          quality={90}
          className="h-full w-full object-cover brightness-90"
          sizes="(max-width: 1024px) 0px, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-10 left-10 right-10 p-6 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
          <h2 className="text-2xl font-bold text-white">
            تجربه زیبایی و سلامت
          </h2>
          <p className="mt-2 text-base text-white/80">
            با محصولات لوکس ماریس، هر روز لبخندی درخشان‌تر داشته باشید. به دنیای
            زوفیرا خوش آمدید.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
