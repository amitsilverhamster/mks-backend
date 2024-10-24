import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendMailDto } from './dto/mail.dto';

@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService) { }
    mailTransport() {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.MAIL_USER, // generated ethereal user
                pass: process.env.MAIL_PASSWORD, // generated ethereal password
            },
        });
        return transporter;
    }
    async sendEmail(dto: sendMailDto) {
        const transporter = this.mailTransport();
        const { from, recipients, subject, html, text, placeholdersReplacements } = dto;
        const mailOptions = {
            from:
                recipients.map(recipient => recipient.address).join(','), // list of receivers
            to: from ?? {
                name: process.env.APP_NAME,
                address: process.env.DEFAULT_MAIL_FROM
            },//sender address
            subject: subject, // Subject line
            text: text ? text : '', // plain text body
            html: html, // html body
        };
        try {
            const result = await transporter.sendMail(mailOptions);
            return result;
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}
