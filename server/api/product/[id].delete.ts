import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return { success: false, error: 'Product ID is required.' }
  }

  // ensure it exists
  const existing = await prisma.product.findUnique({ where: { id } })
  if (!existing) {
    setResponseStatus(event, 404)
    return { 
      success: false, 
      error: 'Product not found.' }
  }

  try {
     // get all itemConfig IDs for this product
     const itemConfigs = await prisma.itemConfig.findMany({
      where: { productId: id },
      select: { id: true },
    })
    const itemConfigIds = itemConfigs.map(c => c.id)

    // get order IDs tied to these configs (before deleting orderItems)
    const orderItems = await prisma.orderItem.findMany({
      where: { itemConfigId: { in: itemConfigIds } },
      select: { orderId: true },
    })
    const affectedOrderIds = Array.from(new Set(orderItems.map(o => o.orderId)))
    // delete cart items
    await prisma.cartItem.deleteMany({where: { itemConfigId: { in: itemConfigIds } }})
    // delete order items
    await prisma.orderItem.deleteMany({where: { itemConfigId: { in: itemConfigIds } }})
    // delete item photos
    await prisma.itemPhoto.deleteMany({where: { itemConfigId: { in: itemConfigIds } }})
    // delete itemConfigs
    await prisma.itemConfig.deleteMany({where: { productId: id }})

    // clean up ONLY orders that are now empty due to this product deletion
    for (const orderId of affectedOrderIds) {
      const remaining = await prisma.orderItem.count({ where: { orderId } })
      if (remaining === 0) {
        await prisma.order.delete({ where: { id: orderId } })
      }
    }

    // delete the product itself
    await prisma.product.delete({ where: { id } })

    setResponseStatus(event, 200)
    return { 
      success: true, 
      message: 'Product deleted successfully.',
      product: existing
    }
  } catch (err) {
    setResponseStatus(event, 500)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred.',
    }
  }
})
