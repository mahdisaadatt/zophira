import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    const products = await db.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            shortDescription: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ],
        isActive: true,
        status: 'ACTIVE'
      },
      include: {
        images: {
          take: 1,
          orderBy: {
            id: 'asc'
          }
        }
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedProducts = products.map(product => {
      const mainImage = product.images[0];
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.shortDescription || product.description || '',
        price: product.price.toString(),
        imageUrl: mainImage ? mainImage.url : '/images/placeholder.jpg'
      };
    });

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'خطا در جستجوی محصولات' }, { status: 500 });
  }
}
