import { defineEventHandler, setResponseStatus, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    const session = await getServerSession(event);
    const user = session?.user as User | undefined;

    if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
        throw createError({
            statusMessage: "Unauthenticated",
            statusCode: 403,
        });
    }

    try {
        const body = await readBody(event);

        if (!body.name || !body.finishedItems) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "Request must include name and finishedItems fields",
            };
        }
        if (!Array.isArray(body.finishedItems)) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "finishedItems field must be an array",
            };
        }

        const item = await prisma.item.create({
            data: {
                name: body.name,
            },
        });

        if (!item) {
            setResponseStatus(event, 500);
            return {
                success: false,
                error: "Item creation failed",
            };
        }

        await Promise.all(
            body.finishedItems.map(async (finishedItem: Record<string, any>) => {
                const quantity = Number(finishedItem.quantity);
                const size = finishedItem.size;
                const price = parseFloat(finishedItem.price);
                if (!quantity || !size || !price) {
                    throw createError({
                        statusCode: 400,
                        statusMessage: "Request must include an array of finishedItems with quantity, size, and price fields",
                    });
                }
                if (!["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].includes(size)) {
                    throw createError({
                        statusCode: 400,
                        statusMessage: "Invalid size, valid sizes: XXS, XS, S, M, L, XL, XXL, XXXL",
                    });
                }
                const finItem = await prisma.finishedItem.create({
                    data: {
                        quantity,
                        size,
                        price,
                        itemId: item.id,
                    },
                });
                if (!finItem) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: "Finished Item creation failed",
                    });
                }
            })
        );

        const updatedItem = await prisma.item.findUnique({
            where: { id: item.id },
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
