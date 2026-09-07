import pino from "pino";
import type { Logger } from "pino";

const logger:Logger = pino({
    level:process.env.LOG_LEVEL || "info",
    timestamp:pino.stdTimeFunctions.isoTime
});

export default logger;