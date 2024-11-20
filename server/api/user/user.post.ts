import { PrismaClient } from "@prisma/client";
import { H3Event, readBody } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody(event);

  const { email, password, firstname, lastname, phoneNum, profilePic } = body;

  // Validate required fields
  if (!email || !password || !firstname || !lastname) {
    return sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Missing required fields.",
      })
    );
  }

  try {
    // Create Person entry
    const newPerson = await prisma.person.create({
      data: {
        email,
        password, // Hash this before saving in production
        firstname,
        lastname,
        type: "User", // Specify type
      },
    });

    // Create User entry linked to Person
    const newUser = await prisma.user.create({
      data: {
        personId: newPerson.id,
        phoneNum,
        profilePic,
      },
    });

    return {
      message: "User created successfully.",
      user: newUser,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: "An error occurred while creating the user.",
      })
    );
  }
});
