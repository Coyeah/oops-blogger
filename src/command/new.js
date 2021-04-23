"use strict";

const fs = require("fs");
const path = require("path");
const moment = require("moment");
const inquirer = require("inquirer");
const chalk = require("chalk");

const { getDate, DATE_FORMAT_ENUM } = require("../utils/date");
const { checkFolder, createFile } = require("../utils/fs");

const TEMPLATE_PATH = path.join(__dirname, "../template/text_v1.ejs");
const TEMPLATE_FILENAME = "index";
const CWD = process.cwd();
const QUERTION_ITEM = {
    TITLE: {
        type: "input",
        name: "title",
        validate(value) {
            if (!value.trim()) {
                return "请输入标题！";
            }
            return true;
        },
        message: "标题",
    },
    DATE: {
        type: "input",
        name: "date",
        message: "时间",
        default: () => getDate("ymdhms"),
    },
    DATE_FORMAT: {
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
    },
    FILE_NAME(defaultTitle) {
        return {
            type: "input",
            name: "filename",
            message: "文件名称",
            default(answer) {
                const title =
                    typeof answer.title === "string"
                        ? answer.title.trim()
                        : defaultTitle.trim();
                return title.replace(/\s/g, "-");
            },
        };
    },
};

module.exports = (argv) => {
    if (!argv) return;
    let {
        title: defaultTitle,
        date: defaultDateFormat,
        file: isFile,
        root,
    } = argv;

    const qList = [
        defaultTitle ? null : QUERTION_ITEM.TITLE,
        defaultDateFormat ? null : QUERTION_ITEM.DATE_FORMAT,
        QUERTION_ITEM.DATE,
        QUERTION_ITEM.FILE_NAME(defaultTitle),
    ].filter((i) => !!i);

    inquirer
        .prompt(qList)
        .then((answer) => {
            const dateFormat = answer.dateFormat || defaultDateFormat;
            const date = getDate(dateFormat, moment(answer.date));
            let title =
                typeof answer.title === "string"
                    ? answer.title
                    : defaultTitle;
            title = title.trim();
            const filename = answer.filename.replace(/\s/g, "-");

            const targetPath = path.resolve(CWD, root, filename);
            const filePath = isFile
                ? targetPath
                : path.resolve(targetPath, TEMPLATE_FILENAME);
            const content = require("ejs").render(
                fs.readFileSync(TEMPLATE_PATH, "utf-8"),
                {
                    date,
                    title,
                }
            );

            !isFile && checkFolder(targetPath, true);
            createFile(filePath, content);
            console.info(chalk.greenBright("[blogger]"), `《${title}》 新建成功！`);
        })
        .catch((error) => {
            if (error.isTtyError) {
                console.info(
                    chalk.redBright("[blogger]"),
                    "render error, please change CMD!"
                );
            } else {
                console.info(
                    chalk.redBright("[blogger]"),
                    error.name + ": " + error.message
                );
            }
        });
};
