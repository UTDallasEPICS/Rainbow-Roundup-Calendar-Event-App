import { getTransport } from '~~/server/utils/getTransport';


export const sendContactEmail = async (name: string, email: string, message: string) => {
    
    const config = useRuntimeConfig();
    
    const transporter = getTransport(); // the util we have for this contains the actual transport options we need.
    console.log("2 trasnp.");
    
    const mailOptions = {
        from: config.smtpFrom || "rainbow-roundup@npts.tech",
        to: "nathan.nguyen3663@gmail.com",
        subject: `${name} -- Contact Form Submission`,
        text: `${email}\n${message}`,
        html: `<p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
};
