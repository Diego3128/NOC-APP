import mongoose from "mongoose";
import { LogModel } from "../../data/mongo/models/log.model";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { MongoLogDatasource } from "./mongo-lg.datasource";
import { envs } from "../../config/plugins/env.plugin";
describe("src/infrastructure/datasources/mongo-lg.datasource.test.ts", () => {
  // quiet console.log
  const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  //
  beforeAll(async () => {
    // connect to database
    await mongoose.connect(envs.MONGODB_URL ?? "", {
      dbName: envs.MONGO_DB_NAME ?? "",
    });
  });
  //
  afterAll(async () => {
    // clean inserted logs and close connection
    await LogModel.deleteMany();
    await mongoose.connection.close();
    //restore implementation
    consoleSpy.mockRestore();
  });
  // ----------------------
  test("should create a log passing a LogEntity", async () => {
    const logDataSource = new MongoLogDatasource();
    const log = new LogEntity({
      level: LogSeverityLevel.high,
      message: "test log mongo datasource",
      origin: __filename,
      date: new Date(),
    });
    //
    await logDataSource.saveLog(log);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Mongo: New log saved:")
    );
    consoleSpy.mockClear()
  });
  //------------------
  test("should return an array of LogEntity filtered by severity level", async () => {
    const logDataSource = new MongoLogDatasource();
    const severityLevel = LogSeverityLevel.high;
    const logs = await logDataSource.getLogs(severityLevel);
    expect(logs).not.toHaveLength(0);
    expect(logs.every((log) => log instanceof LogEntity)).toBe(true);
    expect(logs.every((log) => log.level === severityLevel)).toBe(true);
  });
});
