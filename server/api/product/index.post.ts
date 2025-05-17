import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;

  try {    
    const newProduct = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description,
        thumbnail: body.thumbnail
      },
    });

    setResponseStatus(event, 200)
    return {
      success: true,
      product: newProduct,
    };
  } catch (error) {
    setResponseStatus(event, 500)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      success: false,
      error: `Error creating product: ${errorMessage}`,
    };
  }
});