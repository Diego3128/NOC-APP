import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";
import { envs } from "../config/plugins/env.plugin";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
const emailService = new EmailService();
export class Server {
  // start sever duh!
  public static async start() {
    // send email
    const sendEmailLogs = new SendEmailLogs(
      emailService,
      fileSystemLogRepository
    );
    const sent = await sendEmailLogs.execute([envs.EMAIL_RECEIVER ?? ""]);
    console.log({ sent });

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
