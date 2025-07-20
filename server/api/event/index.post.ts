import { PrismaClient } from "@prisma/client";
import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { getServerSession } from "#auth";
import { createTransport } from "nodemailer";
import type { User } from "../../../types/session";

const config = useRuntimeConfig();  // Access config for smtp

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const prisma = event.context.prisma;
  const session = await getServerSession(event);

  const user = session?.user as User | undefined;

  if (!user?.role || (user.role !== "SUPER" && user.role !== "ADMIN")) {
    throw createError({
      statusMessage: "Unauthenticated",
      statusCode: 403,
    });
  }

  // validate that event starts before it ends
  if (new Date(body.startTime) >= new Date(body.endTime)) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "EndTime must be after StartTime",
    };
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        id: body.id,
        description: body?.description,
        userId: body.userId,
        eventLat: body.eventLat,
        eventLong: body.eventLong,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime),
        capacity: body.capacity,
        currentCapacity: 0,
      },
    });

    // Send email notification about the new event
    const transport = createTransport({
      host: config.smtpHost, 
        port: Number(config.smtpPort),
        secure: false,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
    });

    const users = await prisma.user.findMany({
      where: {
        GlobalNotif: true,
        emailVerified: true,
        role: "USER",
      },
      select: {
        email: true,
      },
    });

    // REMOVE
    console.log(users);
    // REMOVE

    for (const user of users) {
      const mailOptions = {
        to: user.email,
        from: config.smtpFrom,
        subject: "New Event from Rainbow Roundup",
        text: "Hey, Rainbow Roundup is hosting a new event! You can check it out here <Add link later>",
        html: "<p>Hey, <strong>Rainbow Roundup</strong> is hosting a new event! You can check it out here <strong>Add link later</strong></p>",
      };

      transport.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(`Error sending email to ${user.email}:`, err);
        }
      });
    }

    setResponseStatus(event, 200);
    return {
      data: newEvent,
    };
  } catch (error) {
    // Use a type guard to ensure `error` is an instance of `Error`
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    setResponseStatus(event, 500);
    return {
      success: false,
      error: `Error creating event: ${errorMessage}`,
    };
  }
});
