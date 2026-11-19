import { sendEmail } from "#imports";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const message = body.message;
    const subject = body.subject || "";
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
    try {
        await sendEmail(
            name,
            email,
            message,
            subject
        );
    }
    catch (error: any){
        throw createError({
            statusCode: 500,
            statusMessage: "Email failed to send, check if your email is right", //primarily used to check if email is valid through sending an intermediary and confirmation email. User should check email to ensure it works. 
        })
    }

    return {
        success: true,
    };
});