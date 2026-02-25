import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'زوفیرا | پیگیری سفارشات',
  description: 'پیگیری وضعیت سفارش‌های شما در زوفیرا',
};

export default function OrderTrackingPage() {
  return (
    <div className="container px-4 sm:px-6 py-8 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">پیگیری سفارشات</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          برای پیگیری سفارش خود، شماره سفارش و شماره تلفن همراه خود را وارد کنید.
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-p:text-foreground/70 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 max-w-none space-y-8">
        
        <section className="pt-8 first:pt-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
            </div>
            <h2 className="text-2xl font-bold">فرم پیگیری سفارش</h2>
          </div>
          
          <div className="not-prose bg-card p-6 sm:p-8 rounded-2xl border border-border/40">
            <div className="space-y-4">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium mb-2 text-foreground/80">
                  شماره سفارش
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  className="w-full p-3 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="شماره سفارش خود را وارد کنید"
                  dir="ltr"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-2 text-foreground/80">
                  شماره تلفن همراه
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full p-3 rounded-xl border border-border bg-background/50 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
                  placeholder="۰۹××××××××××"
                  dir="ltr"
                />
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors duration-300 mt-4 font-medium">
                پیگیری سفارش
              </button>
            </div>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            </div>
            <h2 className="text-2xl font-bold">راهنمای پیگیری</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">
            برای پیدا کردن شماره سفارش خود به نکات زیر توجه کنید:
          </p>
          <ul className="grid grid-cols-1 gap-3 mt-4">
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
              شماره سفارش پس از نهایی شدن خرید برای شما ایمیل و پیامک می‌شود.
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
              می‌توانید شماره سفارش‌های خود را در بخش «سفارشات من» در پروفایل کاربری خود مشاهده کنید.
            </li>
          </ul>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h2 className="text-2xl font-bold">مشکلی دارید؟</h2>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
            <div className="flex items-start gap-3">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><circle cx="12" cy="12" r="10"></circle><path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
              <p className="text-foreground/70 leading-relaxed">
                اگر در پیگیری سفارش خود با مشکلی مواجه شدید، می‌توانید از طریق{' '}
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
