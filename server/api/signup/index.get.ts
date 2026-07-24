import type { User } from "@prisma/client";
//import SignUp from "~/pages/signUp.vue";
import { auth } from "~/server/auth";

export default defineEventHandler(async (event) =>{
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
            headers:  event.headers
        })
    const user = session?.user as User | undefined;
    try{

        // check user level
        const session = await auth.api.getSession({
                headers:  event.headers
        })
        const user = session?.user as User | undefined;
        // if user level too low, only include user name (no email etcetc)

        let includeSettings = {}

        if (!user || (!["SUPER", "ADMIN"].includes(user.role))) {
            includeSettings = { Event: true, User: {
                select: {
                id: true,
                firstname: true,
                lastname: true,
                profilePic: true
                }
            } }
        }
        else {
            includeSettings = { Event: true, User: true };
        }

        const SignUps = await prisma.signUp.findMany({
            include: includeSettings
        })
        setResponseStatus(event, 200)
        SignUps.forEach(signup => {
            if (!(user?.role === "SUPER" || user?.role === "ADMIN")){
            signup.plusOneAdults = signup.plusOneAdults + signup.plusOneKids
            signup.plusOneKids = 0
        }
        //console.log(signup)
        })
        
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
