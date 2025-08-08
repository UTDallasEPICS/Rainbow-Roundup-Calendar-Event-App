import { defineEventHandler, setResponseStatus, getRouterParam, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const prisma = event.context.prisma;
    const session = await getServerSession(event);
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
            await prisma.item.update({
                where: { id },
                data: { name: body.name },
            });
        }

        if (Array.isArray(body.finishedItems)) {
            await prisma.finishedItem.deleteMany({
                where: { itemId: id },
            });

            await Promise.all(
                body.finishedItems.map(async (fi: Record<string, any>) => {
                    const quantity = Number(fi.quantity);
                    const size = fi.size;
                    const price = parseFloat(fi.price);

                    if (!quantity || !size || !price) {
                        throw createError({
                            statusCode: 400,
                            statusMessage: "Each finishedItem must include quantity, size, and price",
                        });
                    }

                    if (!["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].includes(size)) {
                        throw createError({
                            statusCode: 400,
                            statusMessage: "Invalid size. Valid sizes: XXS, XS, S, M, L, XL, XXL, XXXL",
                        });
                    }

                    await prisma.finishedItem.create({
                        data: {
                            quantity,
                            size,
                            price,
                            itemId: id,
                        },
                    });
                })
            );
        }

        const updatedItem = await prisma.item.findUnique({
            where: { id },
            include: { FinishedItems: true },
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
