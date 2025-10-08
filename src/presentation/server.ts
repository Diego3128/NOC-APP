import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";
import { envs } from "../config/plugins/env.plugin";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
export class Server {
  // start sever duh!
  public static async start() {
    // send email

    const emailService = new EmailService();
    const wasSent = await emailService.sendEmail({
      to: "testemail@gmail.com",
      htmlBody: "<h1>This is a test email sent from NOC</h1>",
      text: "This is a text email sent from NOC",
      subject: "test email from nodejs",
    });
    console.log({wasSent})

    // const job1 = CronService.createCronJob({
    //   cronTime: "*/5 * * * * *",
    //   onTick: () => {
    //     const URL = "https://google.com";
    //     new CheckService(
    //       fileSystemLogRepository, //logRepository
    //       () => { //onsuccesscallback
    //         console.log(`Url ${URL} is ok`);
    //       },
    //       (error) => { // onerrorcallback
    //         console.log(error);
    //       }
    //     ).execute(URL);
    //   },
    // });
  }
}
