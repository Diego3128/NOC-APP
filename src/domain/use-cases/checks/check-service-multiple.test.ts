import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repositories/log.repository";
import { CheckServiceMultiple } from "./check-service-multiple";
describe("src/domain/use-cases/checks/check-service-multiple.ts", () => {
  //LogRepository mock class
  class MockLogRepository implements LogRepository {
    saveLog = jest.fn();
    getLogs = jest.fn();
  }
  //   mocks and spies declaration
  let mockLogRepositories: MockLogRepository[];
  let saveLogSpy: jest.SpyInstance; // spies CheckServiceMultiple.saveLogInRepositories // init on every test
  let successCallback: jest.Mock;
  let errorCallback: jest.Mock;
  const validUrl = "https://google.com";
  const invalidUrl = "https://google22.com";
  //   create fresh mocks and spies before each test
  beforeEach(() => {
    mockLogRepositories = [new MockLogRepository()];
    successCallback = jest.fn();
    errorCallback = jest.fn();
  });
  // clean mocks and spies after every test
  afterEach(() => {
    mockLogRepositories = [];
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });
  // -----------------------------------
  test("should take an array of logRepository and success and error callbacks during creation", () => {
    const checkServiceMultiple = new CheckServiceMultiple(
      mockLogRepositories,
      successCallback,
      errorCallback
    );
    expect(checkServiceMultiple).toBeInstanceOf(CheckServiceMultiple);
  });
  // // -------------------------
  test("With a valid URL should call the successCallback, saveLogInRepositories and return true", async () => {
    const checkServiceMultiple = new CheckServiceMultiple(
      mockLogRepositories,
      successCallback,
      errorCallback
    );
    saveLogSpy = jest.spyOn(checkServiceMultiple, "saveLogInRepositories");
    const result = await checkServiceMultiple.execute(validUrl);
    expect(result).toBe(true);
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledTimes(0);
    expect(saveLogSpy).toHaveBeenCalledWith(expect.any(LogEntity));
  });
  // //   -----------------------
  test("With an invalid URL should call the errorCallback, saveLogInRepositories and return false", async () => {
    const checkServiceMultiple = new CheckServiceMultiple(
      mockLogRepositories,
      successCallback,
      errorCallback
    );
    saveLogSpy = jest.spyOn(checkServiceMultiple, "saveLogInRepositories");
    const result = await checkServiceMultiple.execute(invalidUrl);
    expect(result).toBe(false);
    expect(successCallback).toHaveBeenCalledTimes(0);
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(saveLogSpy).toHaveBeenCalledWith(expect.any(LogEntity));
  });
});
