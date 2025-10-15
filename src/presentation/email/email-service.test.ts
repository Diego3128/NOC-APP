import { EmailOptions, EmailService } from "./email-service";
import { FileSystemDatasource } from '../../infrastructure/datasources/file-system.datasource';
describe("src/presentation/email/email-service.ts", () => {
  //
  test("shoud send email", async () => {
    const options: EmailOptions = {
      to: "diegofperez15@gmail.com",
      subject: "test email title",
      htmlBody: `
            <h1>Just a test</h1>
            <p>test email</p>
            `,
      text: "test email",
    };
    //
    const emailService = new EmailService();
    const wasSent = await emailService.sendEmail(options);
    expect(wasSent).toBe(true);
  });
  //
  test("shoud send email with system logs", async () => {
    // create log folders
    const fsDatasource = new FileSystemDatasource();
    
    const emails = [
      process.env.EMAIL_RECEIVER ?? "",
      process.env.EMAIL_RECEIVER_2 ?? "",
    ];
    const emailService = new EmailService();
    const wasSent = await emailService.sendEmailWithFileSystemLogs(emails);
    expect(wasSent).toBe(true);
  });
});
