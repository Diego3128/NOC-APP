import fs, { readFileSync } from "fs";
import { dirname } from "path";

import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasource implements LogDatasource {
  private readonly logPath = "logs/";
  private readonly logFilePaths = {
    allSeverityPath: `${this.logPath}all/logs.log`,
    lowSeverityPath: `${this.logPath}severity-low/logs.log`,
    mediumSeverityPath: `${this.logPath}severity-medium/logs.log`,
    highSeverityPath: `${this.logPath}severity-high/logs.log`,
  };

  constructor() {
    this.createLogFiles();
  }

  private createLogFiles() {
    // check if main folder exists
    if (!fs.existsSync(this.logPath)) {
      //create folder
      fs.mkdirSync(this.logPath);
    }
    // create subfiles
    Object.values(this.logFilePaths).forEach((filePath) => {
      if (!fs.existsSync(filePath)) {
        // Extract the directory path from the file path
        const dir = dirname(filePath);
        // Create directories recursively
        fs.mkdirSync(dir, { recursive: true });
        // Create (or overwrite) the file
        fs.writeFileSync(filePath, "");
      }
    });
  }
  //
  async saveLog(newLog: LogEntity): Promise<void> {
    const logAsJson: LogEntity = {
      level: newLog.level,
      message: newLog.message,
      date: new Date(),
      origin: newLog.origin,
    };
    const logAsString = `${JSON.stringify(logAsJson)}\n`;
    // all logs go to: this.logFilePaths.allSeverityPath
    fs.appendFileSync(this.logFilePaths.allSeverityPath, logAsString);

    // determine where to save the log
    switch (newLog.level) {
      case "low":
        fs.appendFileSync(this.logFilePaths.lowSeverityPath, logAsString);
        break;
      case "medium":
        fs.appendFileSync(this.logFilePaths.mediumSeverityPath, logAsString);
        break;
      case "high":
        fs.appendFileSync(this.logFilePaths.highSeverityPath, logAsString);
        break;
    }
  }

  private getLogsFromFile(path: string): LogEntity[] {
    const content = readFileSync(path, { encoding: "utf-8" });
    // content is a string that looks like
    // " { "level": "low", "message": "... ", "date": 21121212,} \n
    //   { "level": "low", "message": "...", "date": 21121212,} \n "
    // separate logs by "\n"
    let stringLogs = content.split("\n");
    // ignore empty logs
    stringLogs = stringLogs.filter(log => log !== "");
    // convert to valid objects
    const logs = stringLogs.map((log) => {
      // console.log({log});
      // console.log("--------------");
      return LogEntity.createLogFromJsonString(log);
    });
    return logs || [];
  }

  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    switch (severityLevel) {
      case "low":
        return this.getLogsFromFile(this.logFilePaths.lowSeverityPath);
      case "medium":
        return this.getLogsFromFile(this.logFilePaths.mediumSeverityPath);
      case "high":
        return this.getLogsFromFile(this.logFilePaths.highSeverityPath);
      default:
        throw new Error(`severityLevel ${severityLevel} not implemented`);
    }
  }
}
