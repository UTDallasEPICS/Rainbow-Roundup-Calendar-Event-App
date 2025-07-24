import { PrismaClient } from '@prisma/client'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma

  try {
    const itemConfigs = await prisma.itemConfig.findMany({
      include: {
        product: true,
        ItemPhotos: true
      },
      orderBy: {
        price: 'asc'
      }
    })

    if (!itemConfigs || itemConfigs.length === 0) {
      setResponseStatus(event, 200)
      return {
        success: false,
        error: 'No item configurations found'
      }
    }

    setResponseStatus(event, 200)
    return {
      success: true,
      itemConfigs: itemConfigs
    }
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      success: false,
      error: `Error fetching item configurations: ${errorMessage}`
    }
  }
})
