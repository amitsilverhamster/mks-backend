import { Address } from "nodemailer/lib/mailer";


export class sendMailDto {
    from?: Address;
    recipients: Address[];
    subject: string;
    html: string;
    text?: string;
    placeholdersReplacements?: Record<string, string>;
  }