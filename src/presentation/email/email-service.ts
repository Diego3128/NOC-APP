import { envs } from "../../config/plugins/env.plugin";
import sendGrid from "@sendgrid/mail";

interface EmailOptions {
  to: string;
  subject: string;
  htmlBody: string;
  text: string;
  //  todo: attachments
}

export class EmailService {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, htmlBody, text } = options;
    try {
      sendGrid.setApiKey(envs.SEND_GRID_API_KEY ?? "");
      const response = await sendGrid.send({
        from: {
          email: envs.MAILER_EMAIL ?? "",
          name: "NOC-APP",
        },
        to: to,
        text: text,
        html: htmlBody,
        subject: subject,
      });
      return response[0].statusCode === 202;
    } catch (e) {
      return false;
    }
  }
}
