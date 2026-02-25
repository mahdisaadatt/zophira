'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { fadeIn } from '@/animations';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, User, Tag } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const offset = (currentPage - 1) * POSTS_PER_PAGE;
  
  const { posts, loading, error, totalPosts } = useBlogs({
    limit: POSTS_PER_PAGE,
    offset,
  });

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            {[...Array(POSTS_PER_PAGE)].map((_, idx) => (
              <div key={idx} className="bg-muted rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !posts || posts.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-destructive mb-4">
            {error || 'هیچ پستی برای نمایش وجود ندارد'}
          </p>
          <Button onClick={() => setCurrentPage(1)}>تلاش مجدد</Button>
        </div>
      </div>
    );
  }

  const latestPost = posts[0];
  const otherPosts = posts.length > 1 ? posts.slice(1) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen container max-w-7xl mx-auto bg-background flex flex-col">
      <main className="flex-1">
        <div className="px-4 py-8 sm:py-12">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-12 font-IRANYekanXBold"
          >
            وبلاگ زوفیرا
          </motion.h1>

          {/* بخش آخرین پست - استایل Hero */}
          {latestPost && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-12 sm:mb-16"
            >
              <Link
                href={`/blog/${latestPost.slug}`}
                className="block group relative w-full h-[50vh] min-h-[400px] max-h-[550px] rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src={latestPost.featuredImage || '/images/placeholder.jpg'}
                  alt={latestPost.title}
                  fill
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 text-white">
                  <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold mb-4 inline-block">
                    آخرین مطلب
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-IRANYekanXBold mb-3 sm:mb-4 leading-tight drop-shadow-lg">
                    {latestPost.title}
                  </h2>
                  <p className="text-base sm:text-lg text-white/90 mb-5 line-clamp-2 max-w-3xl drop-shadow-md">
                    {latestPost.excerpt || 'توضیحات در دسترس نیست'}
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium text-white/80">
                    <div className="flex items-center gap-2">
                      {latestPost.author.image ? (
                        <Image
                          src={latestPost.author.image}
                          alt={`${latestPost.author.firstName} ${latestPost.author.lastName}`}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      <span>
                        {latestPost.author.firstName} {latestPost.author.lastName}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{new Date(latestPost.createdAt).toLocaleDateString('fa-IR')}</span>
                    {latestPost.tags && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4" />
                          <span>
                            {(() => {
                              try {
                                const tags = JSON.parse(latestPost.tags);
                                return Array.isArray(tags) ? tags[0] : latestPost.tags;
                              } catch {
                                return latestPost.tags;
                              }
                            })()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {otherPosts.length > 0 && (
            <>
              <div className="relative text-center mb-8 sm:mb-12">
                <hr className="border-border" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-lg font-semibold text-muted-foreground">
                  سایر مطالب
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {otherPosts.map((post, index) => (
                  <Link href={`/blog/${post.slug}`} key={post.id}>
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={fadeIn}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-[1.02] !cursor-pointer h-full"
                    >
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.featuredImage || '/images/placeholder.jpg'}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-IRANYekanXBold mb-2 sm:mb-3 leading-tight">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                          {post.excerpt || 'توضیحات در دسترس نیست'}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {post.author.image ? (
                              <Image
                                src={post.author.image}
                                alt={`${post.author.firstName} ${post.author.lastName}`}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            ) : (
                              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                            <span className="text-xs sm:text-sm font-IRANYekanXBold">
                              {post.author.firstName} {post.author.lastName}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground font-IRANYekanX">
                            {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                          </span>
                        </div>

                        {post.tags && (
                          <div className="flex flex-wrap gap-1.5">
                            {(() => {
                              try {
                                const tags = JSON.parse(post.tags);
                                return Array.isArray(tags) ? 
                                  tags.map((tag: string) => (
                                    <span
                                      key={tag}
                                      className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))
                                  : (
                                    <span className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">
                                      {post.tags}
                                    </span>
                                  );
                              } catch {
                                return (
                                  <span className="px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">
                                    {post.tags}
                                  </span>
                                );
                              }
                            })()}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <div className="mt-8 sm:mt-12 flex justify-center items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="!cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(index + 1)}
                    className="!cursor-pointer min-w-[2.5rem]"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="!cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;