import { Suspense } from 'react';
import ResetPasswordContent from './content';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'زوفیرا | رمز عبور جدید',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center">
          <p>در حال بارگزاری...</p>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
