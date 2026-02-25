'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-red-600 mb-4">
            خطا در پرداخت
          </h1>

          <p className="text-foreground/70 mb-6">
            {message || 'متأسفانه مشکلی در پرداخت به وجود آمد. لطفاً دوباره تلاش کنید.'}
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/cart">
              <Button variant="outline" className="w-full">
                بازگشت به سبد خرید
              </Button>
            </Link>
            <Link href="/products">
              <Button className="w-full">
                مشاهده محصولات
              </Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
