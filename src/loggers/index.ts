import winston,{createLogger, format, transports} from "winston";
import fs from "fs";

const {combine, timestamp, printf, colorize, splat} = format;

const myFormat = printf(({level, message, timestamp}) => {
    return `${level}: ${message}: ${timestamp}`
})
const myLogs = createLogger({
    level: "silly",
    format: combine(colorize(), splat(), timestamp({format: 'YYYY-MM-DD HH:mm:ss',}), myFormat),
    transports: [
        new transports.Console()
    ]
})

export default myLogs