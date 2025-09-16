import { cls, fn } from "hardwired"

import nodemailer, { type Transporter } from 'nodemailer'




export class EmailService {
  static providers = cls.transient(this, [fn.singleton(() => nodemailer.createTransport({
  host: 'localhost', // The hostname of your SMTP server
  port: 3001,      // The port your SMTP server is listening on
  secure: false,     // Since secure is 'false' in your SMTPServer setup
  tls: {
    // WARNING: This is a security risk! Only use for development.
    rejectUnauthorized: false
  }
}))])

  constructor(private readonly transporter: Transporter) {
    
  }

  sendEmail(email: any) {
    this.transporter.sendMail({
       ...email,
       from: 'verification@ahdz.net',

    })
  }
}