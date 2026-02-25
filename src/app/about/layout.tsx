import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | درباره ما',
  description:
    'داستان زوفیرا و تعهد ما به ارائه بهترین محصولات بهداشت دهان و دندان از برند لوکس ایتالیایی. با ماموریت، ارزش‌ها و تیم ما آشنا شوید.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'زوفیرا | فروشگاه محصولات بهداشت دهان و دندان',
    description:
      'داستان زوفیرا و تعهد ما به ارائه بهترین محصولات بهداشت دهان و دندان',
    url: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
