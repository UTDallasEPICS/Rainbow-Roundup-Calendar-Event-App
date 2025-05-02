import { PrismaClient } from "@prisma/client"
//const prisma = new PrismaClient()

export default defineEventHandler(async event => {
    //event.context.prisma = prisma // every event will have access to the prisma client through this
    // auth = some useauth function
    // event.context.user = await event.context.prisma.user.findFirst({
    // where: {email: auth.email}
    // })
    // if no user, redirect to sign up page
    // if there is a user, we return 200 
    //
    return {
        
    }
})