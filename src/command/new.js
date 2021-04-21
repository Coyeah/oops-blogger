'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

const TEMPLATE_PATH = path.join(__dirname, '../template/new.ejs');
const TEMPLATE_FILENAME = 'index';
const CWD = process.cwd();
const QUERTION_ITEM = {
    TITLE: {
        type: 'input',
        name: 'title',
        message: '题目',
    },
    DATE_FORMAT: {
        type: 'list',
        name: 'dateFormat',
        message: '时间格式',
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
            name: 'fileName',
            message: '文件夹名称',
            default: answer => answer.title || defaultTitle,
        }
    },
}

function getDate(dateFormat, now = new Date()) {
    let result;
    switch (dateFormat) {
        case 'iso':
            result = now.toISOString();
            break;
        case 'timestamp':
            result = +now;
            break;
        case 'ymdhms':
            result = require('moment')(now).format('YYYY-MM-DD HH:mm:ss')
            break;
        case 'ymd':
        default:
            result = require('moment')(now).format('YYYY-MM-DD')
    }
    return result;
}

module.exports = (argv) => {
    if (!argv) return;
    const {
        title: defaultTitle,
        date: defaultDateFormat,
        root,
    } = argv;

    const qList = [
        defaultTitle ? null : QUERTION_ITEM.TITLE,
        defaultDateFormat ? null : QUERTION_ITEM.DATE_FORMAT,
        QUERTION_ITEM.FILE_NAME(defaultTitle),
    ].filter(i => !!i);

    inquirer
        .prompt(qList)
        .then(answer => {
            const {
                title = defaultTitle,
                dateFormat = defaultDateFormat,
                fileName
            } = answer;
            const date = getDate(dateFormat);
            const content = require('ejs').render(
                fs.readFileSync(TEMPLATE_PATH, 'utf-8'),
                {
                    date,
                    title,
                }
            );
            const targetPath = path.resolve(CWD, root, fileName);
            try {
                const stats = fs.statSync(targetPath);
                if (stats.isFile()) {
                    throw new Error();
                }
            } catch (e) {
                // 文件夹不存在，新建文件
                fs.mkdirSync(targetPath);
            }

            let count = 1;
            try {
                while (true) {
                    const stats = fs.statSync(
                        path.resolve(
                            targetPath,
                            TEMPLATE_FILENAME + `${count === 1 ? '' : `_v${count}`}.md`
                        )
                    );
                    if (stats.isDirectory()) {
                        throw new Error();
                    }
                    count++;
                }
            } catch (e) {
                fs.writeFileSync(
                    path.resolve(
                        targetPath,
                        TEMPLATE_FILENAME + `${count === 1 ? '' : `_v${count}`}.md`
                    ),
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
                console.info(chalk.redBright('[blogger]'), 'something is error!');
                console.info(error);
            }
        });

}