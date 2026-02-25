'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SuccessContent = () => {
  const { clearCart } = useStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    // Clear the cart only once when the component mounts with a valid order ID
    if (orderId) {
      clearCart();
      toast.success('پرداخت شما با موفقیت انجام شد.');
    }
  }, [orderId, clearCart]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">پرداخت موفق</h1>
      <p className="text-muted-foreground mb-6">
        از خرید شما سپاسگزاریم! سفارش شما با موفقیت ثبت شد.
      </p>
      {orderId && (
        <p className="text-lg mb-8">
          شماره سفارش شما: <span className="font-semibold text-primary">{orderId}</span>
        </p>
      )}
      <div className="flex gap-4">
        <Button onClick={() => router.push('/profile')}>مشاهده سفارشات</Button>
        <Button variant="outline" onClick={() => router.push('/')}>بازگشت به صفحه اصلی</Button>
      </div>
    </div>
  );
};

export default SuccessContent;