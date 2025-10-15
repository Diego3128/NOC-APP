import { LogEntity, LogSeverityLevel } from "../entities/log.entity";
import { LogDatasource } from "./log.datasource";

describe("src/domain/datasources/log.datasource.ts", () => {
  const log = new LogEntity({
    level: LogSeverityLevel.high,
    message: "test log",
    origin: __filename,
  });
  //
  class MockLogDatasource implements LogDatasource {
    async saveLog(log: LogEntity): Promise<void> {
      return;
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
      return [log];
    }
  }
  //
  test("should implement LogDatasource abstract class", async () => {
    const mockLogDataSource = new MockLogDatasource();
    expect(mockLogDataSource).toBeInstanceOf(MockLogDatasource);
    expect(typeof mockLogDataSource.saveLog).toBe("function");
    expect(typeof mockLogDataSource.getLogs).toBe("function");
    // test arguments
    mockLogDataSource.saveLog(log); // throws if log is not passed
    // test return value
    const logs = await mockLogDataSource.getLogs(LogSeverityLevel.low);
    expect(logs[0]).toBeInstanceOf(LogEntity)
  });
});
