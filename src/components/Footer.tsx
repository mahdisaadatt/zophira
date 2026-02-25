import Link from 'next/link';
import Image from 'next/image';

import Script from 'next/script';

export default function Footer() {
  // Build-time envs for public usage
  const enamadId = process.env.NEXT_PUBLIC_ENAMAD_ID;
  const enamadCode = process.env.NEXT_PUBLIC_ENAMAD_CODE;
  const samandehiId = process.env.NEXT_PUBLIC_SAMANDEHI_ID;
  const samandehiCode = process.env.NEXT_PUBLIC_SAMANDEHI_CODE;

  return (
    <footer className="border-t border-border/40 bg-background/30 backdrop-blur-xl">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-8 lg:grid-cols-10 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-4">
            <Link href="/" className="text-2xl font-bold gradient-text">
              <Image
                src="/images/logotype.svg"
                alt="لوگوی زوفیرا"
                width={96}
                height={48}
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <p className="mt-4 text-foreground/70 max-w-md">
              تجربه لوکس‌ترین خمیردندان‌های ایتالیایی را با مجموعه محصولات ماریس
              در زوفیرا داشته باشید. روتین روزانه خود را به لحظه‌ای لذت‌بخش
              تبدیل کنید.
            </p>
          </div>

          {/* Support Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-4">پشتیبانی</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  سوالات متداول
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  درباره ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-4">قوانین</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/terms"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  قوانین و مقررات
                </Link>
              </li>
              <li>
                <Link
                  href="/order-placement"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  نحوه ثبت سفارش
                </Link>
              </li>
              <li>
                <Link
                  href="/order-tracking"
                  className="text-foreground/70 hover:text-foreground transition-colors"
                >
                  پیگیری سفارشات
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-semibold mb-4">ارتباط با ما</h3>
            <div className="flex space-x-reverse">
              <Link
                href="https://instagram.com/zophira_shop"
                className="group p-2 rounded-full transition-colors hover:bg-primary/10"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt="اینستاگرام"
                  width="28"
                  height="28"
                  className="h-7 w-7 text-foreground/70 group-hover:text-foreground transition-colors"
                />
              </Link>
              <Link
                href="https://wa.me/989172024294"
                className="group p-2 rounded-full transition-colors hover:bg-primary/10"
              >
                <Image
                  src="/icons/whatsapp.svg"
                  alt="واتساب"
                  width="28"
                  height="28"
                  className="h-7 w-7 text-foreground/70 group-hover:text-foreground transition-colors"
                />
              </Link>
              <Link
                href="https://t.me/zophira"
                className="group p-2 rounded-full transition-colors hover:bg-primary/10"
              >
                <Image
                  src="/icons/telegram.svg"
                  alt="تلگرام"
                  width="28"
                  height="28"
                  className="h-7 w-7 text-foreground/70 group-hover:text-foreground transition-colors"
                />
              </Link>
            </div>
            {/* <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">خبرنامه</h4>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  className="bg-secondary/50 border border-border rounded-lg sm:rounded-l-lg sm:rounded-r-none px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-right order-1 sm:order-2"
                />
                <button className="bg-primary/20 hover:bg-primary text-primary hover:text-primary-foreground px-4 py-2 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition-colors w-full sm:w-auto order-2 sm:order-1">
                  عضویت
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* Trust seals row */}
        {/* <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            {process.env.NODE_ENV === 'production' && (
              <Script
                src="https://www.zarinpal.com/webservice/TrustCode"
                strategy="beforeInteractive"
              />
            )}
            {enamadId && enamadCode ? (
              <a
                href={`https://trustseal.enamad.ir/?id=${encodeURIComponent(
                  enamadId
                )}&Code=${encodeURIComponent(enamadCode as string)}`}
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="نماد اعتماد الکترونیکی"
              >
                <img
                  src={`https://Trustseal.eNamad.ir/logo.aspx?id=${encodeURIComponent(
                    enamadId
                  )}&Code=${encodeURIComponent(enamadCode as string)}`}
                  alt="نماد اعتماد الکترونیکی"
                  style={{ cursor: 'pointer' }}
                  width={100}
                  height={100}
                />
              </a>
            ) : (
              <div className="text-xs text-foreground/60 border border-dashed border-border rounded px-2 py-1">
                eNamad: .env را تنظیم کنید
              </div>
            )}
            {samandehiId && samandehiCode ? (
              <a
                href={`https://logo.samandehi.ir/Verify.aspx?id=${encodeURIComponent(
                  samandehiId
                )}&p=${encodeURIComponent(samandehiCode as string)}`}
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ساماندهی"
              >
                <img
                  src={`https://logo.samandehi.ir/logo.aspx?id=${encodeURIComponent(
                    samandehiId
                  )}&p=${encodeURIComponent(samandehiCode as string)}`}
                  alt="ساماندهی"
                  style={{ cursor: 'pointer' }}
                  width={100}
                  height={100}
                />
              </a>
            ) : (
              <div className="text-xs text-foreground/60 border border-dashed border-border rounded px-2 py-1">
                ساماندهی: .env را تنظیم کنید
              </div>
            )}
          </div>
        </div>*/}

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-foreground/70">
              © {new Date().getFullYear()} زوفیرا. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-reverse gap-2 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                حریم خصوصی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
