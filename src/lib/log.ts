import chalk from 'chalk';

function nowString(date: Date) {
    return '[' + date.toLocaleString('en-au', {hour12: false}) + ']';
}

enum LogSeverity {
    ERROR,
    WARN,
    INFO,
    DEBUG,
}

class Logger {
    constructor(private readonly loggerName: string) {}

    public log(message: string, severity: LogSeverity): void {
        const date = new Date();
        const levelName = LogSeverity[severity];

        const logInfoStr = `${nowString(date)} [${levelName}] ${this.loggerName}: `;

        const tabbedMessage = message.replace(/\n\t/g, `\n${' '.repeat(logInfoStr.length)}`);

        const outStr = `${logInfoStr}${tabbedMessage}`;

        if (severity == LogSeverity.ERROR) {
            console.error(chalk.red(outStr));
        } else if (severity == LogSeverity.WARN) {
            console.warn(chalk.yellow(outStr));
        } else {
            console.log(outStr);
        }
    }

    public debug(message: string): void {
        this.log(message, LogSeverity.DEBUG);
    }

    public info(message: string): void {
        this.log(message, LogSeverity.INFO);
    }

    public warn(message: string): void {
        this.log(message, LogSeverity.WARN);
    }

    public error(message: string): void {
        this.log(message, LogSeverity.ERROR);
    }

    public exception(exception: unknown): void {
        this.log(`${exception}`, LogSeverity.ERROR);
        if (exception) {
            console.trace(exception);
        }
    }
}

export default Logger;
