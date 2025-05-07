import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";
import SignUp from "~/pages/signUp.vue";

export default defineEventHandler(async (event) => {
  const prisma = event.context.prisma;
  const id = getRouterParam(event, "id");

  try {
    if (id) {
      // Fetch a single signup by ID with relations if needed (e.g., Event or User)
      const singleSignup = await prisma.signUp.findUnique({
        where: { id },
        include: { Event: true, User: true }, // Include relations like event and user
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
