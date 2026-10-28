import { sendEmail } from "#imports";
import { auth } from "~/server/auth"
import type { User } from "../../types/session";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers
    });

    const user = session?.user as User | undefined;

    if (!user || !["SUPER", "ADMIN"].includes(user.role)) {
        throw createError({
            statusCode: 403,
            statusMessage: "Forbidden"
        });
    }

    const body = await readBody(event);
    const subject = body.subject;
    const message = body.message;
    const users = body.users;

    if (!users) {
    throw createError({
      statusCode: 400,
      statusMessage: "List of users is required",
    });
    }
    if (!Array.isArray(users) || users.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: "Non-empty list of users is expected", //for single users list of size 1 should work
        });
    }
    if (!subject) {
    throw createError({
      statusCode: 400,
      statusMessage: "Subject is required",
    });
    }
    if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required",
    });
    }
    for (const user of users) {
        if (user.emailNotif) {
             await sendEmail(
                user.firstname,
                user.email,
                message,
                subject
            );
        }
    }

    return {
        success: true,
    };
});