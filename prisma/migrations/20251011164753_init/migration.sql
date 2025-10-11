-- CreateEnum
CREATE TYPE "LogSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "level" "LogSeverity" NOT NULL DEFAULT 'LOW',

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
