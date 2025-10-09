import { EmailService } from "../../../presentation/email/email-service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";
interface SendEmailLogsUseCase {
  execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendEmailLogsUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute(to: string | string[]) {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) throw new Error("System logs could no be emailed");
      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `System logs emailed`,
        origin: __filename,
      });
      this.logRepository.saveLog(log);
      return sent;
    } catch (error) {
      const errorLog = new LogEntity({
        level: LogSeverityLevel.high,
        message: `Error emailing the system logs: ${error}`,
        origin: __filename,
      });
      this.logRepository.saveLog(errorLog);
      return false;
    }
  }
}
