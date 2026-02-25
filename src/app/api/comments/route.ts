import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse, errorResponse, validationErrorResponse } from '../../../lib/api-response'
import { commentCreateSchema } from '../../../lib/validations'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasProfanity } from '@/lib/profanity'

// profanity utils moved to '@/lib/profanity'

// GET /api/comments - Get comments for a product or blog post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const blogPostId = searchParams.get('blogPostId')
    const parentId = searchParams.get('parentId')
    
    if (!productId && !blogPostId) {
      return errorResponse('Either productId or blogPostId is required', 400)
    }

    const where: any = {
      isApproved: true,
      parentId: parentId || null, // Get top-level comments if no parentId
    }

    if (productId) {
      where.productId = productId
    } else if (blogPostId) {
      where.blogPostId = blogPostId
    }

    const comments = await db.comment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        },
        replies: {
          where: { isApproved: true },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                image: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return successResponse(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return errorResponse('Failed to fetch comments', 500)
  }
}

// POST /api/comments - Create a new comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received comment data:', body)
    
    // Validate input
    const result = commentCreateSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation failed:', result.error.issues)
      const errors: Record<string, string[]> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path.join('.')
        if (!errors[field]) errors[field] = []
        errors[field].push(issue.message)
      })
      return validationErrorResponse(errors)
    }

    const { content, rating, userId, productId, blogPostId, parentId } = result.data
    console.log('Parsed data:', { content, rating, userId, productId, blogPostId, parentId })

    // Profanity check
    if (hasProfanity(content)) {
      return errorResponse('متن شامل کلمات نامناسب است. لطفاً متن را اصلاح کنید.', 400)
    }

    // Verify that either productId or blogPostId is provided
    if (!productId && !blogPostId) {
      return errorResponse('Either productId or blogPostId is required', 400)
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return errorResponse('User not found', 404)
    }

    // If productId is provided, verify product exists
    if (productId) {
      const product = await db.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        return errorResponse('Product not found', 404)
      }
    }

    // If blogPostId is provided, verify blog post exists
    if (blogPostId) {
      const blogPost = await db.blogPost.findUnique({
        where: { id: blogPostId }
      })

      if (!blogPost) {
        return errorResponse('Blog post not found', 404)
      }
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await db.comment.findUnique({
        where: { id: parentId }
      })

      if (!parentComment) {
        return errorResponse('Parent comment not found', 404)
      }
    }

    // Create comment
    console.log('Creating comment with data:', {
      content,
      rating: rating || 5,
      userId,
      productId,
      blogPostId,
      parentId,
      isApproved: true
    })
    
    const comment = await db.comment.create({
      data: {
        content,
        rating: rating || 5, // Default to 5 stars if not provided
        userId,
        productId,
        blogPostId,
        parentId,
        isApproved: true // Auto-approve for now, can add moderation later
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        }
      }
    })

    console.log('Comment created successfully:', comment)
    return successResponse(comment, 'Comment created successfully')
  } catch (error: any) {
    console.error('Error creating comment:', error)
    console.error('Error details:', error?.message)
    console.error('Error stack:', error?.stack)
    return errorResponse(`Failed to create comment: ${error?.message || 'Unknown error'}`, 500)
  }
}

// PUT /api/comments - Update a comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { commentId, content, userId } = body

    if (!commentId || !content || !userId) {
      return errorResponse('Comment ID, content, and user ID are required', 400)
    }

    // Find the comment and verify ownership
    const existingComment = await db.comment.findUnique({
      where: { id: commentId }
    })

    if (!existingComment) {
      return errorResponse('Comment not found', 404)
    }

    if (existingComment.userId !== userId) {
      return errorResponse('You can only edit your own comments', 403)
    }

    // Update comment
    const updatedComment = await db.comment.update({
      where: { id: commentId },
      data: {
        content,
        isEdited: true
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true
          }
        }
      }
    })

    return successResponse(updatedComment, 'Comment updated successfully')
  } catch (error) {
    console.error('Error updating comment:', error)
    return errorResponse('Failed to update comment', 500)
  }
}

// DELETE /api/comments - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')
    
    if (!commentId) {
      return errorResponse('Comment ID is required', 400)
    }

    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return errorResponse('Unauthorized', 401)
    }

    // Find the comment and verify ownership
    const existingComment = await db.comment.findUnique({
      where: { id: commentId }
    })

    if (!existingComment) {
      return errorResponse('Comment not found', 404)
    }

    const isAdmin = session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN'
    const isOwner = existingComment.userId === session.user.id
    if (!isAdmin && !isOwner) {
      return errorResponse('شما مجاز به حذف این نظر نیستید', 403)
    }

    // Delete comment and all its replies
    await db.comment.delete({
      where: { id: commentId }
    })

    return successResponse(null, 'Comment deleted successfully')
  } catch (error) {
    console.error('Error deleting comment:', error)
    return errorResponse('Failed to delete comment', 500)
  }
}
