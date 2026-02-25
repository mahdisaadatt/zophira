'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PaymentCancelledPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-yellow-600 mb-4">
            پرداخت لغو شد
          </h1>

          <p className="text-foreground/70 mb-6">
            شما پرداخت را لغو کردید. سفارش شما در سبد خرید باقی می‌ماند.
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
