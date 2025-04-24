import { PrismaClient } from "@prisma/client"
//const prisma = new PrismaClient()

export default defineEventHandler(async event => {
    //event.context.prisma = prisma // every event will have access to the prisma client through this
})