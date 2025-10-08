import { defineEventHandler, readBody, setResponseStatus } from "h3";
import { getServerSession } from "#auth";
import { createTransport } from "nodemailer";
import { createNewEventEmail } from "../../utils/createNewEventEmail.ts";
import { resolve } from "path";
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

  const startTime = new Date(body.startTime);
  const endTime = new Date(body.endTime);
  const currentTime = new Date();

  // Check that event starts before it ends
  if (startTime >= endTime) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "EndTime must be after StartTime",
    };
  }

  // Check that start date is not in the past
  if (startTime < currentTime) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: "Event start time cannot be in the past",
    };
  }

  try {
    const newEvent = await prisma.event.create({
      data: {
        id: body.id,
        title: body.title,
        description: body?.description,
        userId: body.userId,
        eventLat: body.eventLat,
        eventLong: body.eventLong,
        location: body.location,
        startTime: startTime,
        endTime: endTime,
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

    // Look into filtering for verified users later
    const emailRecipients = await prisma.user.findMany({
      where: {
        GlobalNotif: true,
        role: "USER",
      },
      select: {
        email: true,
        firstname: true,
      },
    });

    const eventURL = config.url + `/calendar`;
    const logoPath = resolve("public/images/318x146Logo.png");
    for (const user of emailRecipients) {
      const mailOptions = {
        to: user.email,
        from: config.smtpFrom,
        subject: "New Event from Rainbow Roundup",
        text: `Hey, Rainbow Roundup is hosting a new event! You can check it out here ${eventURL}`,
        html: createNewEventEmail(user.firstname, body.title, body.startTime, body.description, eventURL),
        attachments: [    // use attachments to ensure logo is displayed in email even in dev
          {
            filename: '318x146Logo.png',
            path: logoPath,
            cid: 'logo',
          },
        ],
      };

      transport.sendMail(mailOptions, (err, info) => { if (err) {
          console.log(`Error sending email to ${user.email}:`, err);
        }
      });
    }
    setResponseStatus(event, 200);
    return {
      data: newEvent,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    setResponseStatus(event, 500);
    return {
      success: false,
      error: `Error creating event: ${errorMessage}`,
    };
  }
});
