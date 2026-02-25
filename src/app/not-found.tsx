'useclient'

import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center">
        {/* آیکون */}
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary/30">
          <FileQuestion className="w-10 h-10 text-primary" />
        </div>

        {/* متن خطا */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
          ۴۰۴
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          صفحه مورد نظر پیدا نشد
        </h2>
        <p className="text-foreground/70 mb-8 max-w-md mx-auto">
          متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا به آدرس دیگری منتقل شده است.
        </p>

        {/* دکمه‌ها */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-center"
          >
            بازگشت به صفحه اصلی
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors text-center"
          >
            مشاهده محصولات
          </Link>
        </div>
      </div>

      {/* تزئینات پس‌زمینه */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
      </div>
    </div>
  );
}
