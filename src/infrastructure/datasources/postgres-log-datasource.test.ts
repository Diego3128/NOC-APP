import prisma from "../../config/lib/prisma";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { PostgresLogDatasource } from "./postgres-log-datasource";
describe("src/infrastructure//posgres-log-datasource.test.ts", () => {
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  afterAll(async () => {
    // delete inserted logs and restore implementations
    await prisma.log.deleteMany();
    consoleSpy.mockRestore();
  });
  // ----------
  const severityLevel = LogSeverityLevel.low;

  test("should save a LogEntity", async () => {
    const postgresDatasource = new PostgresLogDatasource();
    const log = new LogEntity({
      level: severityLevel,
      message: "test message for the postgres datasource",
      origin: __filename,
    });
    await postgresDatasource.saveLog(log);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("(Postgres) - New log saved:")
    );
  });
  //---------------
  test("should return an array of LogEntity filtered by severity level", async () => {
    const postgresDatasource = new PostgresLogDatasource();
    const logs = await postgresDatasource.getLogs(severityLevel);
    expect(logs).not.toHaveLength(0);
    expect(logs.every((log) => log.level === severityLevel)).toBe(true);
    expect(logs.every((log) => log instanceof LogEntity)).toBe(true);
  });
  //------------
  test("should set the default severity level to 'LOW'", async () => {
    const postgresDatasource = new PostgresLogDatasource();
    const log = new LogEntity({
      level: "invalid" as LogSeverityLevel,
      message: "test message for the postgres datasource",
      origin: __filename,
    });
    await postgresDatasource.saveLog(log);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("(Postgres) - New log saved:")
    );
  });

  //------------
  test("should bring logs by the default severity level 'LOW'", async () => {
    const postgresDatasource = new PostgresLogDatasource();
    const logs = await postgresDatasource.getLogs("invalid" as LogSeverityLevel);
    expect(logs).not.toHaveLength(0);
    expect(logs.every((log) => log.level === severityLevel)).toBe(true);
  });
});
