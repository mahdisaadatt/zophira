import { NextRequest } from 'next/server';
import { db } from '../../../lib/db';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
} from '../../../lib/api-response';
import { productCreateSchema } from '../../../lib/validations';
import { ZodError } from 'zod';

// GET /api/products - Get all products with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const dentalCategory = searchParams.get('dentalCategory');
    const ageGroup = searchParams.get('ageGroup');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured') === 'true';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isActive: true,
      status: 'ACTIVE',
    };

    if (category) {
      where.category = { slug: category };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (dentalCategory) {
      where.dentalCategory = dentalCategory;
    }

    if (ageGroup) {
      where.ageGroup = ageGroup;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (featured) {
      where.isFeatured = true;
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        include: {
          category: true,
          brand: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return successResponse({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse('Failed to fetch products', 500);
  }
}

// POST /api/products - Create new product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productCreateSchema.parse(body);

    const product = await db.product.create({
      data: {
        ...validatedData,
        // Prisma Decimal fields expect string input
        price: validatedData.price.toString(),
        comparePrice: validatedData.comparePrice?.toString(),
      },
      include: {
        category: true,
        brand: true,
        images: true,
      },
    });

    return successResponse(product, 'Product created successfully');
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors: Record<string, string[]> = {};
      error.issues.forEach(issue => {
        const fieldName = issue.path[0] as string;
        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = [];
        }
        formattedErrors[fieldName].push(issue.message);
      });
      return validationErrorResponse(formattedErrors);
    }
    console.error('Error creating product:', error);
    return errorResponse('Failed to create product', 500);
  }
}
