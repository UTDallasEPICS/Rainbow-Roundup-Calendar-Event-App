

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const body = await readBody(event);
  const ids = body.ids;
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    !ids.every((id) => typeof id === "string")
  ) {
    throw createError({
      statusCode: 400,
      statusMessage:
        "Invalid or missing 'ids'. Expected non-empty array of strings.",
    });
  }

  const users = await prisma.user.findMany({
    where: {
      id: { in: ids },
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
      email: true,
      profilePic: true,
    },
  });

  return users;
});
