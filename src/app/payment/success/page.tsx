import { Suspense } from 'react';
import PaymentSuccessContent from './content';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p>در حال بارگزاری...</p></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
