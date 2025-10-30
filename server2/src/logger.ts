import winston from "winston";

// ────────────────────────────────
// LOG FORMATTER
// ────────────────────────────────
const logFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] ${level}: ${stack || message}`;
  })
);

// ────────────────────────────────
// LOGGER INSTANCE
// ────────────────────────────────
const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    // Console logs (colored)
    new winston.transports.Console(),

    // File logs
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
});

// ────────────────────────────────
// EXPORT
// ────────────────────────────────
export default logger;
