import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ChevronRight,
  Percent,
  CheckCircle2,
  ShieldCheck,
  Award,
  Globe2,
  Package,
  MessageSquare,
} from 'lucide-react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Comments } from '@/components/Comments';
import { formatPrice } from '@/lib/utils';
import ProductClientInteractions from '@/components/ProductClientInteractions';
import SimilarProductsSlider from '@/components/SimilarProductsSlider';
import StarRating from '@/components/StarRating';
import { Metadata } from 'next';
import ProductImageGallery from '@/components/ProductImageGallery';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    select: {
      name: true,
      description: true,
      shortDescription: true,
      content: true,
      images: { select: { url: true }, take: 1 },
      brand: { select: { name: true } },
    },
  });

  if (!product) {
    return {
      title: 'محصول یافت نشد',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ).replace(/\/+$/, '');
  const imageUrl = product.images[0]?.url || '/og-image.jpg';
  const brandName = product.brand?.name || '';

  return {
    title: `زوفیرا | ${product.name} ${brandName ? `- ${brandName}` : ''}`,
    description:
      product.description ||
      `خرید ${product.name} از فروشگاه زوفیرا با بهترین قیمت و کیفیت`,
    alternates: {
      canonical: `${baseUrl}/products/${slug}`,
    },
    openGraph: {
      title: `زوفیرا | ${product.name} ${brandName ? `- ${brandName}` : ''}`,
      description: product.description || '',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: 'website',
      url: `${baseUrl}/products/${slug}`,
      siteName: 'Zophira',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `زوفیرا | ${product.name} ${brandName ? `- ${brandName}` : ''}`,
      description: product.description || '',
      images: [imageUrl],
    },
  };
}

type Params = Promise<{ slug: string }>;

