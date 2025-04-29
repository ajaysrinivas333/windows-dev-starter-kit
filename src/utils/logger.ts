import chalk from "chalk";

const log = console.log;

function getTimestamp() {
    const now = new Date();
    return chalk.gray(`[${now.toLocaleTimeString()}]`);
  }

class Logger {
    private static prefix(label: string, colorFn: (text: string) => string) {
        return colorFn(`[${label}]`);
    }

    public static log = (...args: any[]) => {
        log(getTimestamp(), this.prefix("LOG", chalk.blueBright), ...args, '\n');
    }

    public static msg = (...args: any[]) => {
        log(getTimestamp(), this.prefix("MSG", chalk.white), ...args, '\n');
    }

    public static info = (...args: any[]) => {
        log(getTimestamp(), this.prefix("INFO", chalk.greenBright), ...args, '\n');
    }

    public static warn = (...args: any[]) => {
        log(getTimestamp(), this.prefix("WARN", chalk.yellowBright), ...args, '\n');
    }

    public static error = (...args: any[]) => {
        log(getTimestamp(), this.prefix("ERROR", chalk.redBright), ...args, '\n');
    }
}

export default Logger;
