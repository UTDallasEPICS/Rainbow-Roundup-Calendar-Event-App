
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

declare const globalThis: {
  transportGlobal: ReturnType<typeof createTransport>;
} & typeof global;

export function getTransport() {
  const transport = globalThis.transportGlobal ?? createTransport(getTransportOptions())
  globalThis.transportGlobal = transport;
  return transport;
}