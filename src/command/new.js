'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const inquirer = require('inquirer');
const chalk = require('chalk');

const TEMPLATE_PATH = path.join(__dirname, '../template/text_v1.ejs');
const TEMPLATE_FILENAME = 'index';
const CWD = process.cwd();

function getDate(dateFormat, now = moment()) {
    if (!now.isValid()) {
        now = moment();
    }
    let result;
    switch (dateFormat) {
        case 'iso':
            result = now.toISOString();
            break;
        case 'timestamp':
            result = now.valueOf();
            break;
        case 'ymdhms':
            result = now.format('YYYY-MM-DD HH:mm:ss')
            break;
        case 'ymd':
        default:
            result = now.format('YYYY-MM-DD')
    }
    return result;
}

const QUERTION_ITEM = {
    TITLE: {
        type: 'input',
        name: 'title',
        validate(value) {
            if (!value.trim()) {
                return '请输入标题！'
            }
            return true;
        },
        message: '标题',
    },
    DATE: {
        type: 'input',
        name: 'date',
        message: '时间',
        default: () => getDate('ymdhms'),
    },
    DATE_FORMAT: {
        type: 'list',
        name: 'dateFormat',
        message: '时间格式',
        default: 'ymd',
        choices: [{
            name: 'YYYY-MM-DD',
            value: 'ymd',
        }, {
            name: 'YYYY-MM-DD HH:mm:ss',
            value: 'ymdhms',
        }, {
            name: 'ISO',
            value: 'iso',
        }, {
            name: '时间戳',
            value: 'timestamp',
        }],
    },
    FILE_NAME(defaultTitle) {
        return {
            type: 'input',
            name: 'filename',
            message: '文件名称',
            default(answer) {
                const title = typeof answer.title === 'string' ? answer.title.trim() : defaultTitle.trim();
                return title.replace(/\s/g, '-');
            }
        }
    },
}

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
    ].filter(i => !!i);

    inquirer
        .prompt(qList)
        .then(answer => {
            const dateFormat = answer.dateFormat || defaultDateFormat;
            const date = getDate(dateFormat, moment(answer.date, 'YYYY-MM-DD HH:mm:ss'));
            const title = typeof answer.title === 'string' ? answer.title.trim() : defaultTitle.trim();
            const filename = answer.filename.replace(/\s/g, '-');

            const targetPath = path.resolve(CWD, root, filename);
            const filePath = isFile ? targetPath : path.resolve(targetPath, TEMPLATE_FILENAME);
            const content = require('ejs').render(
                fs.readFileSync(TEMPLATE_PATH, 'utf-8'),
                {
                    date,
                    title,
                }
            );

            if (!isFile) {
                try {
                    const stats = fs.statSync(targetPath);
                    if (stats.isFile()) {
                        throw new Error();
                    }
                } catch (e) {
                    // 文件夹不存在，新建文件
                    fs.mkdirSync(targetPath);
                }
            }

            let count = 1;
            try {
                while (true) {
                    const stats = fs.statSync(filePath + `${count === 1 ? '' : `_v${count}`}.md`);
                    if (stats.isDirectory()) {
                        throw new Error();
                    }
                    count++;
                }
            } catch (e) {
                fs.writeFileSync(
                    filePath + `${count === 1 ? '' : `_v${count}`}.md`,
                    content
                );
            }

            console.log('\n');
            console.info(chalk.greenBright('[blogger]'), `《${title}》 新建成功！`);
            console.log('\n');
        })
        .catch(error => {
            if (error.isTtyError) {
                console.info(chalk.redBright('[blogger]'), 'render error, please change CMD!');
            } else {
                console.info(chalk.redBright('[blogger]'), error.name + ": " + error.message);
            }
        });

}