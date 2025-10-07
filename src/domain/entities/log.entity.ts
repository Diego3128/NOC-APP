export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public date: Date;

  constructor(level: LogSeverityLevel, message: string) {
    this.level = level;
    this.message = message;
    this.date = new Date();
  }

  public static createLogFromJsonString(jsonData: string): LogEntity {
    // jsonData looks like:
    // "{ "level": "low", "message": "... ", "date": 21121212,}"
    const { level, message, date } = JSON.parse(jsonData);
    // validate keys
    if (!level || !message || !date) throw new Error("Invalid log data");
    const log = new LogEntity(level, message);
    log.date = new Date(date);
    return log;
  }
}
