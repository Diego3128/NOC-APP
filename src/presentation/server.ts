import { CheckService } from "../domain/use-cases/checks/check-service";
import { CronService } from "./cron/cron-service";

export class Server {
  // start sever duh!
  public static start() {
    
    const job1 = CronService.createCronJob({
      cronTime: "*/5 * * * * *",
      onTick: ()=> {
        const URL = "https://google.com";
        new CheckService(
          ()=> {
            console.log(`Url ${URL} is ok`);
          },
          (error)=> {
            console.log(error);
          }
        ).execute(URL);
      }
    });
  }
}
