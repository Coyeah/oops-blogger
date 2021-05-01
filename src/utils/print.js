const chalk = require("chalk");

const printPost = data => {
    console.info(chalk.greenBright("[blogger]"), chalk.greenBright(`${data.title}`));
    console.info("   path: ", data.path);
    console.info("   date: ", data.date);
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
    if (e instanceof Error) {
        console.info(
            chalk.redBright("[blogger]"),
            e.name + ": " + e.message
        );
        return;
    }
    console.info(
        chalk.redBright("[blogger]"),
        e
    );
}

module.exports = {
    printPost,
    printError,
    printText,
}