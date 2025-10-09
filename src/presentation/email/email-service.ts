import path from "path";
import { envs } from "../../config/plugins/env.plugin";
import sendGrid from "@sendgrid/mail";
import fs from "fs";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { error } from "console";

interface EmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  text: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  content: string;
  filename: string;
  type?: string;
  disposition?: string;
  contentId?: string;
}

export class EmailService {
  async sendEmail(options: EmailOptions): Promise<boolean> {
    const { to, subject, htmlBody, text, attachments = [] } = options;
    sendGrid.setApiKey(envs.SEND_GRID_API_KEY ?? "");
    const response = await sendGrid.send({
      from: {
        email: envs.MAILER_EMAIL ?? "",
        name: "NOC-APP",
      },
      to: to,
      isMultiple: Array.isArray(to),
      text: text,
      html: htmlBody,
      subject: subject,
      attachments: attachments,
    });
    // console.log(response);
    return response[0].statusCode === 202;
  }

  async sendEmailWithFileSystemLogs(to: string | string[]) {
    const subject = "Sever logs";
    const text =
      "The following are the server logs containing exceptions categorized by severity: low - medium - high:";
    const htmlBody = `
    <h1>Sever logs</h1>
    <p>${text} </p>
    `;
    // Get the absolute file paths
    const logFiles = [
      path.resolve("logs/severity-low/logs.log"),
      path.resolve("logs/severity-medium/logs.log"),
      path.resolve("logs/severity-high/logs.log"),
    ];
    // Read and encode files
    const attachments: EmailAttachment[] = [];

    for (const filePath of logFiles) {
      const logFolderName = filePath.split("\\")[7] ?? "logs";
      const fileBuffer = fs.readFileSync(filePath);
      let base64Content = fileBuffer.toString("base64");
      if (!base64Content) {
        base64Content = Buffer.from(
          `No ${logFolderName} logs :)`,
          "utf8"
        ).toString("base64");
      }
      attachments.push({
        filename: `${logFolderName}.log`,
        content: base64Content,
        type: "text/plain",
        disposition: "attachment",
      });
    }

    const wasSent = await this.sendEmail({
      to,
      subject,
      htmlBody,
      text: "Attached are the latest server logs by severity level.",
      attachments,
    });
    return wasSent;
  }
}
