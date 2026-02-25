import { useState, useEffect } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    image: string;
  };
  createdAt: string;
  comments: { id: string }[];
  status: 'DRAFT' | 'PUBLISHED';
  isPublished: boolean;
  isFeatured: boolean;
  tags: string | null;
}

interface UseBlogsParams {
  limit?: number;
  offset?: number;
  featured?: boolean;
}

export function useBlogs({ limit = 10, offset = 0, featured = false }: UseBlogsParams = {}) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
          featured: featured.toString(),
          published: 'true',
        });

        const response = await fetch(`/api/blog?${params}`);
        if (!response.ok) {
          throw new Error('خطا در دریافت پست‌های بلاگ');
        }

        const data = await response.json();
        if (!data.data) {
          throw new Error('داده‌های بلاگ در فرمت نامعتبر دریافت شد');
        }
        setPosts(data.data);
        setTotalPosts(data.data.length);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'خطا در دریافت پست‌های بلاگ');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, offset, featured]);

  return {
    posts,
    loading,
    error,
    totalPosts,
  };
}
