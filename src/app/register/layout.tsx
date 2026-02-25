import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | ثبت نام',
  description: 'ثبت نام در حساب کاربری زوفیرا',
  robots: {
    index: false,
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
