import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | سبد خرید',
  description: 'مشاهده محصولات انتخابی در سبد خرید زوفیرا',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
