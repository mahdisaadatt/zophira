'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    setIsSuccess(false);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'خطایی در ارسال درخواست رخ داد.');
      }

      setMessage(data.message);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            فراموشی رمز عبور
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نگران نباشید! ایمیل خود را وارد کنید تا لینک بازنشانی رمز عبور را دریافت کنید.
          </p>
        </div>

          {!isSuccess ? (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 text-left"
                    dir="ltr"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full !mt-6" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                ) : (
                  <>
                    <Mail className="ml-2 h-4 w-4" />
                    <span>ارسال لینک بازنشانی</span>
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
                  ایمیل ارسال شد!
                </h3>
                <p className="text-sm text-muted-foreground">
                  {message}
                </p>
              </div>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 text-right">
                <p className="text-sm text-cyan-800">
                  <strong>نکته:</strong> اگر ایمیل را دریافت نکردید، پوشه اسپم خود را بررسی کنید.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-2 space-x-reverse bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
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
