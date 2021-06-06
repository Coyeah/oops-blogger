const chalk = require("chalk");

const printPost = data => {
    const { title, path, date, isUnknow, version } = data;
    console.info(chalk.greenBright("[blogger]"), chalk.greenBright(`${title}`));
    console.info("     path: ", path);
    console.info("     date: ", date, isUnknow ? "(modify time)" : "");
    if (version) {
        console.info("  version: ", version);
    }
    console.info(chalk.blackBright('========='));
}

const printText = str => {
    if (Array.isArray(str)) {
        console.info(chalk.greenBright("[blogger]"), ...str);
        return;
    }
    console.info(chalk.greenBright("[blogger]"), str);
}

const printWarn = str => {
    console.warn(
        chalk.redBright("[blogger]"),
        chalk.bgRed(str)
    );
}

const printError = e => {
    if (!e) return;
    let msg = e;
    if (e.isTtyError) {
        msg = "render error, please change CMD!";
    } else if (e instanceof Error) {
        msg = e.message;
    }
    console.error(
        chalk.redBright("[blogger]"),
        e
    );
}

module.exports = {
    printPost,
    printError,
    printWarn,
    printText,
}