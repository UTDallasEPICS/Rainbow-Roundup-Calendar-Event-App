import { PrismaClient } from '@prisma/client'
import { defineEventHandler, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma

  try {
    const products = await prisma.product.findMany({
      include: {
        ItemConfigs: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    setResponseStatus(event, 200)
    return {
      success: true,
      products: products
    }
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      success: false,
      error: `Error fetching product(s): ${errorMessage}`
    }
  }
})