const { printError } = require("../utils/print");

const errorHandler = (func) => {
    if (typeof func !== 'function') return;
    return Promise.resolve(func()).catch(printError);
}

module.exports = {
    errorHandler
};