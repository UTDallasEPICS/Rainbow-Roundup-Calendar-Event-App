import { defineEventHandler, setResponseStatus, getRouterParam, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { authClient } from "~/server/auth"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const prisma = event.context.prisma;
    const { data: session } = await authClient.getSession();
    const user = session?.user as User | undefined;

    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    if (!id) {
        setResponseStatus(event, 400);
        return {
            success: false,
            error: "Item ID is required",
        };
    }

    try {
        const body = await readBody(event);

        if (body.name) {
            await prisma.abstractItem.update({
                where: { id },
                data: { name: body.name },
            });
        }

        if (Array.isArray(body.ItemVariants)) {
            await prisma.itemVariant.deleteMany({
                where: { itemId: id },
            });

            await Promise.all(
                body.itemVariants.map(async (fi: Record<string, any>) => {
                    const size = fi.size;
                    const price = parseFloat(fi.price);

                    if (!size || !price) {
                        throw createError({
                            statusCode: 400,
                            statusMessage: "Each itemVariant must include size and price",
                        });
                    }

                    if (!["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].includes(size)) {
                        throw createError({
                            statusCode: 400,
                            statusMessage: "Invalid size. Valid sizes: XXS, XS, S, M, L, XL, XXL, XXXL",
                        });
                    }

                    await prisma.itemVariant.create({
                        data: {
                            size,
                            price,
                            itemId: id,
                        },
                    });
                })
            );
        }

        const updatedItem = await prisma.abstractItem.findUnique({
            where: { id },
            include: { ItemVariants: true },
        });

        setResponseStatus(event, 200);
        return {
            success: true,
            data: updatedItem,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            success: false,
            error: errorMessage,
        };
    }
});
