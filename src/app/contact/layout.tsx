import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | تماس با ما',
  description:
    'با تیم پشتیبانی زوفیرا در تماس باشید. راه‌های ارتباطی، آدرس و ساعات کاری فروشگاه محصولات بهداشت دهان و دندان زوفیرا.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'زوفیرا | تماس با ما',
    description: 'با تیم پشتیبانی زوفیرا در تماس باشید',
    url: '/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
