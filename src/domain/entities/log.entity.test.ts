import { LogEntity, LogSeverityLevel } from "./log.entity";
describe("src/domain/entities/log.entity.ts", () => {
  //
  const date = new Date("2024-01-01T00:00:00Z");
  const baseData: LogEntity = {
    level: LogSeverityLevel.high,
    message: "test message",
    date: date,
    origin: __filename,
  };
  // ----------
  test("should build a LogEntity via constructor", () => {
    const log = new LogEntity(baseData);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.level).toBe(LogSeverityLevel.high);
    expect(log.message).toBe("test message");
    expect(log.origin).toBe(__filename);
    expect(log.date).toBeInstanceOf(Date);
    expect(log.date.getTime()).toBe(date.getTime());
  });
  //-------------------------
  test("should build a LogEntity via a valid json string", () => {
    const jsonData = `{"level":"low","message":"Service https://google.com is working properly","date":"2025-10-11T23:41:26.165Z","origin":"log.entity.ts"}`;
    const log = LogEntity.createLogFromJsonString(jsonData);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.level).toBe(LogSeverityLevel.low);
    expect(log.message).toBe("Service https://google.com is working properly");
    expect(log.origin).toBe("log.entity.ts");
    expect(log.date).toBeInstanceOf(Date);
  });
  // ----------------
  test("should throw if json string has missing fields", () => {
    const invalidJson = `{"message": "missing fields"}`;
    expect(() => LogEntity.createLogFromJsonString(invalidJson)).toThrow(
      "Invalid log data"
    );
  });
  // ------------------
  test("should create LogEntity from valid object", () => {
    const log = LogEntity.createLogFromObject(baseData);
    expect(log).toBeInstanceOf(LogEntity);
    expect(log.level).toBe(LogSeverityLevel.high);
    expect(log.message).toBe(baseData.message);
    expect(log.origin).toBe(baseData.origin);
  });
  // -----------
  test("should throw if trying to create a LogEntity with an invalid object", () => {
    const invalidObject = {
      level: LogSeverityLevel.low,
    };
    expect(() => LogEntity.createLogFromObject(invalidObject)).toThrow(
      "Unable to create a LogEntity. Invalid object"
    );
  });
  //   -------------
  test("createLogFromObject should default to 'low' level when invalid level is given", () => {
    const objectWithInvalidLevel = {
      ...baseData,
      level: "invalid level",
    };
    const log = LogEntity.createLogFromObject(objectWithInvalidLevel);
    expect(log.level).toBe(LogSeverityLevel.low);
  });
});
