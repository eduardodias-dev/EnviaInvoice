import nodemailer, { Transporter } from "nodemailer";

export interface EmailAdapter{
    send(to: string, from: string, subject: string, html: string, attachments?: Attachment[]): Promise<any>;
}

export default class NodeMailerAdapter implements EmailAdapter{
    private transporter: Transporter;
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: "emailServer",
            port: 1025,
            secure: false
        })
    }
    async send(to: string, from: string, subject: string, html: string, attachments?: Attachment[]): Promise<any> {
        await this.transporter.sendMail({
            to: to,
            from: from,
            subject: subject,
            html: html,
            attachments: attachments,
        })
    }
}

type Attachment = {
    filename: string,
    content: Buffer | string,
    contentType: string,
}