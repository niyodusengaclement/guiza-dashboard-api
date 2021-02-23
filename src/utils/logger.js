import winston from "winston";
import { LoggingWinston } from "@google-cloud/logging-winston";

const loggingWinston = new LoggingWinston({
  projectId: "gwiza-staging-v1",
  keyFilename: "./src/config/googleLogger.config.json",
});

const logger = winston.createLogger({
  level: "info",
  transports: [loggingWinston],
});

if (process.env.NODE_ENV === "development") {
  logger.add(new winston.transports.Console());
}

export default logger;
