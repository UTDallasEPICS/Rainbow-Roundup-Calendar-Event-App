import { PrismaClient } from '@prisma/client'
import { defineEventHandler, getRouterParam, readBody, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Missing ItemConfig ID.'
    }
  }

  const body = await readBody(event)

  if (body.price != null && body.price < 0) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Price cannot be negative.'
    }
  }

  if (body.stock != null && body.stock < 0) {
    setResponseStatus(event, 400)
    return {
      success: false,
      error: 'Stock cannot be negative.'
    }
  }

  try {
    const existingItemConfig = await prisma.itemConfig.findUnique({
      where: {
        id: id
      }
    })

    if (!existingItemConfig) {
      setResponseStatus(event, 404)
      return {
        success: false,
        error: `No itemConfig found with ID: ${id}`
      }
    }

    const updateData: any = {}
    if (body.productId != null) updateData.productId = body.productId
    if (body.price != null) updateData.price = body.price
    if (body.stock != null) updateData.stock = body.stock
    if (body.fit != null) updateData.fit = body.fit
    if (body.size != null) updateData.size = body.size

    const updatedItemConfig = await prisma.itemConfig.update({
      where: {
        id: id
      },
      data: updateData
    })

    return {
      success: true,
      itemConfig: updatedItemConfig
    }
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      success: false,
      error: `Error updating itemConfig: ${errorMessage}`
    }
  }
})
