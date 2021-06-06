"use strict";

const fs = require("fs");
const path = require("path");
const moment = require("moment");
const inquirer = require("inquirer");

const { getDate } = require("../utils/date");
const { checkFolder, createFile } = require("../utils/fs");
const { printText } = require("../utils/print");
const { qTitle, qDateFormat, qDate, qFileNameFunc } = require("../utils/question");

const TEMPLATE_PATH = path.join(__dirname, "../template/text_v1.ejs");
const TEMPLATE_FILENAME = "index";

module.exports = (argv) => {
    if (!argv) return;
    const {
        title: defaultTitle,
        date: defaultDateFormat,
        file: isFile,
        root,
        CWD,
    } = argv;

    const qList = [
        defaultTitle ? null : qTitle,
        defaultDateFormat ? null : qDateFormat,
        qDate,
        qFileNameFunc(defaultTitle),
    ].filter((i) => !!i);

    return inquirer
        .prompt(qList)
        .then((answer) => {
            const { dateFormat = defaultDateFormat, filename } = answer;
            const date = getDate(dateFormat, moment(answer.date));
            const title = (typeof answer.title === "string" ? answer.title : defaultTitle || '').trim();
            // 绝对路径 - 目标文件
            let targetPath = path.resolve(CWD, root, filename);

            if (!isFile) {
                checkFolder(targetPath, true);
                targetPath = path.resolve(targetPath, TEMPLATE_FILENAME);
            }
            // 获取模版构建内容
            const content = require("ejs").render(
                fs.readFileSync(TEMPLATE_PATH, "utf-8"),
                {
                    date,
                    title,
                }
            );

            const v = createFile(targetPath, content);
            printText(`《${title}》 创建成功！${!!v ? '版本：v' + v : ''}`);
        });
};
