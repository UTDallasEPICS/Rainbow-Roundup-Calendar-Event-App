import { PrismaClient } from '@prisma/client';
import { defineEventHandler, getRouterParam, setResponseStatus } from 'h3';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, 'id');

  if (!id) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: 'ItemConfig ID is required.',
    };
  }

  try {
    const existingItemConfig = await prisma.itemConfig.findUnique({
      where: { id },
    });

    if (!existingItemConfig) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: `No itemConfig found with ID: ${id}`,
      };
    }
    const orderItems = await prisma.orderItem.findMany({
      where: { itemConfigId: id },
      select: { orderId: true },
    })
    const affectedOrderIds = Array.from(new Set(orderItems.map(o => o.orderId))) //get affected orders
    await prisma.cartItem.deleteMany({where: { itemConfigId: id }}) //delete cart items
    await prisma.orderItem.deleteMany({where: { itemConfigId: id }}) //delete orderItems
    // delete any orders that now have no remaining orderItems
    for (const orderId of affectedOrderIds) {// delete orders where the number of order items has become 0
      const remaining = await prisma.orderItem.count({ where: { orderId } })
      if (remaining === 0) {
        await prisma.order.delete({ where: { id: orderId } })
      }
    }
    // delete photos referencing this config
    await prisma.itemPhoto.deleteMany({where: { itemConfigId: id }})
    await prisma.itemConfig.delete({where: { id }});

    setResponseStatus(event, 200);
    return {
      success: true,
      message: 'ItemConfig deleted successfully',
      itemConfig: existingItemConfig,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error deleting itemConfig: ${errorMessage}`,
    };
  }
});
