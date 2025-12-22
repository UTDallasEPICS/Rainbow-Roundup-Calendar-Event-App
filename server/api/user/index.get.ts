import {  User } from "@prisma/client";
import { auth } from "~/server/auth";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const session = await auth.api.getSession({
                headers:  event.headers
            })
  const user = session?.user as User | undefined;
  try {
    const users = await prisma.user.findMany({
      where: {
        isBanned: false,
        isArchived: false,
      },
      include: {
        CreatedEvents: true,
        SignUps: true,
        Reports: true,
        PotentialOffenses: true,
      },
    });
    if(!(user?.role === "SUPER" || user?.role === "ADMIN")){
      users.forEach(iuser =>{
        iuser.email = "";
        iuser.phoneNum = "";
        iuser.role = "USER"
        iuser.emailNotif = false
        iuser.nativeNotif = false
        iuser.Reports = []
        iuser.CreatedEvents = []
        iuser.PotentialOffenses = []
        const epoch = new Date(0)
        iuser.createdAt = epoch
        iuser.updatedAt = epoch
        iuser.SignUps.forEach(signup =>{
          signup.plusOneAdults = signup.plusOneAdults + signup.plusOneKids
          signup.plusOneKids = 0
        })
      })
    }
    setResponseStatus(event, 200);
    return {
      success: true,
      Users: users,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error fetching users: ${errorMessage}`,
    };
  }
});
