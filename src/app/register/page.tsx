'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, Check, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { status } = useSession();
  const rawCallback = searchParams?.get('callbackUrl');
  const callbackUrl = rawCallback && rawCallback.startsWith('/') ? rawCallback : '/';

  // Redirect authenticated users away from register page
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (res.ok) {
        // موفقیت: نمایش toast و هدایت به صفحه ورود (حفظ مقصد)
        toast.success('حساب کاربری با موفقیت ایجاد شد');
        const loginUrl = `/login?registered=true${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`;
        router.push(loginUrl);
      } else {
        const data = await res.json();
        setError(data.error || 'خطایی در ثبت‌نام رخ داد. لطفا دوباره تلاش کنید.');
      }
    } catch (error) {
      setError('یک خطای پیش‌بینی نشده رخ داد.');
    } finally {
      setLoading(false);
    }
  }

  // Avoid flashing the register form when session status is loading or already authenticated
  if (status === 'loading' || status === 'authenticated') {
    return null;
  }

  return (
    <div className="relative min-h-screen w-full lg:grid lg:grid-cols-3">
      {/* ستون راست: فرم ثبت‌نام */}
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
              ایجاد حساب کاربری جدید
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <Link
                href={`/login${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`}
                className="font-medium text-primary hover:text-primary/90 underline-offset-4 hover:underline"
              >
                وارد شوید
              </Link>
            </p>
          </div>

          {/* پیام خطا */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-lg text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  نام
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="نام"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  نام خانوادگی
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="نام خانوادگی"
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
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
              <label htmlFor="password" className="text-sm font-medium">
                رمز عبور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="حداقل ۶ کاراکتر"
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
                  <Check className="ml-2 h-4 w-4" />
                  <span>ایجاد حساب</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* ستون چپ: تصویر */}
      <div className="hidden lg:flex lg:items-center lg:justify-center bg-muted/40 relative overflow-hidden">
        <Image
          src="/images/2.jpg"
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
            به خانواده زوفیرا بپیوندید
          </h2>
          <p className="mt-2 text-base text-white/80">
            با ساخت حساب کاربری، از آخرین محصولات، پیشنهادات ویژه و محتوای
            اختصاصی ما باخبر شوید.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
