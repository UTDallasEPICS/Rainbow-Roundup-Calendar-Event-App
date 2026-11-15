import { defineEventHandler, setResponseStatus, createError, readBody } from "h3";
import type { User } from "../../../types/session";
import { auth } from "~/server/auth"

export default defineEventHandler(async (event) => {
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

    try {
        const body = await readBody(event);

        if (!body.name || !body.role || !body.description) {
            setResponseStatus(event, 400);
            return {
                error: "Request must include name, role and description fields",
            };
        }

        const newLeadershipTeamMember = await prisma.leadershipTeam.create({
            data: {
                name: body.name,
                role: body.role,
                description: body.description
            },
        });

        if (!newLeadershipTeamMember) {
            setResponseStatus(event, 500);
            return {
                error: "Creation of new leadership team member failed",
            };
        }
        
        setResponseStatus(event, 201);
        return newLeadershipTeamMember;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            error: errorMessage,
        };
    }
});
