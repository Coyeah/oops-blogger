const { DATE_FORMAT_ENUM, getDate } = require("./date");

const qDateFormat = {
    type: "list",
    name: "dateFormat",
    message: "时间格式",
    default: DATE_FORMAT_ENUM.YMDHMS,
    choices: [
        {
            name: "YYYY-MM-DD HH:mm:ss",
            value: DATE_FORMAT_ENUM.YMDHMS,
        },
        {
            name: "YYYY-MM-DD",
            value: DATE_FORMAT_ENUM.YMD,
        },
        {
            name: "ISO",
            value: DATE_FORMAT_ENUM.ISO,
        },
        {
            name: "时间戳",
            value: DATE_FORMAT_ENUM.TIMESTAMP,
        },
    ],
};

const qDate = {
    type: "input",
    name: "date",
    message: "时间",
    default: () => getDate("ymdhms"),
}

const qTitle = {
    type: "input",
    name: "title",
    message: "标题",
    validate(value) {
        if (!value.trim()) {
            return "请输入标题！";
        }
        return true;
    },
}

const qFileNameFunc = (defaultTitle = '') => ({
    type: "input",
    name: "filename",
    message: "文件名称",
    default(answer) {
        const title =
            typeof answer.title === "string"
                ? answer.title.trim()
                : defaultTitle.trim();
        return title.replace(/(\s|\.|\/)/g, "-");
    },
})


module.exports = {
    qDateFormat,
    qDate,
    qTitle,
    qFileNameFunc,
}