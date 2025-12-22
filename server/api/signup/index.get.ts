//import SignUp from "~/pages/signUp.vue";
import { User } from "@prisma/client";
import { auth } from "~/server/auth";

export default defineEventHandler(async (event) =>{
    const prisma = event.context.prisma;
    const session = await auth.api.getSession({
            headers:  event.headers
        })
    const user = session?.user as User | undefined;
    try{
        const SignUps = await prisma.signUp.findMany({
            include: {
                User: true,
                Event: true
            }
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