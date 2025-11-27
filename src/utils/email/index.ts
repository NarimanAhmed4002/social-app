import nodemailer from "nodemailer";
import { devConfig } from "../../config/env/dev.config";
import { MailOptions } from "nodemailer/lib/sendmail-transport";

export const sendMail = async (mailOptions:MailOptions)=>{
    // create transporter
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user:devConfig.EMAIL,
            pass:devConfig.PASSWORD,
        },
    });
    mailOptions.from = `Social App <${devConfig.EMAIL}>`;
    await transporter.sendMail(mailOptions)
};

// functions to send verification or notification emails.

