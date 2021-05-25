const chalk = require("chalk");

const printPost = data => {
    const { title, path, date, isUnknow } = data;
    console.info(chalk.greenBright("[blogger]"), chalk.greenBright(`${title}`));
    console.info("   path: ", path);
    console.info("   date: ", date, isUnknow ? "(modify time)" : "");
    console.info(chalk.blackBright('========='));
}

const printText = str => {
    if (Array.isArray(str)) {
        console.info(chalk.greenBright("[blogger]"), ...str);
        return;
    }
    console.info(chalk.greenBright("[blogger]"), str);
}

const printError = e => {
    if (!e) return;
    if (e instanceof Error) {
        console.error(
            chalk.redBright("[blogger]"),
            e.message
        );
        return;
    }
    console.error(
        chalk.redBright("[blogger]"),
        e
    );
}

module.exports = {
    printPost,
    printError,
    printText,
}