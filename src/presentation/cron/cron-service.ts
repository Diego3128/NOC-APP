import { CronJob } from "cron";

type Props = {
  cronTime: string | Date;
  onTick: () => void;
};

export class CronService {
  public static createCronJob({ cronTime, onTick }: Props) {
    const job = new CronJob(
      cronTime,
      onTick,
      null // onComplete
    );
    job.start();
    return job;
  }
}
