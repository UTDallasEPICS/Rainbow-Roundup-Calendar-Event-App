
import { createTransport } from "nodemailer";

const config = useRuntimeConfig();

function getTransportOptions() { // do not async this
  return {
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: false,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  }
}

export function getTransport() { // I am using this function instead of returning the big thing because I think it's cleaner
  return createTransport(getTransportOptions())
}