'use client';

import React from 'react';
import Link from 'next/link';
import { X, BadgePercent, ShieldCheck, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'topBannerDismissedAt';
const DISMISS_DAYS = 7; // hide banner for 7 days after dismiss

function isDismissedValid(ts: string | null) {
  if (!ts) return false;
  const t = Number(ts);
  if (Number.isNaN(t)) return false;
  const diff = Date.now() - t;
  return diff < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export default function TopBanner() {
  const [hidden, setHidden] = React.useState(true);
  const [remaining, setRemaining] = React.useState<string>('');

  React.useEffect(() => {
    // read once on mount (client-only)
    try {
      const stored =
        typeof window !== 'undefined'
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      setHidden(isDismissedValid(stored));
    } catch {
      setHidden(false);
    }
  }, []);

  React.useEffect(() => {
    const format = (ms: number) => {
      if (ms < 0) ms = 0;
      const totalSeconds = Math.floor(ms / 1000);
      const h = Math.floor(totalSeconds / 3600)
        .toString()
        .padStart(2, '0');
      const m = Math.floor((totalSeconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
      const s = Math.floor(totalSeconds % 60)
        .toString()
        .padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    const computeNextMidnight = () => {
      const now = new Date();
      const next = new Date(now);
      // set to local midnight of upcoming day
      next.setHours(24, 0, 0, 0);
      return next.getTime() - now.getTime();
    };

    // initialize immediately
    setRemaining(format(computeNextMidnight()));

    const id = window.setInterval(() => {
      setRemaining(format(computeNextMidnight()));
    }, 1000);

    return () => window.clearInterval(id);
  }, []);

  const handleClose = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
    } catch {}
    setHidden(true);
  };

  if (hidden) return null;

  return (
    <div className="w-full bg-gradient-to-l from-sky-600 via-cyan-600 to-teal-600 text-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex flex-col items-center justify-center gap-2 py-1.5 text-xs sm:flex-row sm:justify-between sm:gap-3 sm:py-2 sm:text-sm lg:text-base lg:py-2.5">
          <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-right">
            <BadgePercent className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <p className="leading-tight">
              کد تخفیف اولین خرید :
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard?.writeText('first');
                    toast.success('کد تخفیف کپی شد');
                  } catch (e) {
                    toast.error('خطا در کپی کردن کد');
                  }
                }}
                className="align-middle mr-2 inline-flex items-center rounded-md bg-white/20 px-2 py-0.5 text-[11px] sm:text-xs lg:text-sm font-semibold tracking-wide text-white hover:bg-white/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="کپی کد تخفیف first"
                title="کلیک برای کپی"
              >
                first
              </button>{' '}
              — تا پایان امروز: <span dir="ltr">{remaining || '...'}</span>
            </p>
            <span className="hidden items-center gap-1 text-[11px] opacity-90 sm:flex">
              <ShieldCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> پرداخت امن
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm ring-1 ring-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md hover:translate-y-[0.5px] sm:text-xs"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              خرید کن
            </Link>
            <button
              type="button"
              aria-label="بستن اعلان"
              onClick={handleClose}
              className="inline-flex rounded-md p-1 hover:bg-white/10 focus:outline-none"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
