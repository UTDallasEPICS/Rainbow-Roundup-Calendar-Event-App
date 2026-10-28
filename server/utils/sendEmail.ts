import { getTransport } from '~~/server/utils/getTransport';


export const sendEmail = async (name: string, email: string, message: string, subject: string) => {
    
    const config = useRuntimeConfig();
    
    const transporter = getTransport(); // the util we have for this contains the actual transport options we need.
    
    const mailOptions = {
        from: config.smtpFrom || "rainbow-roundup@npts.tech",
        to: `${email}`,
        subject: `${subject}`,
        text: `Hi ${name},\n\n${message}}`,
        html: `<p>Hi ${name},<br><br>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
};