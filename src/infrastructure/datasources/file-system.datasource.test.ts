import fs from "fs";
import { FileSystemDatasource } from "./file-system.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { join } from "path";
describe("src/infrastructure/datasources/file-system.datasource.ts", () => {
  //
  const logPath = join(__dirname, "../../../logs");
  const pathAll = join(`${logPath}`, `/all/logs.log`);
  const deleteLogDir = () => {
    if (fs.existsSync(logPath)) {
      fs.rmSync(logPath, { recursive: true, force: true });
    }
  };

  afterEach(() => {
    jest.restoreAllMocks();
  });
  //
  beforeEach(() => deleteLogDir());
  //
  afterAll(() => deleteLogDir());
  test("When creating an instance should create the 'logs' folder, subfolders and log files if they don't exist", () => {
    const fileSystemDatasource = new FileSystemDatasource();
    const subfolders = fs.readdirSync(logPath);
    expect(subfolders).toEqual([
      "all",
      "severity-high",
      "severity-low",
      "severity-medium",
    ]);
    // check sub files of each subfolder
    const allCreated = subfolders.every((sf) => {
      const filePath = join(logPath, `/${sf}/logs.log`);
      return fs.existsSync(filePath);
    });
    expect(allCreated).toBe(true);
  });
  //----------------------
  test("should save a log in logs/all/logs.ts and in logs/severity-low/logs.ts", async () => {
    const appendFileSyncMock = jest.spyOn(fs, "appendFileSync");
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    const log = new LogEntity({
      level: LogSeverityLevel.low,
      message: "test low log",
      origin: __filename,
      date: new Date(),
    });
    const logAsString = JSON.stringify(log);

    const fileSystemDatasource = new FileSystemDatasource(); // re-creates folders =>
    await fileSystemDatasource.saveLog(log);

    expect(appendFileSyncMock).toHaveBeenCalledTimes(2);
    const path = join(`${logPath}`, `/severity-${log.level}/logs.log`);
    const file = fs.readFileSync(path, { encoding: "utf-8" }).trim();
    const fileInAll = fs.readFileSync(pathAll, { encoding: "utf-8" }).trim();
    expect(file).toStrictEqual(expect.stringContaining(logAsString));
    expect(fileInAll).toStrictEqual(expect.stringContaining(logAsString));
    expect(consoleLogMock).toHaveBeenCalledWith(
      `Filesystem: New log saved: ${log.level}`
    );
  });
  // ---------------
  test("should save a log in logs/all/logs.ts and in logs/severity-medium/logs.ts", async () => {
    const appendFileSyncMock = jest.spyOn(fs, "appendFileSync");
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    const log = new LogEntity({
      level: LogSeverityLevel.medium,
      message: "test low log",
      origin: __filename,
      date: new Date(),
    });
    const logAsString = JSON.stringify(log);

    const fileSystemDatasource = new FileSystemDatasource(); // re-creates folders =>
    await fileSystemDatasource.saveLog(log);

    expect(appendFileSyncMock).toHaveBeenCalledTimes(2);
    const path = join(`${logPath}`, `/severity-${log.level}/logs.log`);
    const file = fs.readFileSync(path, { encoding: "utf-8" }).trim();
    const fileInAll = fs.readFileSync(pathAll, { encoding: "utf-8" }).trim();
    expect(file).toStrictEqual(expect.stringContaining(logAsString));
    expect(fileInAll).toStrictEqual(expect.stringContaining(logAsString));
    expect(consoleLogMock).toHaveBeenCalledWith(
      `Filesystem: New log saved: ${log.level}`
    );
  });
  //----------
  test("should save a log in logs/all/logs.ts and in logs/severity-high/logs.ts", async () => {
    const appendFileSyncMock = jest.spyOn(fs, "appendFileSync");
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();

    const log = new LogEntity({
      level: LogSeverityLevel.high,
      message: "test low log",
      origin: __filename,
      date: new Date(),
    });
    const logAsString = JSON.stringify(log);

    const fileSystemDatasource = new FileSystemDatasource(); // re-creates folders =>
    await fileSystemDatasource.saveLog(log);

    expect(appendFileSyncMock).toHaveBeenCalledTimes(2);
    const path = join(`${logPath}`, `/severity-${log.level}/logs.log`);
    const file = fs.readFileSync(path, { encoding: "utf-8" }).trim();
    const fileInAll = fs.readFileSync(pathAll, { encoding: "utf-8" }).trim();
    expect(file).toStrictEqual(expect.stringContaining(logAsString));
    expect(fileInAll).toStrictEqual(expect.stringContaining(logAsString));
    expect(consoleLogMock).toHaveBeenCalledWith(
      `Filesystem: New log saved: ${log.level}`
    );
  });
  //---------------------
  test("should throw an error for invalid severity level when saving a new log", async () => {
    const fileSystemDatasource = new FileSystemDatasource();
    const invalidLog = new LogEntity({
      level: "invalid level" as any,
      message: "invalid test",
      origin: "test",
    });
    await expect(fileSystemDatasource.saveLog(invalidLog)).rejects.toThrow(
      /Unknown log level/
    );
  });
  //---------------------
  test("should read logs from file system", async () => {
    const consoleLogMock = jest.spyOn(console, "log").mockImplementation();
    const logs: LogEntity[] = [
      new LogEntity({
        level: LogSeverityLevel.low,
        message: "low log test",
        origin: "file-system.datasource.test.ts",
      }),
      new LogEntity({
        level: LogSeverityLevel.medium,
        message: "medium log test",
        origin: "file-system.datasource.test.ts",
      }),
      new LogEntity({
        level: LogSeverityLevel.high,
        message: "high log test",
        origin: "file-system.datasource.test.ts",
      }),
    ];
    // save logs
    const fileSystemDatasource = new FileSystemDatasource(); //create logs folder and sub folders
    for (const log of logs) {
      await fileSystemDatasource.saveLog(log);
    }
    // check if logs were saved in every path
    expect(
      logs.every((log) => {
        const logAsJsonString = JSON.stringify(log);
        const fullPath = join(logPath, `/severity-${log.level}/logs.log`);
        const contents = fs
          .readFileSync(fullPath, { encoding: "utf-8" })
          .trim();
        return contents === logAsJsonString;
      })
    ).toBe(true);
  });
  // //------------------
  test("should return an empty array if log file is empty", async () => {
    jest.spyOn(fs, "readFileSync").mockReturnValue("");
    const fileSystemDatasource = new FileSystemDatasource();

    const result = await fileSystemDatasource.getLogs(LogSeverityLevel.high);
    expect(result).toEqual([]);
  });
  // //-------------
  test("should throw an error for invalid severity level when getting logs", async () => {
    const fileSystemDatasource = new FileSystemDatasource();

    await expect(
      fileSystemDatasource.getLogs("invalid" as any)
    ).rejects.toThrow(/Severity Level invalid is not implemented/);
  });
});
