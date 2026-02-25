import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | تکمیل سفارش',
  description: 'تکمیل خرید محصولات بهداشت دهان و دندان از زوفیرا',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
