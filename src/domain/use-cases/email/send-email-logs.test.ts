import { EmailService } from "../../../presentation/email/email-service";
import { LogEntity } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";
import { SendEmailLogs } from "./send-email-logs";
describe("src/domain/use-cases/email/send-email-logs.ts", () => {
  //
  class EmailServiceMock implements EmailService {
    sendEmail = jest.fn();
    sendEmailWithFileSystemLogs = jest.fn();
  }
  class LogRepositoryMock implements LogRepository {
    saveLog = jest.fn();
    getLogs = jest.fn();
  }
  let emailServiceMock: EmailServiceMock;
  let logRepositoryMock: LogRepositoryMock;
  //init mocks before each test
  beforeEach(() => {
    emailServiceMock = new EmailServiceMock();
    logRepositoryMock = new LogRepositoryMock();
  });
  // clean mocks
  afterEach(() => {
    jest.resetAllMocks();
  });
  //
  test("should take an EmailService and LogRepository", () => {
    const sendEmailLogs = new SendEmailLogs(
      emailServiceMock,
      logRepositoryMock
    );
    expect(sendEmailLogs).toBeInstanceOf(SendEmailLogs);
  });
  //-------------
  test("should send an email, log the result and return true", async () => {
    const email = "testemail@gmail.com";
    emailServiceMock.sendEmailWithFileSystemLogs.mockResolvedValueOnce(true);
    const sendEmailLogs = new SendEmailLogs(
      emailServiceMock,
      logRepositoryMock
    );

    const wasSent = await sendEmailLogs.execute(email);
    expect(wasSent).toBe(true);
    expect(emailServiceMock.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      email
    );
    expect(logRepositoryMock.saveLog).toHaveBeenCalledWith(
      expect.any(LogEntity)
    );
  });
  //   ----------------------
  test("should throw if the email was not sent, log the result and return false", async () => {
    const email = "testemail@gmail.com";
    emailServiceMock.sendEmailWithFileSystemLogs.mockResolvedValueOnce(false);
    const sendEmailLogs = new SendEmailLogs(
      emailServiceMock,
      logRepositoryMock
    );

    const wasSent = await sendEmailLogs.execute(email);
    expect(wasSent).toBe(false);
    expect(emailServiceMock.sendEmailWithFileSystemLogs).toHaveBeenCalledWith(
      email
    );
    expect(logRepositoryMock.saveLog).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining("Error emailing the system logs:"),
        level: expect.any(String),
        origin: expect.any(String),
      })
    );
  });
});
