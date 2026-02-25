import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'زوفیرا | نحوه ثبت سفارش',
  description: 'راهنمای کامل نحوه ثبت سفارش در فروشگاه زوفیرا',
};

export default function HowToOrderPage() {
  return (
    <div className="container px-4 sm:px-6 py-8 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">نحوه ثبت سفارش</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          در این صفحه مراحل ثبت سفارش در وب‌سایت زوفیرا به صورت گام به گام شرح داده شده است.
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-p:text-foreground/70 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 max-w-none space-y-8">
        <section className="pt-8 first:pt-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h2 className="text-2xl font-bold">مرحله ۱: جستجو و انتخاب کالا</h2>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-lg p-6">
            <p className="text-foreground/70 leading-relaxed">
              ابتدا کالای مورد نظر خود را از طریق نوار جستجو یا دسته‌بندی‌های موجود در سایت پیدا کنید. پس از یافتن کالا، روی آن کلیک کرده تا به صفحه محصول وارد شوید.
            </p>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </div>
            <h2 className="text-2xl font-bold">مرحله ۲: افزودن به سبد خرید</h2>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-lg p-6">
            <p className="text-foreground/70 leading-relaxed">
              در صفحه محصول، می‌توانید تعداد مورد نیاز را مشخص کرده و سپس با کلیک بر روی دکمه "افزودن به سبد خرید"، کالا را به سبد خرید خود اضافه کنید.
            </p>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
            </div>
            <h2 className="text-2xl font-bold">مرحله ۳: نهایی کردن خرید و پرداخت</h2>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-lg p-6">
            <p className="text-foreground/70 leading-relaxed">
              پس از افزودن تمام کالاهای مورد نظر به سبد خرید، وارد صفحه سبد خرید شده و اطلاعات خود را تکمیل کنید. سپس با انتخاب روش پرداخت، سفارش خود را نهایی کنید.
            </p>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h2 className="text-2xl font-bold">نیاز به راهنمایی بیشتر دارید؟</h2>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><circle cx="12" cy="12" r="10"></circle><path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
              <p className="text-foreground/70 leading-relaxed">
                اگر سؤالی درباره نحوه ثبت سفارش دارید، می‌توانید از طریق{' '}
                <Link href="/contact" className="text-primary hover:underline">فرم تماس</Link>{' '}
                با ما در ارتباط باشید.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
