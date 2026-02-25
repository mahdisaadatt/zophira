import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'زوفیرا | قوانین و مقررات',
  description: 'قوانین و مقررات استفاده از فروشگاه اینترنتی زوفیرا',
};

const termsSections = [
  {
    title: 'شرایط عمومی',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    content: [
      'استفاده از وب‌سایت زوفیرا به معنای پذیرش کلیه شرایط و قوانین ذکر شده در این صفحه است. لطفاً قبل از هرگونه استفاده از خدمات، این قوانین را به دقت مطالعه فرمایید.',
      'زوفیرا حق به‌روزرسانی و تغییر این قوانین را در هر زمان برای خود محفوظ می‌دارد. مسئولیت مطالعه تغییرات بر عهده کاربر است.',
    ],
  },
  {
    title: 'قوانین خرید',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    content: [
      'تمامی قیمت‌های درج شده در سایت به تومان است.',
      'مسئولیت صحت اطلاعات وارد شده (مانند آدرس و شماره تماس) بر عهده خریدار است.',
      'پس از ثبت سفارش، امکان لغو یا تغییر آن از طریق پنل کاربری وجود ندارد. برای تغییرات با پشتیبانی تماس بگیرید.',
    ],
  },
  {
    title: 'شرایط ارسال',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    content: [
      'زمان تحویل سفارش بین ۲ تا ۴ روز کاری است.',
      'هزینه ارسال بر اساس تعرفه پست محاسبه می‌گردد.',
      'امکان پیگیری مرسوله از طریق کد رهگیری که پس از ارسال کالا برای شما پیامک می‌شود، وجود دارد.',
    ],
  },
  {
    title: 'حریم خصوصی',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    content: [
      'زوفیرا متعهد به حفظ حریم خصوصی کاربران است. اطلاعات شخصی شما محرمانه تلقی شده و به هیچ شخص یا سازمان ثالثی واگذار نخواهد شد.',
      'اطلاعات شما صرفاً برای پردازش سفارش و بهبود تجربه خرید شما استفاده می‌شود.',
      'برای اطلاعات بیشتر، صفحه <a href="/privacy" class="text-primary hover:underline">سیاست حفظ حریم خصوصی</a> را مطالعه کنید.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="container px-4 sm:px-6 py-8 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          قوانین و مقررات
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          استفاده از خدمات زوفیرا به منزله پذیرش کامل این قوانین است. آخرین
          بروزرسانی: ۱۴۰۳/۰۵/۰۱
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert prose-p:text-foreground/70 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 max-w-none space-y-8">
        {termsSections.map((section, index) => (
          <section key={index} className="pt-8 first:pt-0">
            <div className="flex items-start sm:items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 mt-1 sm:mt-0">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>
            <ul className="list-disc list-inside space-y-3 bg-secondary/30 border border-border/40 rounded-lg p-6">
              {section.content.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  dangerouslySetInnerHTML={{ __html: item }}
                  className="leading-relaxed"
                />
              ))}
            </ul>
          </section>
        ))}

        <section className="pt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">تماس با ما</h2>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary mt-1"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
              <p className="text-foreground/70 leading-relaxed">
                در صورت وجود هرگونه سوال یا ابهام در مورد این قوانین، می‌توانید
                از طریق{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  صفحه تماس با ما
                </Link>{' '}
                با تیم پشتیبانی زوفیرا در ارتباط باشید.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
