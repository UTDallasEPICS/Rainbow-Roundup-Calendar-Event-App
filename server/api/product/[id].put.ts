import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  // Access the dynamic route parameters to get the event ID
  const id = getRouterParam(event, 'id'); // Extract the ID from the dynamic route
  
  if (!id) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: 'Product ID is required.',
    };
  }

  // Read the body to get the data to update
  const body = await readBody(event);

  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      setResponseStatus(event, 404);
      return {
        success: false,
        error: `No product found with ID: ${id}`,
      };
    }

    const updateData: any = {};
    if (body.name != null) updateData.name = body.name;
    if (body.description != null) updateData.description = body.description;
    if (body.thumbnail != null) updateData.thumbnail = body.thumbnail;

    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    setResponseStatus(event, 200);
    return {
      success: true,
      product: updatedProduct,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error updating product: ${errorMessage}`,
    };
  }
});
