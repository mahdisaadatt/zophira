import { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
import { successResponse, errorResponse } from '../../../lib/api-response'

// GET /api/cart - Get user's cart
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return errorResponse('User ID is required', 400)
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: {
              take: 1,
              orderBy: { sortOrder: 'asc' }
            },
            brand: true
          }
        }
      }
    })

    const total = cartItems.reduce((sum: number, item: { product: { price: { toString: () => string } }, quantity: number }) => {
      return sum + (parseFloat(item.product.price.toString()) * item.quantity)
    }, 0)

    return successResponse({
      items: cartItems,
      total,
      itemCount: cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return errorResponse('Failed to fetch cart', 500)
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity = 1 } = await request.json()

    if (!userId || !productId) {
      return errorResponse('User ID and Product ID are required', 400)
    }

    // Check if product exists and is active
    const product = await db.product.findFirst({
      where: { 
        id: productId, 
        isActive: true,
        status: 'ACTIVE'
      }
    })

    if (!product) {
      return errorResponse('Product not found or unavailable', 404)
    }

    // Check stock
    if (product.trackQuantity && product.quantity < quantity) {
      return errorResponse('Insufficient stock', 400)
    }

    // Check if item already exists in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Update quantity
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          product: {
            include: {
              images: { take: 1 }
            }
          }
        }
      })
    } else {
      // Create new cart item
      cartItem = await db.cartItem.create({
        data: {
          userId,
          productId,
          quantity
        },
        include: {
          product: {
            include: {
              images: { take: 1 }
            }
          }
        }
      })
    }

    return successResponse(cartItem, 'Item added to cart')
  } catch (error) {
    console.error('Error adding to cart:', error)
    return errorResponse('Failed to add item to cart', 500)
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const productId = searchParams.get('productId')

    if (!userId || !productId) {
      return errorResponse('User ID and Product ID are required', 400)
    }

    await db.cartItem.delete({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    })

    return successResponse(null, 'Item removed from cart')
  } catch (error) {
    console.error('Error removing from cart:', error)
    return errorResponse('Failed to remove item from cart', 500)
  }
}
