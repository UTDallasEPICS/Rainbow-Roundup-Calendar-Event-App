
import { auth } from "~/server/auth";
import { defineEventHandler } from "h3";
import SignUp from "~/pages/signUp.vue";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, "id");

  try {

    if (id) {

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

      // Fetch a single signup by ID with relations if needed (e.g., Event or User)
        const singleSignup = await prisma.signUp.findUnique({
        where: { id },
        include: includeSettings, // Include relations like event and user
      });
      

      

      if (!singleSignup) {
        setResponseStatus(event, 404);
        return {
          success: false,
          error: `No signup found with ID: ${id}`,
        };
      }
      setResponseStatus(event, 200);
      return {
        success: true,
        SignUp: singleSignup,
      };
    } else {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: "include an ID in your query next time dipshit",
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      error: `Error fetching signups: ${errorMessage}`,
    };
  }
});
