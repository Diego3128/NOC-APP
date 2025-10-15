import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { LogRepositoryImpl } from "./log.repository.impl";
describe("src/infrastructure/repositories/log.repository.impl.ts", () => {
  class MockLogDataSource implements LogDatasource {
    saveLog = jest.fn();
    getLogs = jest.fn();
  }

  beforeEach(()=> jest.clearAllMocks());
  //
  test("should require a LogDatasource instance", () => {
    const logDataSource = new MockLogDataSource();
    const logRepository = new LogRepositoryImpl(logDataSource);
    expect(logRepository).toBeInstanceOf(LogRepositoryImpl);
  });
  //
  test("should use logDatasource to save a log", () => {
    const logDataSource = new MockLogDataSource();
    const logRepository = new LogRepositoryImpl(logDataSource);
    const log = {} as LogEntity;
    logRepository.saveLog(log);
    expect(logDataSource.saveLog).toHaveBeenCalledWith(log);
  });
  //
   test("should use logDatasource to get logs by level", () => {
    const logDataSource = new MockLogDataSource();
    const logRepository = new LogRepositoryImpl(logDataSource);
    const level = "mock-level" as LogSeverityLevel;
    logRepository.getLogs(level);
    expect(logDataSource.getLogs).toHaveBeenCalledWith(level);
  });
});
