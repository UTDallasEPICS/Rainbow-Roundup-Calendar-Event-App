import { defineEventHandler, setResponseStatus, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { getServerSession } from "#auth";
import { Size } from "@prisma/client";

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

        if (!body.name || !body.price) {
            setResponseStatus(event, 400);
            return {
                success: false,
                error: "Request must include name and price fields",
            };
        }
        // if (!Array.isArray(body.itemVariants)) {
        //     setResponseStatus(event, 400);
        //     return {
        //         success: false,
        //         error: "itemVariants field must be an array",
        //     };
        // }

        const item = await prisma.abstractItem.create({
            data: {
                name: body.name,
                price: body.price,
                description: body.description,
            },
        });

        if (!item) {
            setResponseStatus(event, 500);
            return {
                success: false,
                error: "Item creation failed",
            };
        }

        // await Promise.all(
        //     body.itemVariants.map(async (itemVariant: Record<string, any>) => {
        //         const size = itemVariant.size;
        //         const price = parseFloat(itemVariant.price);
        //         if (!size || !price) {
        //             throw createError({
        //                 statusCode: 400,
        //                 statusMessage: "Request must include an array of itemVariants with size and price fields",
        //             });
        //         }
        //         if (!["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"].includes(size)) {
        //             throw createError({
        //                 statusCode: 400,
        //                 statusMessage: "Invalid size, valid sizes: XXS, XS, S, M, L, XL, XXL, XXXL",
        //             });
        //         }
        //         const finItem = await prisma.itemVariant.create({
        //             data: {
        //                 size,
        //                 itemId: item.id,
        //             },
        //         });
        //         if (!finItem) {
        //             throw createError({
        //                 statusCode: 500,
        //                 statusMessage: "Finished Item creation failed",
        //             });
        //         }
        //     })
        // );

        // creating variants XXS, XS, S, M, L, XL, XXL, XXXL
        const sizes: Size[] = [Size.XXS, Size.XS, Size.S, Size.M, Size.L, Size.XL, Size.XXL, Size.XXXL]
     
        for (let i = 0; i < sizes.length; i++)
        {
            await prisma.itemVariant.create({
                data: {
                    item: {
                        connect: { id: item.id }
                    },
                    size: sizes[i],
                    availability: false,
                }
            })
        }

        const updatedItem = await prisma.abstractItem.findUnique({
            where: { id: item.id },
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
