'use client';

import { motion } from 'framer-motion';
import {
  Shield,
  Award,
  Sparkles,
  Truck,
  CreditCard,
  HeartHandshake,
} from 'lucide-react';

export default function About() {
  return (
    <div className="container px-4 sm:px-6 py-8 sm:py-16 max-w-6xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          درباره زوفیرا
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto text-sm sm:text-base">
          زوفیرا، نماینده رسمی محصولات مراقبت دهان و دندان مارویس در ایران،
          با هدف ارائه محصولات با کیفیت و لوکس ایتالیایی به مشتریان ایرانی
          تأسیس شده است.
        </p>
      </div>

      {/* بخش ارزش‌های ما */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold gradient-text mb-4">
              ارزش‌های ما
            </h2>
            <p className="text-lg text-foreground/70">
              آنچه ما را متمایز می‌کند
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <div className="text-center backdrop-blur-xl bg-card/30 p-8 rounded-2xl border border-border/50">
              <div className="mb-6 p-4 rounded-full bg-primary/20 inline-block">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">تضمین اصالت</h3>
              <p className="text-foreground/70 leading-relaxed">
                تمامی محصولات ما دارای هولوگرام اصالت و گارانتی اصل بودن هستند.
                ما مستقیماً با شرکت مارویس ایتالیا در ارتباط هستیم.
              </p>
            </div>
            <div className="text-center backdrop-blur-xl bg-card/30 p-8 rounded-2xl border border-border/50">
              <div className="mb-6 p-4 rounded-full bg-primary/20 inline-block">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">کیفیت برتر</h3>
              <p className="text-foreground/70 leading-relaxed">
                محصولات مارویس با بیش از ۶۰ سال سابقه، از بهترین مواد اولیه و
                استانداردهای سختگیرانه تولید بهره می‌برند.
              </p>
            </div>
            <div className="text-center backdrop-blur-xl bg-card/30 p-8 rounded-2xl border border-border/50">
              <div className="mb-6 p-4 rounded-full bg-primary/20 inline-block">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">تنوع محصولات</h3>
              <p className="text-foreground/70 leading-relaxed">
                مجموعه کاملی از طعم‌های مختلف و خاص خمیردندان مارویس را برای
                سلیقه‌های متفاوت ارائه می‌دهیم.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* بخش خدمات */}
      <div className="relative py-24 bg-secondary/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold gradient-text mb-4">
              خدمات ویژه ما
            </h2>
            <p className="text-lg text-foreground/70">برای آسایش و رضایت شما</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-4 space-x-4 space-x-reverse backdrop-blur-xl bg-card/30 p-6 rounded-xl border border-border/50"
            >
              <div className="p-3 rounded-full bg-primary/20 shrink-0">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-2">ارسال سریع</h3>
                <p className="text-foreground/70">
                  ارسال از طریق تیپاکس و پست در سریع ترین زمان ممکن
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-start gap-4 space-x-4 space-x-reverse backdrop-blur-xl bg-card/30 p-6 rounded-xl border border-border/50"
            >
              <div className="p-3 rounded-full bg-primary/20 shrink-0">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-2">پرداخت امن</h3>
                <p className="text-foreground/70">
                  امکان پرداخت آنلاین و درگاه پرداخت امن با تمامی کارت‌های بانکی
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-start gap-4 space-x-4 space-x-reverse backdrop-blur-xl bg-card/30 p-6 rounded-xl border border-border/50"
            >
              <div className="p-3 rounded-full bg-primary/20 shrink-0">
                <HeartHandshake className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold mb-2">پشتیبانی ۲۴/۷</h3>
                <p className="text-foreground/70">
                  پاسخگویی سریع به سوالات شما از طریق تلفن، ایمیل و چت آنلاین
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* بخش تاریخچه */}
      <div className="relative py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold mb-8 gradient-text text-center">
              تاریخچه مارویس
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="text-right backdrop-blur-xl bg-card/30 p-8 rounded-2xl border border-border/50">
                <h3 className="text-xl font-semibold mb-4">میراث ایتالیایی</h3>
                <p className="text-foreground/70 leading-relaxed">
                  مارویس در سال ۱۹۵۸ در شهر فلورانس ایتالیا تأسیس شد. این برند از
                  همان ابتدا با تمرکز بر کیفیت و نوآوری، به تولید خمیردندان‌های
                  لوکس و منحصر به فرد پرداخت. فرمولاسیون خاص و بسته‌بندی زیبای
                  محصولات مارویس، این برند را به نمادی از سبک زندگی لوکس تبدیل
                  کرده است.
                </p>
              </div>
              <div className="text-right backdrop-blur-xl bg-card/30 p-8 rounded-2xl border border-border/50">
                <h3 className="text-xl font-semibold mb-4">مارویس در ایران</h3>
                <p className="text-foreground/70 leading-relaxed">
                  زوفیرا با درک نیاز بازار ایران به محصولات با کیفیت و اصل، به
                  عنوان نماینده رسمی مارویس در ایران فعالیت خود را آغاز کرد. ما
                  با ارائه محصولات اصل و خدمات پس از فروش مناسب، به دنبال جلب
                  رضایت مشتریان ایرانی هستیم.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
