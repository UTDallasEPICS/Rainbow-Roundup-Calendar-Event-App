import { sendContactEmail } from "#imports";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    console.log("1.");
    const message = body.message;
    const name = body.fname;
    const email = body.femail;

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

    await sendContactEmail(
        name,
        email,
        message,
    );

    return {
        success: true,
    };
});