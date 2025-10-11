import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";
import { envs } from "../config/plugins/env.plugin";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-lg.datasource";
import { LogSeverityLevel } from "../domain/entities/log.entity";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log-datasource";
import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { url } from "inspector";

// save in fylesystem
const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
// save in mongodb
const mongoLogRepository = new LogRepositoryImpl(new MongoLogDatasource());
// save in postgres
const postgresLogRepository = new LogRepositoryImpl(
  new PostgresLogDatasource()
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
    // const sent = await sendEmailLogs.execute([envs.EMAIL_RECEIVER ?? ""]);
    // console.log({ sent });

    // const logs = await fileSystemLogRepository.getLogs(LogSeverityLevel.high);
    // const logs = await mongoLogRepository.getLogs(LogSeverityLevel.medium);
    // const logs = await postgresLogRepository.getLogs(LogSeverityLevel.high);
    // console.log(logs);

    const job1 = CronService.createCronJob({
      cronTime: "*/5 * * * * *",
      onTick: () => {
        const URL = "https://google.com";
        new CheckServiceMultiple(
          [fileSystemLogRepository, mongoLogRepository, postgresLogRepository], //logRepositoies
          () => {
            //onsuccesscallback
            console.log(`Url ${URL} is ok`);
            console.log('-----------');
          },
          (error) => {
            // onerrorcallback
            console.log(`URL ${url} is not working properly:`);
            console.log(error);
            console.log('-----------');
          }
        ).execute(URL);
      },
    });
  }
}
