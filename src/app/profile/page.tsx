import ProfileClientPage from '@/components/profile/ProfileClientPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | پروفایل کاربری',
  description: 'مدیریت حساب کاربری و مشاهده سفارشات',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClientPage />;
}
