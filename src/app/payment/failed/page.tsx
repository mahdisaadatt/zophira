import { Suspense } from 'react';
import PaymentFailedContent from './content';

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div className="flex-grow flex items-center justify-center"><p>در حال بارگزاری...</p></div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}
