import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse, errorResponse, validationErrorResponse } from '../../../lib/api-response'
import { blogPostCreateSchema } from '../../../lib/validations'

// GET /api/blog - Get blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') === 'true'
    const featured = searchParams.get('featured') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (published) {
      where.isPublished = true
      where.status = 'PUBLISHED'
    }
    
    if (featured) {
      where.isFeatured = true
    }

    const blogPosts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        comments: {
          where: { 
            isApproved: true,
            parentId: null // Only count top-level comments
          },
          select: { id: true } // Just count them
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Add comment count to each post
    const postsWithCommentCount = blogPosts.map(post => ({
      ...post,
      commentCount: post.comments.length,
      comments: undefined // Remove the comments array, we only needed the count
    }))

    return successResponse(postsWithCommentCount)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return errorResponse('Failed to fetch blog posts', 500)
  }
}

// POST /api/blog - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = blogPostCreateSchema.safeParse(body)
    if (!result.success) {
      const errors: Record<string, string[]> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path.join('.')
        if (!errors[field]) errors[field] = []
        errors[field].push(issue.message)
      })
      return validationErrorResponse(errors)
    }

    const { authorId } = body // Get authorId from body since it's not in schema
    
    if (!authorId) {
      return errorResponse('Author ID is required', 400)
    }

    // Verify author exists
    const author = await db.user.findUnique({
      where: { id: authorId }
    })

    if (!author) {
      return errorResponse('Author not found', 404)
    }

    // Check if slug is unique
    const existingPost = await db.blogPost.findUnique({
      where: { slug: result.data.slug }
    })

    if (existingPost) {
      return errorResponse('A blog post with this slug already exists', 400)
    }

    // Create blog post
    const blogPost = await db.blogPost.create({
      data: {
        ...result.data,
        authorId,
        publishedAt: result.data.isPublished ? new Date() : null
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        }
      }
    })

    return successResponse(blogPost, 'Blog post created successfully')
  } catch (error) {
    console.error('Error creating blog post:', error)
    return errorResponse('Failed to create blog post', 500)
  }
}
