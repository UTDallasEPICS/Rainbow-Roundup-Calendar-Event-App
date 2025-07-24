import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const body = await readBody(event)

  if (!body.productId || !body.fit || !body.size || body.price == null || body.stock == null) {
    setResponseStatus(event, 400)
    return { success: false, error: 'Missing required fields' }
  }
  // Validate price
  if (body.price < 0) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Price cannot be negative'
    }
  }
  if (body.stock < 0) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Stock cannot be negative.'
    }
  }
  
  
  // Validate that the product exists
  const product = await prisma.product.findUnique({
    where: { id: body.productId }
  })
  
  if (!product) {
    setResponseStatus(event, 404)
    return {
      success: false,
      error: `No product found with ID: ${body.productId}`
    }
  }
  
  
  try {
    const itemConfig = await prisma.itemConfig.create({
      data: {
        productId: body.productId,
        price: body.price,
        stock: body.stock,
        fit: body.fit,
        size: body.size
      }
    })
    setResponseStatus(event, 200)
    return {
      success: true,
      itemConfig: itemConfig
    }
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      success: false,
      error: `Error creating itemConfig: ${errorMessage}`
    }
  }
})
