import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SentMessageInfo, Options } from 'nodemailer/lib/smtp-transport';
import { Message } from './interfaces/message.interface';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter<SentMessageInfo, Options>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.EMAIL_CLIENT_ID,
        clientSecret: process.env.EMAIL_CLIENT_SECRET,
        refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      },
    });
  }

  async sendMessage(email: string, message: Message): Promise<void> {
    await this.transporter.sendMail({
      from: `Financial Management <expensesfinancialmanagement@gmail.com>`,
      to: email,
      subject: message.subject,
      text: message.text,
      html: message.html, // need change to frontend url with GET method
    });
  }
}
