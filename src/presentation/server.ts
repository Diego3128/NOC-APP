import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";
import { envs } from "../config/plugins/env.plugin";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-lg.datasource";
import { LogSeverityLevel } from "../domain/entities/log.entity";

// save in fylesystem
const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());
// save in mongodb
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource());

const emailService = new EmailService();
export class Server {
  // start sever duh!
  public static async start() {
    // send email
    const sendEmailLogs = new SendEmailLogs(
      emailService,
      fileSystemLogRepository
    );
    // const sent = await sendEmailLogs.execute([envs.EMAIL_RECEIVER ?? ""]);
    // console.log({ sent });

    const logs = await fileSystemLogRepository.getLogs(LogSeverityLevel.low);
    console.log(logs);

    // const job1 = CronService.createCronJob({
    //   cronTime: "*/5 * * * * *",
    //   onTick: () => {
    //     const URL = "https://google2.com";
    //     new CheckService(
    //       mongoLogRepository, //logRepository
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
