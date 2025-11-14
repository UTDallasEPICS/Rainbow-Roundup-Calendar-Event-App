/*
body should include:
    id
    name
    price
    description
    isArchived
    ItemVariants (array)
        size
        availability

    Only ItemVariants that are to be updated need to be in the array
*/

import { defineEventHandler, setResponseStatus, getRouterParam, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { authClient } from "~/server/auth"
import { Size } from "@prisma/client"

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
        const updateData: any = {};
        if (body.name) { updateData.name = body.name; }
        if (body.price) { updateData.price = body.price; }
        if (body.description) { updateData.description = body.description; }
        if (body.isArchived || body.isArchived == false) { updateData.isArchived = body.isArchived; }


        await prisma.abstractItem.update({
            where: { id },
            data: updateData,
        });

        // update item variants
        for (let i = 0; i < body.ItemVariants.length; i++)
        {
            let updateVariantData: any = {};
            if (body.ItemVariants[i].id)
            {
                if (body.ItemVariants[i].size) { updateVariantData.size = body.ItemVariants[i].size; }
                if (body.ItemVariants[i].availability != null) { updateVariantData.availability = body.ItemVariants[i].availability; }
                

                await prisma.itemVariant.update({
                    where: {
                        id: body.ItemVariants[i].id
                    },
                    data: updateVariantData
                })
            }
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
