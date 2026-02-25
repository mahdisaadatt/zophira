'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import TopBanner from './TopBanner';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideLayout = ['/login', '/register', '/forgot-password', '/reset-password'].includes(pathname);

  return (
    <>
      {!hideLayout && (
        <header className="sticky top-0 z-50">
          <TopBanner />
          <Navbar />
        </header>
      )}
      <main className="min-h-screen flex flex-col">
        {children}
        <div id="portal-root" />
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}
