'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import FeaturedProducts from '@/components/FeaturedProducts';
import LatestProducts from '@/components/LatestProducts';
import BrandLogos from '@/components/BrandLogos';
import {
  containerVariants,
  heroVariants,
  textRevealVariants,
  featureVariants,
  buttonVariants,
  itemVariants,
} from '@/animations';

const features = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    ),
    title: 'کیفیت ممتاز',
    description: 'ساخته شده در ایتالیا با بهترین مواد اولیه',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
      />
    ),
    title: 'طعم‌های منحصر به فرد',
    description: 'طعم‌های فوق‌العاده را تجربه کنید',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    ),
    title: 'طراحی شیک',
    description: 'بسته‌بندی زیبا که جلب توجه می‌کند',
  },
];

const MotionLink = motion.create(Link);
const MotionImage = motion.create(Image);
export default function Home() {

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden min-h-[80vh] flex items-center"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <MotionImage
            variants={heroVariants} // A variant for the image itself
            src="/images/1.avif"
            alt="پس‌زمینه خمیردندان لوکس"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.85]"
            priority
          />
          <motion.div
            variants={itemVariants} // Orchestrated fade-in
            className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-transparent"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            variants={textRevealVariants}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            <motion.h1
              variants={textRevealVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white"
            >
              لبخند زیبای شما،
              <br />
              اعتماد به نفس ماست
            </motion.h1>
            <motion.p
              variants={textRevealVariants}
              className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed"
            >
              مجموعه خمیردندان‌های لوکس ماریس را کشف کنید، جایی که هنر ایتالیایی
              با مراقبت مدرن از سلامت دهان و دندان ترکیب شده است.
            </motion.p>
            <motion.div
              variants={textRevealVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <MotionLink
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
                href="/products"
                className="px-8 py-3 cursor-pointer rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                مشاهده محصولات
              </MotionLink>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bestselling Products Section */}
      <FeaturedProducts />

      {/* Brand Logos */}
      <BrandLogos />

      {/* Call to Action Section */}
      <div className="bg-secondary/50 my-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            آماده‌اید لبخند خود را متحول کنید؟
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-base sm:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto"
          >
            به خانواده زوفیرا بپیوندید و تفاوتی که کیفیت ایتالیایی ایجاد می‌کند
            را احساس کنید.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MotionLink
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
              href="/products"
              className="px-8 py-3 cursor-pointer rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              اکنون خرید کنید
            </MotionLink>
          </motion.div>
        </div>
      </div>

      {/* New Products Section */}
      <LatestProducts />

      {/* SEO Section */}
      <div className="bg-background/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="text-center text-foreground/60"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-4">
              خمیردندان لوکس ایتالیایی برای تجربه‌ای بی‌نظیر
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed">
              در زوفیرا، ما به ارائه بهترین محصولات مراقبت از دهان و دندان با
              الهام از هنر و کیفیت ایتالیایی افتخار می‌کنیم. خمیردندان‌های ماریس
              با استفاده از مواد اولیه ممتاز و فرمولاسیون‌های منحصر به فرد،
              تجربه‌ای فراتر از یک مسواک زدن ساده را برای شما به ارمغان
              می‌آورند. از طعم‌های کلاسیک و قوی نعناع گرفته تا ترکیبات
              خلاقانه‌ای مانند یاس و دارچین، هر محصول برای ایجاد حسی از طراوت و
              پاکیزگی ماندگار طراحی شده است. با انتخاب خمیردندان‌های ماریس، شما
              نه تنها به سلامت دندان‌های خود اهمیت می‌دهید، بلکه به لبخند خود
              زیبایی و درخشش می‌بخشید. محصولات ما به عنوان بهترین انتخاب برای
              سفید کردن دندان، خوشبو کردن دهان و مراقبت کامل از لثه شناخته
              می‌شوند. همین امروز تفاوت را با زوفیرا تجربه کنید.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-secondary/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureVariants}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="mb-4 p-4 rounded-full bg-primary/20 inline-block"
                >
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {feature.icon}
                  </svg>
                </motion.div>
                <motion.h3
                  variants={textRevealVariants}
                  className="text-lg sm:text-xl md:text-2xl font-semibold mb-2"
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  variants={textRevealVariants}
                  className="text-sm sm:text-base text-foreground/70"
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
