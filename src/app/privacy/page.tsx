import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'زوفیرا | حریم خصوصی',
  description: 'سیاست‌های حریم خصوصی فروشگاه زوفیرا',
};

export default function PrivacyPage() {
  return (
    <div className="container px-4 sm:px-6 py-8 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">حریم خصوصی</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          ما به حریم خصوصی شما احترام می‌گذاریم و متعهد به حفاظت از اطلاعات شخصی شما هستیم
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-p:text-foreground/70 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 max-w-none space-y-8">
        <section className="pt-8 first:pt-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="M8 15h8"/></svg>
            </div>
            <h2 className="text-2xl font-bold">جمع‌آوری اطلاعات</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">
            ما تنها اطلاعاتی را که برای ارائه خدمات بهتر به شما نیاز داریم،
            جمع‌آوری می‌کنیم. این اطلاعات شامل موارد زیر می‌شود:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              نام و نام خانوادگی
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              آدرس ایمیل
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              شماره تلفن
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              آدرس پستی
            </li>
          </ul>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h2 className="text-2xl font-bold">استفاده از اطلاعات</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">ما از اطلاعات جمع‌آوری شده برای موارد زیر استفاده می‌کنیم:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              پردازش و ارسال سفارشات شما
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              ارتباط با شما در مورد سفارش‌ها و محصولات
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              ارسال خبرنامه (در صورت عضویت)
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              بهبود خدمات و تجربه کاربری
            </li>
          </ul>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-2xl font-bold">امنیت اطلاعات</h2>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-lg p-6">
            <p className="text-foreground/70 leading-relaxed">
              ما از تمامی اطلاعات شخصی شما با استفاده از روش‌های امنیتی پیشرفته
              محافظت می‌کنیم. اطلاعات حساس مانند رمز عبور به صورت رمزنگاری شده
              ذخیره می‌شوند.
            </p>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="text-2xl font-bold">اشتراک‌گذاری اطلاعات</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">
            ما اطلاعات شخصی شما را با هیچ شخص ثالثی به اشتراک نمی‌گذاریم، مگر در
            موارد زیر:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              شرکت‌های حمل و نقل برای ارسال سفارشات
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              درگاه‌های پرداخت برای پردازش تراکنش‌ها
            </li>
            <li className="flex items-center gap-2 text-foreground/70">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              موارد قانونی که ملزم به ارائه اطلاعات هستیم
            </li>
          </ul>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"/></svg>
            </div>
            <h2 className="text-2xl font-bold">کوکی‌ها</h2>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-lg p-4 sm:p-6">
            <p className="text-foreground/70 leading-relaxed text-sm sm:text-base">
              ما از کوکی‌ها برای بهبود تجربه کاربری شما استفاده می‌کنیم. شما
              می‌توانید کوکی‌ها را در مرورگر خود غیرفعال کنید، اما این کار ممکن
              است برخی از عملکردهای سایت را محدود کند.
            </p>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="text-2xl font-bold">حقوق کاربران</h2>
          </div>
          <p className="text-foreground/70 leading-relaxed mb-4">شما حق دارید:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-secondary/30 border border-border/40 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <p className="text-foreground/70">به اطلاعات شخصی خود دسترسی داشته باشید</p>
            </div>
            <div className="bg-secondary/30 border border-border/40 rounded-lg p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <p className="text-foreground/70">اطلاعات نادرست را اصلاح کنید</p>
            </div>
            <div className="bg-secondary/30 border border-border/40 rounded-lg p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              <p className="text-foreground/70">درخواست حذف اطلاعات خود را بدهید</p>
            </div>
            <div className="bg-secondary/30 border border-border/40 rounded-lg p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
              <p className="text-foreground/70">از دریافت ایمیل‌های تبلیغاتی انصراف دهید</p>
            </div>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </div>
            <h2 className="text-2xl font-bold">تغییرات در سیاست حریم خصوصی</h2>
          </div>
          <div className="bg-secondary/30 border border-border/40 rounded-lg p-6">
            <p className="text-foreground/70 leading-relaxed">
              ما ممکن است این سیاست حریم خصوصی را به‌روزرسانی کنیم. هرگونه تغییر
              از طریق این صفحه اعلام خواهد شد.
            </p>
          </div>
        </section>

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <h2 className="text-2xl font-bold">تماس با ما</h2>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1"><circle cx="12" cy="12" r="10"/><path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              <p className="text-foreground/70 leading-relaxed">
                اگر سؤالی درباره سیاست حریم خصوصی ما دارید، می‌توانید از طریق{' '}
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
