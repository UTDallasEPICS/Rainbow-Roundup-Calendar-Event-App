import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) =>{
    const prisma = event.context.prisma;
    try{
        const SignUps = await prisma.signUp.findMany({
            include: {
                User: true,
                Event: true
            }
        })
        setResponseStatus(event, 200)
        return SignUps;
    } catch (error) {
        setResponseStatus(event, 500);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
            success: false,
            error: `Error fetching signups: ${errorMessage}`,
        };
    }
})