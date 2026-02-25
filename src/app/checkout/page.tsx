'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { DiscountCode } from '@/components/DiscountCode';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Loading from '@/components/Loading';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  User,
  Package,
  ShieldCheck,
  Truck,
  Clock,
  Plane,
} from 'lucide-react';

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'نام و نام خانوادگی باید حداقل 3 حرف باشد'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
  address: z.string().min(10, 'آدرس باید حداقل 10 حرف باشد'),
  postalCode: z.string().regex(/^\d{10}$/, 'کد پستی معتبر نیست'),
  description: z.string().optional(),
  shippingMethod: z.enum(['REGULAR_POST', 'TIPAX']),
  paymentMethod: z.enum(['ZARINPAL', 'BANK_TRANSFER']),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function OrderCheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<
    'REGULAR_POST' | 'TIPAX'
  >('TIPAX');
  const [payMethod, setPayMethod] = useState<'ZARINPAL' | 'BANK_TRANSFER'>(
    'ZARINPAL'
  );
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { cart, clearCart, discount } = useStore();
  // Sticky offset handling so summary doesn't go under navbar/topbanner
  const [stickyTop, setStickyTop] = useState<number>(96); // ~ top-24
  useEffect(() => {
    try {
      const ts =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('topBannerDismissedAt')
          : null;
      const dismissedValid = (() => {
        if (!ts) return false;
        const t = Number(ts);
        if (Number.isNaN(t)) return false;
        // valid for 7 days
        return Date.now() - t < 7 * 24 * 60 * 60 * 1000;
      })();
      const bannerVisible = !dismissedValid;
      // If banner is visible, increase sticky top (approx header + banner)
      setStickyTop(bannerVisible ? 144 : 96); // 144px ~ top-36
    } catch {
      setStickyTop(96);
    }
  }, []);

  // Initialize react-hook-form before any conditional return to keep hooks order stable
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'TIPAX',
      paymentMethod: 'ZARINPAL',
    },
  });

  // Minimal, safe initial loader (no window access)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <Loading fullScreen label="در حال بارگذاری..." />
      </div>
    );
  }

  // تعریف هزینه ارسال
  const SHIPPING_COSTS = {
    REGULAR_POST: 0, // ارسال عادی رایگان
    TIPAX: 50000, // تیپاکس 50 هزار تومان
  };

  // محاسبه مجموع قیمت
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = SHIPPING_COSTS[shippingMethod];
  const discountAmount = discount
    ? discount.percent
      ? Math.min(
          subtotal * (discount.percent / 100),
          discount.maxAmount || Infinity
        )
      : discount.amount
    : 0;
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  const onSubmit = async (data: CheckoutForm) => {
    setIsLoading(true);
    try {
      const orderPayload = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          postalCode: data.postalCode,
        },
        shippingMethod: data.shippingMethod,
        shippingFee: SHIPPING_COSTS[data.shippingMethod],
        // Let server validate and compute discount; send only the code
        discountCode: discount?.code || undefined,
        customerNotes: data.description,
      };

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const result = await orderResponse.json();

      if (!orderResponse.ok) {
        const serverError =
          result?.message ||
          result?.error ||
          (result?.errors
            ? Object.values(result.errors)
                .flat()
                .filter(Boolean)
                .join('، ')
            : null);

        throw new Error(serverError || 'خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
      }

      const order = result.data;

      // If Zarinpal is selected, start payment and redirect to gateway
      if (data.paymentMethod === 'ZARINPAL') {
        const paymentRes = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            orderId: order.id,
            description: `پرداخت سفارش ${order.id}`,
          }),
        });
        const paymentJson = await paymentRes.json();
        if (!paymentRes.ok || !paymentJson.success) {
          throw new Error(paymentJson.error || 'خطا در ایجاد تراکنش پرداخت');
        }
        // Redirect to Zarinpal gateway
        window.location.href = paymentJson.paymentUrl;
        return;
      }

      // Otherwise (e.g., BANK_TRANSFER), go to order page
      toast.success('سفارش شما با موفقیت ثبت شد!');
      router.push(`/payment/success?order_id=${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(
        error instanceof Error ? error.message : 'یک خطای پیش‌بینی نشده رخ داد.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">سبد خرید شما خالی است</h2>
          <Button onClick={() => router.push('/products')}>
            مشاهده محصولات
          </Button>
        </Card>
      </div>
    );
  }

  const deliveryFeatures = [
    {
      icon: Truck,
      title: 'ارسال سریع',
      description: 'ارسال به سراسر کشور',
    },
    {
      icon: ShieldCheck,
      title: 'تضمین اصالت',
      description: 'ضمانت اصل بودن کالا',
    },
    {
      icon: Clock,
      title: 'تحویل به موقع',
      description: 'تحویل در زمان مقرر',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Right Side - Form */}
          <div className="lg:w-2/3 space-y-6 order-2 lg:order-1">
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">آدرس تحویل</h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        {...register('fullName')}
                        placeholder="نام و نام خانوادگی"
                        className="pr-10"
                      />
                      <User className="absolute top-3 right-3 w-4 h-4 text-muted-foreground" />
                    </div>
                    {errors.fullName && (
                      <p className="text-sm text-destructive">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        {...register('phone')}
                        placeholder="شماره موبایل"
                        className="pr-10 font-numbers text-left"
                        dir="ltr"
                      />
                      <Phone className="absolute top-3 right-3 w-4 h-4 text-muted-foreground" />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Textarea
                      {...register('address')}
                      placeholder="آدرس کامل پستی"
                      className="resize-none h-24 pr-10"
                    />
                    <MapPin className="absolute top-3 right-3 w-4 h-4 text-muted-foreground" />
                  </div>
                  {errors.address && (
                    <p className="text-sm text-destructive">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      {...register('postalCode')}
                      placeholder="کد پستی"
                      className="pr-10 font-numbers text-left"
                      dir="ltr"
                    />
                    <Package className="absolute top-3 right-3 w-4 h-4 text-muted-foreground" />
                  </div>
                  {errors.postalCode && (
                    <p className="text-sm text-destructive">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Textarea
                      {...register('description')}
                      placeholder="توضیحات سفارش (اختیاری)"
                      className="resize-none h-24"
                    />
                  </div>
                </div>

                <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                  <label className="block text-sm font-medium mb-2">
                    روش ارسال
                  </label>
                  <RadioGroup
                    value={shippingMethod}
                    onValueChange={(value: 'REGULAR_POST' | 'TIPAX') => {
                      setShippingMethod(value);
                      setValue('shippingMethod', value); // Sync with react-hook-form
                    }}
                    className="gap-4"
                  >
                    <label
                      htmlFor="tipax"
                      className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="TIPAX" id="tipax" />
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Plane className="w-5 h-5 text-primary" />
                          <div>
                            <div>ارسال سریع با تیپاکس</div>
                            <div className="text-xs text-muted-foreground">
                              ارسال طی 1-2 روز کاری
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-muted-foreground">
                        {SHIPPING_COSTS.TIPAX.toLocaleString('fa-IR')} تومان
                      </div>
                    </label>
                    <label
                      htmlFor="regular-post"
                      className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value="REGULAR_POST"
                          id="regular-post"
                        />
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Truck className="w-5 h-5 text-primary" />
                          <div>
                            <div>ارسال عادی با پست</div>
                            <div className="text-xs text-muted-foreground">
                              ارسال طی 3-5 روز کاری
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        رایگان
                      </div>
                    </label>
                  </RadioGroup>
                  <input
                    type="hidden"
                    {...register('shippingMethod')}
                    value={shippingMethod}
                  />
                  {errors.shippingMethod && (
                    <p className="text-sm text-destructive mt-2">
                      {errors.shippingMethod.message}
                    </p>
                  )}
                </div>

                <div className="space-y-4 border rounded-lg p-4 bg-muted/10">
                  <label className="block text-sm font-medium mb-2">
                    روش پرداخت
                  </label>
                  <RadioGroup
                    value={payMethod}
                    onValueChange={(value: 'ZARINPAL' | 'BANK_TRANSFER') => {
                      setPayMethod(value);
                      setValue('paymentMethod', value); // Sync with react-hook-form
                    }}
                    className="gap-4"
                  >
                    <label
                      htmlFor="zarinpal"
                      className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="ZARINPAL" id="zarinpal" />
                        <div className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          <Image
                            src="/images/zarinpal.png"
                            width={24}
                            height={24}
                            alt="زرین‌پال"
                            className="object-cover"
                          />
                          پرداخت آنلاین با درگاه زرین‌پال
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        امن و سریع
                      </div>
                    </label>
                    <label
                      htmlFor="bank"
                      className="flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="BANK_TRANSFER" id="bank" />
                        <div className="text-sm font-medium cursor-pointer flex items-center gap-2">
                          <svg
                            className="w-6 h-6 text-primary"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M22 14V8.5M6 13V6M2 11V8.5M18 11V8.5M14 10V8.5M10 13V8.5M2 19H22M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          پرداخت کارت به کارت
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        تایید دستی
                      </div>
                    </label>
                  </RadioGroup>
                  <input
                    type="hidden"
                    {...register('paymentMethod')}
                    value={payMethod}
                  />
                  {errors.paymentMethod && (
                    <p className="text-sm text-destructive mt-2">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال پردازش...' : 'ثبت سفارش و پرداخت'}
                </Button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deliveryFeatures.map((feature, index) => (
                <Card key={index} className="p-4 text-center">
                  <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {/* Left Side - Order Summary */}
          <div className="lg:w-1/3 order-1 lg:order-2">
            <div
              className="bg-card rounded-xl border p-6 lg:sticky space-y-6"
              style={{ top: stickyTop }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">خلاصه سفارش</h2>
              </div>

              <div className="space-y-4">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="flex gap-3 py-3 border-b last:border-0"
                  >
                    <div className="relative w-18 h-18 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                      <div className="absolute top-0 right-0 bg-primary text-white w-5 h-5 rounded-bl-lg flex items-center justify-center text-xs font-numbers">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-medium line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="mt-1 text-sm text-muted-foreground font-numbers">
                        {(item.price * item.quantity).toLocaleString('fa-IR')}{' '}
                        تومان
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount code input */}
              <div className="border-t pt-4">
                <DiscountCode />
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>جمع سبد خرید</span>
                  <span className="font-numbers">
                    {subtotal.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    هزینه ارسال (
                    {shippingMethod === 'TIPAX' ? 'تیپاکس' : 'پست عادی'})
                  </span>
                  <span
                    className={
                      shippingCost === 0
                        ? 'text-green-600 font-semibold'
                        : 'font-numbers'
                    }
                  >
                    {shippingCost === 0
                      ? 'رایگان'
                      : `${shippingCost.toLocaleString('fa-IR')} تومان`}
                  </span>
                </div>

                {discount && (
                  <div className="flex justify-between text-sm text-primary font-semibold">
                    <span>سود شما از خرید</span>
                    <span className="font-numbers">
                      {discountAmount.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">مبلغ قابل پرداخت</span>
                    <div className="text-left">
                      <div className="font-bold font-numbers text-lg">
                        {total.toLocaleString('fa-IR')}
                        <span className="text-sm mr-1">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
