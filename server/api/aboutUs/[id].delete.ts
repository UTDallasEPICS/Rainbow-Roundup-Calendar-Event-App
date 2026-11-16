import { defineEventHandler, setResponseStatus, getRouterParam, createError } from "h3";
import type { User } from "../../../types/session";
import { auth } from "~/server/auth"

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, "id");
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
      headers:  event.headers
    })
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
            error: "Team Member ID is required",
        };
    }

    try {
        const existingTeamMember = await prisma.leadershipTeam.findUnique({
            where: { id },
        });

        if (!existingTeamMember) {
            setResponseStatus(event, 404);
            return {
                error: "Team Member not found",
            };
        }

        // delete team member
        await prisma.leadershipTeam.delete({
            where: { id }
        })

        setResponseStatus(event, 200);
        return {
            message: "Team member deleted successfully",
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            error: errorMessage,
        };
    }
});
