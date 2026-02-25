import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | ورود به حساب کاربری',
  description: 'ورود به حساب کاربری زوفیرا',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
