import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | سوالات متداول',
  description:
    'پاسخ به سوالات متداول درباره خرید محصولات بهداشت دهان و دندان از زوفیرا، نحوه ارسال، گارانتی و خدمات پس از فروش.',
  alternates: {
    canonical: '/faq',
  },
  openGraph: {
    title: 'زوفیرا | سوالات متداول',
    description:
      'پاسخ به سوالات متداول درباره خرید محصولات بهداشت دهان و دندان',
    url: '/faq',
  },
};

const faqItems = [
  {
    id: 'q1',
    question: 'هزینه ارسال چقدر است؟',
    answer:
      'هزینه ارسال بر اساس متد انتخابی شما که شامل پست یا تیپاکس میباشد محاسبه میگردد.',
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
        <path d="M20 12.58A6.35 6.35 0 0 0 12.7 8.2a6.35 6.35 0 0 0-7.4 0" />
        <path d="M12.7 16.8a6.35 6.35 0 0 1 7.4 0" />
        <path d="M12 22a8.2 8.2 0 0 0 8.2-8.2" />
        <path d="M3.8 13.8a8.2 8.2 0 0 0 8.2 8.2" />
        <path d="M12 2a8.2 8.2 0 0 0-8.2 8.2" />
        <path d="M20.2 13.8a8.2 8.2 0 0 0-8.2-8.2" />
      </svg>
    ),
  },
  {
    id: 'q2',
    question: 'زمان تحویل سفارش چقدر است؟',
    answer: 'معمولاً بین ۲ تا ۴ روز کاری، بسته به موقعیت جغرافیایی شما.',
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
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'q3',
    question: 'آیا امکان مرجوع کردن کالا وجود دارد؟',
    answer:
      'مرجوعی تنها در صورتی امکان پذیر است که محصول ارسال شده آسیب دیده باشد و یا اشتباه و یا ناقص ارسال شده باشد. و این مورد باید در همان زمان تحویل بسته از پست، با مدارک مستند اطلاع داده شود. در غیر اینصورت مرجوعی امکان پذیر نخواهد بود.',
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
        <path d="M21 7v6h-6" />
        <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
      </svg>
    ),
  },
  {
    id: 'q4',
    question: 'روش‌های پرداخت کدام‌ها هستند؟',
    answer: 'پرداخت آنلاین از طریق زرین پال و کارت به کارت امکان‌پذیر است.',
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
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
  },
];

export default function FAQPage() {
  return (
    <div className="container px-4 sm:px-6 py-8 sm:py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          سوالات متداول
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          پاسخ به سوالات پرتکرار شما. اگر پاسخ سوال خود را پیدا نکردید، با ما
          تماس بگیرید.
        </p>
      </div>

      <div className="space-y-8">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map(item => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="bg-secondary/30 border border-border/40 rounded-lg px-6"
            >
              <AccordionTrigger className="text-lg font-semibold text-right hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    {item.icon}
                  </div>
                  <span>{item.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-foreground/70 leading-relaxed pt-2">
                  {item.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

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
            <h2 className="text-2xl font-bold">سوال دیگری دارید؟</h2>
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
                اگر پاسخ سوال خود را در این صفحه پیدا نکردید، می‌توانید از طریق{' '}
                <Link href="/contact" className="text-primary hover:underline">
                  فرم تماس
                </Link>{' '}
                با ما در ارتباط باشید.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
