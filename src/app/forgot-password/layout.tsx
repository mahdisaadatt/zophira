import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | فراموشی رمز عبور',
  description: 'فراموشی رمز عبور حساب کاربری زوفیرا',
  robots: {
    index: false,
    follow: true,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
