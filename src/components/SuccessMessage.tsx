'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

export function SuccessMessage() {
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const message = searchParams.get('message');
    
    if (searchParams.get('registered') === 'true') {
      setSuccess('ثبت‌نام با موفقیت انجام شد. اکنون می‌توانید وارد شوید.');
    } else if (message === 'password-reset-success') {
      setSuccess('رمز عبور با موفقیت تغییر یافت. اکنون می‌توانید با رمز عبور جدید وارد شوید.');
    }
    
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, success]);

  if (!success) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 text-sm p-4 rounded-lg text-center animate-in fade-in duration-300">
      <div className="flex items-center justify-center space-x-2 space-x-reverse">
        <Check className="h-4 w-4 text-green-600" />
        <span>{success}</span>
      </div>
    </div>
  );
}