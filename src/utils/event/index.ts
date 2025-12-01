import { EventEmitter } from "events";
import { sendMail } from "../email";
import { emailTemplate } from "../email/template";
import { MessageEvent } from "http";

export const emailEvent = new EventEmitter();

try {
  emailEvent.on("sendEmail", async (data) => {
    let { email, otp } = data;
    await sendMail({
      subject: "Confirm Email",
      html: emailTemplate({
        emailSubject: "Confirm Email",
        body: `
            <p>Thank you for using our platform. Below is your verification code:</p>
            <p>Please enter this code in the app to complete your verification. The code is valid for 3 minutes.</p>
            <p>If you did not request this code, please ignore this email or contact our support team.</p>
            `,
        otp,
      }),
      to: email,
    });
  });
} catch (error) {
  console.log("Failed to send email.");
}

emailEvent.on("Mention", async (user, mentionedUser, type) => {
  await sendMail({
    subject: "Mention Notification",
    html: emailTemplate({
      emailSubject: `You have been mentioned in a ${type} by ${user}`,
      body: `
            <p>${user} mentioned in a post:</p>
      `
    }),
    to: mentionedUser,
  });
});