export default async function ProductPage({ params }: { params: Params }) {
  const session = await getSession();
  const { slug } = await params;

  // Fetch product with all necessary data
  const product = await db.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
  });

  // Fetch similar products (same category, different product)
  const similarProducts = product
    ? await db.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          isActive: true,
        },
        include: {
          brand: true,
          images: {
            take: 1,
            orderBy: {
              sortOrder: 'asc',
            },
          },
        },
        take: 8, // Get up to 8 similar products
        orderBy: {
          rating: 'desc',
        },
      })
    : [];

  // Count approved comments for this product (for the UI counter next to rating)
  const approvedCommentsCount = product
    ? await db.comment.count({
        where: { productId: product.id, isApproved: true },
      })
    : 0;

  if (!product) {
    notFound();
  }

  const serializableProduct = {
    id: product.id,
    name: product.name,
    price: product.price.toNumber(),
    comparePrice: product.comparePrice?.toNumber(),
    rating: product.rating,
    inventory: product.quantity, // Map quantity to inventory
    images: product.images.map(image => image.url),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div className="absolute" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center gap-2 text-sm text-foreground/70">
              <Link
                href="/products"
                className="hover:text-primary transition-colors"
              >
                محصولات
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground/90">{product.name}</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Gallery with Hover Zoom */}
            <ProductImageGallery
              images={product.images.map(img => img.url)}
              name={product.name}
            />

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div className="space-y-6">
                <div className="space-y-3 text-right">
                  <h1 className="text-4xl font-bold bg-clip-text from-primary/90 to-foreground">
                    {product.name}
                  </h1>
                  <div className="mt-2 flex items-center gap-3">
                    <StarRating rating={product.rating} />
                    <Link
                      href="#comments"
                      className="inline-flex items-center gap-1.5 text-xs text-foreground/60 hover:text-primary hover:underline decoration-dotted underline-offset-4 transition-colors"
                      prefetch={false}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{approvedCommentsCount} نظر</span>
                    </Link>
                  </div>
                  {product.comparePrice &&
                    product.comparePrice.gt(product.price) && (
                      <div className="mb-2 mt-8">
                        <span className="inline-flex items-center gap-1 rounded-md bg-red-600 text-white text-xs font-bold px-2 py-1 shadow-sm">
                          <Percent className="w-3.5 h-3.5" />
                          {`٪${Math.max(
                            1,
                            Math.round(
                              (1 -
                                product.price.toNumber() /
                                  (product.comparePrice?.toNumber() || 1)) *
                                100
                            )
                          )}`}{' '}
                          تخفیف
                        </span>
                      </div>
                    )}

                  <div className="flex items-center gap-x-4">
                    {product.comparePrice &&
                    product.comparePrice.gt(product.price) ? (
                      <>
                        <p className="text-3xl font-bold text-primary">
                          {formatPrice(product.price.toNumber())} تومان
                        </p>
                        <p className="text-xl font-medium text-gray-500 line-through">
                          {formatPrice(product.comparePrice.toNumber())} تومان
                        </p>
                      </>
                    ) : (
                      <p className="text-3xl font-bold text-primary">
                        {formatPrice(product.price.toNumber())} تومان
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <ul className="mt-3 flex flex-col gap-2 list-none">
                    <li className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-primary/10 bg-background/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
                      <span className="text-foreground/80">
                        کیفیت و اثربخشی عالی
                      </span>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-110">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </span>
                    </li>
                    <li className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-primary/10 bg-background/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
                      <span className="text-foreground/80">
                        سفید کننده براق
                      </span>
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-110">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                      </span>
                    </li>
                    {product.certificates && (
                      <li className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-primary/10 bg-background/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
                        <span className="text-foreground/80">
                          دارای گواهینامه‌های معتبر
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-110">
                          <Award className="w-4 h-4 text-primary" />
                        </span>
                      </li>
                    )}
                    {product.countryOfOrigin && (
                      <li className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-primary/10 bg-background/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
                        <span className="text-foreground/80">
                          ساخت {product.countryOfOrigin}
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-110">
                          <Globe2 className="w-4 h-4 text-primary" />
                        </span>
                      </li>
                    )}
                    {product.packaging && (
                      <li className="group flex items-center justify-between gap-3 p-3 rounded-xl border border-primary/10 bg-background/70 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/20">
                        <span className="text-foreground/80">
                          بسته‌بندی {product.packaging}
                        </span>
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 ring-1 ring-primary/20 transition-transform duration-200 group-hover:scale-110">
                          <Package className="w-4 h-4 text-primary" />
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                <ProductClientInteractions product={serializableProduct} />
              </div>

              {/* Additional Info */}
              <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                  <p className="text-sm text-foreground/70">ارسال سریع</p>
                  <p className="text-lg font-medium mt-1 text-foreground">
                    سراسر کشور
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                  <p className="text-sm text-foreground/70">تضمین اصالت</p>
                  <p className="text-lg font-medium mt-1 text-foreground">
                    ۱۰۰٪ اورجینال
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10 hover:ring-primary/20 transition-all duration-300">
                  <p className="text-sm text-foreground/70">پشتیبانی</p>
                  <p className="text-lg font-medium mt-1 text-foreground">
                    ۲۴/۷
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Introduction Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-foreground/90 text-right mb-8">
              معرفی محصول
            </h2>
            <div className="p-8 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10">
              <div className="prose prose-xl text-foreground/80 text-right max-w-none">
                {product.content ? (
                  <div
                    className="leading-relaxed mb-6 text-lg"
                    dangerouslySetInnerHTML={{ __html: product.content }}
                  />
                ) : (
                  <p className="leading-relaxed mb-6 text-lg">
                    این محصول با کیفیت بالا و استانداردهای بین‌المللی تولید شده
                    است.
                  </p>
                )}

                {/* Usage Instructions */}
                {product.usage && (
                  <div className="mt-6 p-6 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-semibold text-foreground mb-3 text-right text-lg">
                      نحوه استفاده:
                    </h4>
                    <p className="text-foreground/70 text-right leading-relaxed">
                      {product.usage}
                    </p>
                  </div>
                )}

                {/* Warnings */}
                {product.warnings && (
                  <div className="mt-6 p-6 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-3 text-right text-lg">
                      هشدارها:
                    </h4>
                    <p className="text-yellow-700 text-right leading-relaxed">
                      {product.warnings}
                    </p>
                  </div>
                )}

                {/* Key Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 justify-end p-4 rounded-lg bg-primary/5">
                    <span className="text-foreground/70">
                      مناسب برای استفاده روزانه
                    </span>
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                  </div>
                  {product.certificates && (
                    <div className="flex items-center gap-3 justify-end p-4 rounded-lg bg-primary/5">
                      <span className="text-foreground/70">
                        دارای گواهینامه‌های معتبر
                      </span>
                      <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 justify-end p-4 rounded-lg bg-primary/5">
                    <span className="text-foreground/70">کیفیت پریمیوم</span>
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                  </div>
                  <div className="flex items-center gap-3 justify-end p-4 rounded-lg bg-primary/5">
                    <span className="text-foreground/70">
                      استاندارد بین‌المللی
                    </span>
                    <div className="w-3 h-3 rounded-full bg-primary/60"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Specifications Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground text-right mb-8">
              مشخصات
            </h2>
            <div className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
              <table className="w-full">
                <tbody>
                  {product.brand && (
                    <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        برند
                      </td>
                      <td className="py-4 px-6 text-foreground/80">
                        {product.brand.name}
                      </td>
                    </tr>
                  )}

                  {product.countryOfOrigin && (
                    <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        کشور سازنده
                      </td>
                      <td className="py-4 px-6 text-foreground/80">
                        {product.countryOfOrigin}
                      </td>
                    </tr>
                  )}

                  {product.volume && (
                    <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        حجم
                      </td>
                      <td className="py-4 px-6 text-foreground/80">
                        {product.volume}
                      </td>
                    </tr>
                  )}

                  {product.expiryPeriod && (
                    <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        مدت انقضا
                      </td>
                      <td className="py-4 px-6 text-foreground/80">
                        {product.expiryPeriod}
                      </td>
                    </tr>
                  )}

                  {product.packaging && (
                    <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        نوع بسته‌بندی
                      </td>
                      <td className="py-4 px-6 text-foreground/80">
                        {product.packaging}
                      </td>
                    </tr>
                  )}

                  {product.certificates && (
                    <tr className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        گواهینامه‌ها
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(product.certificates).map(
                            (cert: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md border border-primary/20"
                              >
                                {cert}
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {product.ingredients && (
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-6 text-right font-medium text-foreground">
                        ترکیبات
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {JSON.parse(product.ingredients).map(
                            (ingredient: string, index: number) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-muted/50 text-foreground text-sm rounded-md"
                              >
                                {ingredient}
                              </span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Similar Products Section */}
          <SimilarProductsSlider
            products={similarProducts.map(product => ({
              ...product,
              price: product.price.toNumber(),
              comparePrice: product.comparePrice?.toNumber() || null,
            }))}
          />

          {/* Comments Section */}
          <section id="comments" className="mt-24 scroll-mt-24">
            <h2 className="text-2xl font-bold text-foreground/90 text-right mb-8">
              نظرات کاربران
            </h2>
            <div className="p-8 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10">
              <Comments
                productId={product.id}
                currentUserId={session?.user?.id}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
