import { sendEmail } from "#imports";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const message = body.message;
    const subject = body.subject;
    const email = body.email;
    const name = body.name;

    if (!name) {
    throw createError({
      statusCode: 400,
      statusMessage: "Name is required",
    });
    }
    if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email is required",
    });
    }
    if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required",
    });
    }

    await sendEmail(
        name,
        email,
        message,
        subject
    );

    return {
        success: true,
    };
});