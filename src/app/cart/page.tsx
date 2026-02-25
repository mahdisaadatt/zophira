'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function Cart() {
  const cart = useStore(state => state.cart);
  const discount = useStore(state => state.discount);
  const removeFromCart = useStore(state => state.removeFromCart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Minimal, safe initial loader (no window access)
  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = discount
    ? discount.percent
      ? Math.min(
          subtotal * (discount.percent / 100),
          discount.maxAmount || Infinity
        )
      : discount.amount
    : 0;

  const total = Math.max(0, subtotal - discountAmount);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Loading fullScreen label="در حال بارگذاری..." />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center">
          <div className="bg-primary/5 p-6 rounded-full mb-6">
            <ShoppingBag className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-3">
            سبد خرید شما خالی است
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            برای مشاهده محصولات به صفحه فروشگاه مراجعه کنید
          </p>
          <Link href="/products">
            <Button className="!cursor-pointer">
              مشاهده محصولات
              <ArrowLeft className="mr-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* سمت راست - لیست محصولات */}
          <div className="lg:w-2/3 space-y-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">سبد خرید</h1>
              <span className="text-sm sm:text-base text-muted-foreground">
                {cart.length} کالا
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {cart.map(item => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border p-3 sm:p-4 transition-all hover:shadow-md"
                >
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="flex-grow space-y-1">
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        خمیردندان ماریس
                      </p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-none h-7 w-7 sm:h-8 sm:w-8 !cursor-pointer"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <span className="font-numbers px-3 sm:px-4 py-1 border-x bg-muted/50 text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-none h-7 w-7 sm:h-8 sm:w-8 !cursor-pointer"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive h-7 w-7 sm:h-8 sm:w-8 !cursor-pointer"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold font-numbers text-base sm:text-lg">
                        {item.price.toLocaleString('fa-IR')}
                        <span className="text-xs sm:text-sm mr-1">تومان</span>
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs sm:text-sm text-muted-foreground font-numbers mt-1">
                          {(item.price * item.quantity).toLocaleString('fa-IR')}{' '}
                          تومان
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* سمت چپ - خلاصه سفارش */}
          <div className="lg:w-1/3 mt-6 lg:mt-0">
            <div className="bg-card rounded-xl border p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">
                خلاصه سفارش
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-sm sm:text-base text-muted-foreground">
                  <span>تعداد کالاها</span>
                  <span className="font-numbers">{cart.length}</span>
                </div>

                {/* هزینه ارسال و کد تخفیف به صفحه checkout منتقل شد */}

                {discount && (
                  <div className="flex justify-between text-sm sm:text-base text-primary font-semibold">
                    <span>سود شما از خرید</span>
                    <span className="font-numbers">
                      {discountAmount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 sm:pt-4 mt-3 sm:mt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm sm:text-base">
                      مبلغ قابل پرداخت
                    </span>
                    <div className="text-left">
                      <p className="font-bold font-numbers text-lg sm:text-xl">
                        {total.toLocaleString('fa-IR')}
                        <span className="text-xs sm:text-sm mr-1">تومان</span>
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full !cursor-pointer bg-primary hover:bg-primary/90 text-sm sm:text-base h-10 sm:h-11"
                  onClick={() => {
                    router.push('/checkout');
                  }}
                >
                  ادامه فرآیند خرید
                </Button>

                <p className="text-[10px] sm:text-xs text-center text-muted-foreground mt-3 sm:mt-4">
                  هزینه ارسال در ادامه بر اساس آدرس، زمان و نحوه ارسال انتخابی
                  شما محاسبه خواهد شد
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
