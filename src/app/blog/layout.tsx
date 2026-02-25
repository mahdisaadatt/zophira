import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | وبلاگ',
  description: 'وبلاگ زوفیرا - مرجع کامل مقالات تخصصی دندانپزشکی، بهداشت دهان و دندان، راهنمای خرید محصولات دندانپزشکی و آخرین اخبار حوزه سلامت دهان',
  keywords: 'وبلاگ دندانپزشکی, بهداشت دهان, مراقبت از دندان, محصولات دندانپزشکی, زوفیرا, خمیر دندان, مسواک, دهانشویه',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'زوفیرا | وبلاگ',
    description: 'مرجع کامل مقالات تخصصی دندانپزشکی، بهداشت دهان و دندان در زوفیرا',
    type: 'website',
    images: [
      {
        url: '/og-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'وبلاگ زوفیرا',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'وبلاگ زوفیرا - مقالات تخصصی دندانپزشکی',
    description: 'مرجع کامل مقالات تخصصی دندانپزشکی، بهداشت دهان و دندان',
    images: ['/og-blog.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
