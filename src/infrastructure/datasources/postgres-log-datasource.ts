import { LogSeverity } from "@prisma/client";
import prisma from "../../config/lib/prisma";
import { LogDatasource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class PostgresLogDatasource implements LogDatasource {
  async saveLog(log: LogEntity): Promise<void> {
    const severityLevel = LogSeverity[log.level.toUpperCase() as LogSeverity] ?? "LOW";
    const newLog = await prisma.log.create({
      data: {
        message: log.message,
        date: log.date,
        origin: log.origin,
        level: severityLevel,
      },
    });
    console.log(`(Postgres) - New log saved: ${newLog.id}`);
  }
  async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = LogSeverity[severityLevel.toUpperCase() as LogSeverity] ?? "LOW";
    const logs = await prisma.log.findMany({ where: { level } });
    // filter LogSeverityLevel
    const filteredLogs: LogEntity[] = logs.map((log) => {
      const logSeverity =
        LogSeverityLevel[log.level.toLowerCase() as LogSeverityLevel] ??
        LogSeverityLevel.low;
      return {
        ...log,
        level: logSeverity,
      };
    });
    return filteredLogs || [];
  }
}
