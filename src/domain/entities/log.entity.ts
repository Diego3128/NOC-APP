export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}

type Options = {
  level: LogSeverityLevel;
  message: string;
  origin: string;
  date?: Date;
};

export class LogEntity {
  public level: LogSeverityLevel;
  public message: string;
  public date: Date;
  public origin: string; // file where the exception ocurred

  constructor({ level, message, date = new Date(), origin }: Options) {
    this.level = level;
    this.message = message;
    this.date = date;
    this.origin = origin;
  }

  public static createLogFromJsonString(jsonData: string): LogEntity {
    // jsonData looks like:
    // "{ "level": "low", "message": "... ", "date": 21121212, "origin": "path-to-file-name.ts"}"
    const { level, message, date, origin } = JSON.parse(jsonData);
    // validate keys
    if (!level || !message || !date || !origin)
      throw new Error("Invalid log data");
    const log = new LogEntity({
      level: level as LogSeverityLevel,
      message: message as string,
      origin: origin,
    });
    log.date = new Date(date);
    return log;
  }
  //
  public static createLogFromObject(object: { [key: string]: any }): LogEntity {
    const { level, message, date, origin } = object;
    // validate keys
    if (!level || !message || !date || !origin){
      throw new Error("Unable to create a LogEntity. Invalid object");
    }
    const severityLevel =
      LogSeverityLevel[level as LogSeverityLevel] ?? LogSeverityLevel.low;
    const log = new LogEntity({
      level: severityLevel,
      message: message as string,
      origin,
      date,
    });
    return log;
  }
}
