import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface CheckServiceUseCase {
  execute: (url: string) => Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckServiceMultiple implements CheckServiceUseCase {
  //
  constructor(
    private readonly logRepositories: LogRepository[],
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  async execute(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`The url: ${url} is down.`);
      this.successCallback && this.successCallback();
      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `Service ${url} is working properly`,
        origin: __filename,
        date: new Date(),
      });
      await this.saveLogInRepositories(log);
      return response.ok;
    } catch (error) {
      const errorMessage = `${error}`;

      const errorLog = new LogEntity({
        level: LogSeverityLevel.high,
        message: `Service ${url} is NOT responding`,
        origin: __filename,
        date: new Date(),
      });
      await this.saveLogInRepositories(errorLog);
      this.errorCallback && this.errorCallback(errorMessage);
      return false;
    }
  }

  public async saveLogInRepositories(log: LogEntity) {
    const logPromises = this.logRepositories.map((logRepo) => {
      return logRepo.saveLog(log);
    });
    await Promise.all(logPromises);
  }
}
