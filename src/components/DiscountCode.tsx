'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

export function DiscountCode() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { discount, applyDiscount, removeDiscount } = useStore();

  const handleApplyDiscount = async () => {
    if (!code) return;
    setLoading(true);
    try {
      applyDiscount(code);
    } catch (error: any) {
      toast.error(error.message || 'خطا در اعمال کد تخفیف');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    setCode('');
    toast.success('کد تخفیف حذف شد');
  };

  return (
    <div className="space-y-2">
      <label htmlFor="discount-code" className="text-sm font-medium">
        کد تخفیف
      </label>
      <div className="flex items-center gap-2">
        <Input
          id="discount-code"
          placeholder="کد تخفیف خود را وارد کنید"
          value={code}
          onChange={e => setCode(e.target.value)}
          disabled={!!discount || loading}
          className="text-left"
          dir="ltr"
        />
        <Button
          variant={discount ? 'destructive' : 'default'}
          onClick={discount ? handleRemoveDiscount : handleApplyDiscount}
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : discount ? (
            'حذف'
          ) : (
            'اعمال'
          )}
        </Button>
      </div>
      {discount && (
        <div className="text-sm text-primary font-semibold">
          {discount.percent ? (
            <span>{discount.percent}% تخفیف اعمال شد</span>
          ) : (
            <span>
              {discount.amount.toLocaleString('fa-IR')} تومان تخفیف اعمال شد
            </span>
          )}
        </div>
      )}
    </div>
  );
}
