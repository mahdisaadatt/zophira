import { notFound } from 'next/navigation';
import Image from 'next/image';
import { User } from 'lucide-react';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { Comments } from '@/components/Comments';
import { ProgressBar } from '@/components/ProgressBar';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: true,
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    return {
      title: 'مقاله یافت نشد',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const description =
    post.excerpt ||
    post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';
  const imageUrl = post.featuredImage || '/og-image.jpg';
  const authorName =
    post.author?.firstName && post.author?.lastName
      ? `${post.author.firstName} ${post.author.lastName}`
      : post.author?.firstName || 'زوفیرا';

  return {
    title: `زوفیرا | ${post.title}`,
    description,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: `زوفیرا | ${post.title}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [authorName],
      tags: post.tags ? [post.tags] : undefined,
      url: `${baseUrl}/blog/${slug}`,
      siteName: 'Zophira',
      locale: 'fa_IR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `زوفیرا | ${post.title}`,
      description,
      images: [imageUrl],
    },
    keywords: post.tags || undefined,
    authors: [{ name: authorName }],
  };
}

type Params = Promise<{ slug: string }>;
export default async function BlogPostPage({ params }: { params: Params }) {
  const session = await getSession();
  const post = await db.blogPost.findUnique({
    where: { slug: (await params).slug },
    include: {
      author: true,
    },
  });

  if (!post || post.status !== 'PUBLISHED') {
    notFound();
  }

  // Calculate reading time
  const plainContent = post.content.replace(/<[^>]*>/g, '');
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.ceil(wordCount / 200);

  return (
    <>
      <ProgressBar />
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <article className="mx-auto">
          {/* Hero Image */}
          <div className="relative w-full h-[400px] mb-8">
            <Image
              src={post.featuredImage || '/images/placeholder.jpg'}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <User width={32} height={32} className="rounded-full" />
                <span>
                  {post.author.firstName} {post.author.lastName}
                </span>
              </div>
              <span>•</span>
              <time>
                {new Date(post.createdAt).toLocaleDateString('fa-IR')}
              </time>
              <span>•</span>
              <span>{readTimeMinutes} دقیقه مطالعه</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(Array.isArray(post.tags)
                ? post.tags
                : post.tags.split(',')
              ).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Comments Section */}
        <section className="mt-16 mx-auto">
          <h2 className="text-2xl font-bold text-foreground/90 text-right mb-8">
            نظرات
          </h2>
          <div className="p-8 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg ring-1 ring-primary/10">
            <Comments blogPostId={post.id} currentUserId={session?.user?.id} />
          </div>
        </section>
      </main>
    </>
  );
}
