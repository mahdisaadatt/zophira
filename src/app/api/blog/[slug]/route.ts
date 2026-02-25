import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';

type Params = Promise<{ slug: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { slug } = await params;
  try {
    const post = await db.blogPost.findUnique({
      where: {
        slug,
        isPublished: true,
        status: 'PUBLISHED',
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
        comments: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true,
              },
            },
            replies: {
              where: { isApproved: true },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!post) {
      return notFound();
    }

    return successResponse({
      post,
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return errorResponse('خطا در دریافت مطلب');
  }
}
