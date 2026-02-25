import { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsContent from './content';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search as string;

  const baseTitle = 'زوفیرا | محصولات بهداشت دهان و دندان';
  const title = search ? `جستجو برای ${search}` : baseTitle;

  const baseDescription =
    'مجموعه کاملی از محصولات لوکس بهداشت دهان و دندان از برند معتبر ایتالیایی مارویس را در زوفیرا پیدا کنید.';
  const description = search
    ? `نتایج جستجو برای "${search}" در محصولات بهداشت دهان و دندان زوفیرا`
    : baseDescription;

  return {
    title,
    description,
    keywords: [
      'خمیردندان',
      'مسواک',
      'دهان شویه',
      'محصولات دندانپزشکی',
      'بهداشت دهان',
    ],
    alternates: {
      canonical: '/products',
    },
    openGraph: {
      title,
      description,
      url: '/products',
    },
  };
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center">
          <p>در حال بارگزاری...</p>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
