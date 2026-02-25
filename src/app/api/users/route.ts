import { NextRequest } from 'next/server'
import { hash } from 'bcryptjs'
import { db } from '../../../lib/db'
import { successResponse, errorResponse, validationErrorResponse } from '../../../lib/api-response'
import { userRegistrationSchema } from '../../../lib/validations'

// POST /api/users - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = userRegistrationSchema.safeParse(body)
    if (!result.success) {
      const errors: Record<string, string[]> = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path.join('.')
        if (!errors[field]) errors[field] = []
        errors[field].push(issue.message)
      })
      return validationErrorResponse(errors)
    }

    const { email, password, firstName, lastName, phone } = result.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return errorResponse('User with this email already exists', 409)
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true
      }
    })

    return successResponse(user, 'User registered successfully')
  } catch (error) {
    console.error('Error registering user:', error)
    return errorResponse('Failed to register user', 500)
  }
}
