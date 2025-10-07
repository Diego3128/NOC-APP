import { CheckService } from "../domain/use-cases/checks/check-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
export class Server {
  // start sever duh!
  public static start() {
    const job1 = CronService.createCronJob({
      cronTime: "*/5 * * * * *",
      onTick: () => {
        const URL = "https://google.com";
        new CheckService(
          fileSystemLogRepository, //logRepository
          () => { //onsuccesscallback
            console.log(`Url ${URL} is ok`);
          },
          (error) => { // onerrorcallback
            console.log(error);
          }
        ).execute(URL);
      },
    });
  }
}
