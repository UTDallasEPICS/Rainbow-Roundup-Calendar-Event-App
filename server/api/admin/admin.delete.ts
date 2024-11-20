import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);

  if (!id) {
    throw createError({ statusCode: 400, message: 'Admin ID is required' });
  }

  try {
    await prisma.admin.delete({
      where: { id: String(id) },
    });
    return { message: 'Admin deleted successfully' };
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Failed to delete admin', data: error });
  }
});
