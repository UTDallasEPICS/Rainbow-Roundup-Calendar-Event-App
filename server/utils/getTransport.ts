import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { createTransport } from "nodemailer";
import nodemailer from 'nodemailer' // this is for createTransport function call, unsure if we actually need it or not

const config = useRuntimeConfig();

function getTransportOptions() { // do not async this
      if (config.NODE_ENV == "dev") { // dev, this should be the copy pasted .env your mentor will send you
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
      else { // prod or stage
          // 1. Create an AWS SES client
          //    If you omit credentials, the SDK uses the default credential chain
          //    (environment variables, shared credentials file, IAM role, etc.)
          // this is from the documentation, leaving the comment here for reference
        const sesClient = new SESv2Client({ region: "us-east-2" });
        return {
          SES: { sesClient, SendEmailCommand }
        }
      }
}

export function getTransport() { // I am using this function instead of returning the big thing because I think it's cleaner
  return createTransport(getTransportOptions())
}