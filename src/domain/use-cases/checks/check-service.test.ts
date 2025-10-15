import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";
import { CheckService } from "./check-service";
describe("src/domain/use-cases/checks/check-service.ts", () => {
  //mock classes and methods to test the class
  class MockLogRepository implements LogRepository {
    async saveLog(log: LogEntity): Promise<void> {}
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return [];
    }
  }
  //   mocks and spies declaration
  let mockLogRepository: MockLogRepository;
  let saveLogSpy: jest.SpyInstance;
  let successCallback: jest.Mock;
  let errorCallback: jest.Mock;
  const validUrl = "https://google.com";
  const invalidUrl = "https://google22.com";
  //   create fresh mocks and spies before each test
  beforeEach(() => {
    mockLogRepository = new MockLogRepository();
    saveLogSpy = jest.spyOn(mockLogRepository, "saveLog");
    successCallback = jest.fn();
    errorCallback = jest.fn();
  });
  // clean mocks and spies after every test
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  // -----------------------------------
  test("should take logRepository and callbacks during creation", () => {
    const checkService = new CheckService(
      mockLogRepository,
      successCallback,
      errorCallback
    );
    expect(checkService).toBeInstanceOf(CheckService);
  });
  // -------------------------
  test("With a valid URL should call the successCallback and save a log using the logRepository", async () => {
    const checkService = new CheckService(
      mockLogRepository,
      successCallback,
      errorCallback
    );
    //
    const result = await checkService.execute(validUrl);
    expect(result).toBe(true);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledTimes(0);
    expect(saveLogSpy).toHaveBeenCalledWith(expect.any(LogEntity));
  });
  //   -----------------------
  test("With an invalid URL should call the errorCallback and save an error log", async () => {
    const checkService = new CheckService(
      mockLogRepository,
      successCallback,
      errorCallback
    );
    const result = await checkService.execute(invalidUrl);
    expect(result).toBe(false);
    expect(successCallback).toHaveBeenCalledTimes(0);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(saveLogSpy).toHaveBeenCalledTimes(1);
  });
  //
  test("should throw if response.ok is false", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    } as Response);

    const checkService = new CheckService(
      mockLogRepository,
      successCallback,
      errorCallback
    );

    const result = await checkService.execute(invalidUrl);
    expect(result).toBe(false);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(saveLogSpy).toHaveBeenCalledTimes(1);
  });
});
