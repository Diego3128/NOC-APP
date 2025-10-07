import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";

interface CheckServiceUseCase {
  execute: (url: string) => Promise<boolean>;
}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckService implements CheckServiceUseCase {
  //
  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  async execute(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`The url: ${url} is down.`);
      this.successCallback && this.successCallback();
      const log = new LogEntity(
        LogSeverityLevel.low,
        `Service ${url} is working properly`
      );
      await this.logRepository.saveLog(log);
      return response.ok;
    } catch (error) {
      const errorMessage = `${error}`;
      const log = new LogEntity(
        LogSeverityLevel.high,
        `Error in service ${url}: ${errorMessage}`
      );
      await this.logRepository.saveLog(log);
      this.errorCallback && this.errorCallback(errorMessage);
      return false;
    }
  }
}
