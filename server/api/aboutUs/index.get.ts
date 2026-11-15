import { defineEventHandler, setResponseStatus, createError } from "h3";

export default defineEventHandler(async (event) => {
    const prisma = event.context.prisma;
    
    try {
        const people = await prisma.leadershipTeam.findMany();

        setResponseStatus(event, 200);
        return {
            data: people,
        };
        
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        setResponseStatus(event, 500);
        return {
            error: errorMessage,
        };
    }
});
