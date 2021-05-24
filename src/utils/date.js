const moment = require("moment");

const DATE_FORMAT_ENUM = {
    "YMD": "ymd",
    "ISO": "iso",
    "TIMESTAMP": "timestamp",
    "YMDHMS": "ymdhms",
};

function getDate(dateFormat, now = moment()) {
    if (typeof now === 'string') {
        now = moment(new Date(now));
    }
    if (!now.isValid()) {
        now = moment();
    }
    let result;
    switch (dateFormat) {
        case DATE_FORMAT_ENUM.ISO:
            result = now.toISOString();
            break;
        case DATE_FORMAT_ENUM.TIMESTAMP:
            result = now.valueOf();
            break;
        case DATE_FORMAT_ENUM.YMD:
            result = now.format('YYYY-MM-DD')
            break;
        case DATE_FORMAT_ENUM.YMDHMS:
        default:
            result = now.format('YYYY-MM-DD HH:mm:ss')
    }
    return result;
}

module.exports = {
    DATE_FORMAT_ENUM,
    getDate
}