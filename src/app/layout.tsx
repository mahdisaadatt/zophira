import type { Metadata } from 'next';
import localFont from 'next/font/local';
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';
import LayoutWrapper from '@/components/LayoutWrapper';
import './globals.css';

const iranYekan = localFont({
  src: [
    {
      path: '../../public/fonts/IRANYekanX-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IRANYekanX-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IRANYekanXFaNum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/IRANYekanXFaNum-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-iranYekan',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://zophira.ir'),
  title:
    'زوفیرا | فروشگاه محصولات بهداشت دهان و دندان - خمیردندان لوکس ایتالیایی',
  description:
    'فروشگاه آنلاین زوفیرا، ارائه‌دهنده محصولات لوکس بهداشت دهان و دندان از برندهای معتبر ایتالیایی. خمیردندان، مسواک، دهان‌شویه و سایر محصولات بهداشتی با کیفیت بالا و قیمت مناسب.',
  keywords: [
    'خمیردندان',
    'محصولات بهداشت دهان',
    'خمیردندان ایتالیایی',
    'مسواک',
    'دهان شویه',
    'بهداشت دندان',
    'محصولات دندانپزشکی',
    'فروشگاه آنلاین',
    'زوفیرا',
    'خمیردندان لوکس',
    'بهداشت دهان و دندان',
    'محصولات ایتالیایی',
  ],
  authors: [{ name: 'Mahdi Saadat', url: 'https://github.com/mahdisaadatt/' }],
  creator: 'Mahdi Saadat',
  publisher: 'زوفیرا',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'health',
  classification: 'business',
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: 'https://zophira.ir',
    siteName: 'زوفیرا',
    title: 'زوفیرا | فروشگاه محصولات بهداشت دهان و دندان',
    description:
      'فروشگاه آنلاین زوفیرا، ارائه‌دهنده محصولات لوکس بهداشت دهان و دندان از برندهای معتبر ایتالیایی. خرید آنلاین خمیردندان، مسواک و محصولات بهداشتی با کیفیت بالا.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'زوفیرا | فروشگاه محصولات بهداشت دهان و دندان',
      },
    ],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://zophira.ir',
    languages: {
      'fa-IR': 'https://zophira.ir',
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'زوفیرا',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={iranYekan.variable}>
      <body className="antialiased">
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
