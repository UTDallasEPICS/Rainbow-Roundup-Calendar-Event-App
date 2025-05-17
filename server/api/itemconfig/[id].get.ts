import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'include an ID in your query next time dipshit' //never gonna see this in actual use case
    }
  }

  try {
    const itemConfig = await prisma.itemConfig.findUnique({
      where: {
        id: id
      },
      include: {
        product: true,
        ItemPhotos: true
      }
    })

    if (!itemConfig) {
      setResponseStatus(event, 404)
      return {
        success: false,
        error: `No item configuration found with ID: ${id}`
      }
    }

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
      error: `Error fetching item configuration: ${errorMessage}`
    }
  }
})