import { LogModel } from "../../data/mongo/models/log.model";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class MongoLogDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const newLog = new LogModel(log);
    const result = await newLog.save();
    console.log(`Mongo: New log saved: ${result.id}`);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const logs = await LogModel.where({ level: severityLevel });
    const formattedLogs = logs.map(LogEntity.createLogFromObject);
    return formattedLogs;
  }
}
