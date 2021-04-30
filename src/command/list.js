const path = require('path');
const fs = require('fs');
const moment = require('moment');
const inquirer = require("inquirer");

const { printError, printPost } = require('../utils/print');
const { readMarkdown } = require('../utils/fs');
const { getDate, DATE_FORMAT_ENUM } = require('../utils/date');

const MD_REG = /\.md$/;
const readdirOpts = {
    withFileTypes: true,
};

module.exports = (argv) => {
    const { root, CWD, size } = argv;
    const targetPath = path.resolve(CWD, root);

    const handleSingleFile = (dirent, localPath = targetPath) => {
        if (MD_REG.test(dirent.name)) {
            // markdown
            const name = dirent.name.replace(MD_REG, '');
            const info = readMarkdown(path.resolve(localPath, name));
            if (!info) return null;
            return {
                path: './' + path.relative(CWD, path.resolve(localPath, dirent.name)),
                title: info.title,
                date: moment(info.date),
            }
        }
        return null;
    }

    new Promise((resolve, reject) => {
        try {
            const list = fs
                .readdirSync(targetPath, readdirOpts)
                .map(i => {
                    if (i.isDirectory()) {
                        const localPath = path.resolve(targetPath, i.name);
                        return fs.readdirSync(localPath, readdirOpts)
                            .map(j => handleSingleFile(j, localPath));
                    }
                    return handleSingleFile(i);
                })
                .reduce((prev, next) => prev.concat(next), [])
                .filter(i => !!i)
                .sort((a, b) => a.date.isBefore(b.date) ? 1 : -1)
                .map(i => {
                    i.date = getDate(DATE_FORMAT_ENUM.YMDHMS, i.date);
                    return {
                        name: i.title,
                        value: i,
                    };
                });
            list.push(new inquirer.Separator());

            resolve(list);
        } catch (e) {
            reject(e);
        }
    }).then(list => inquirer.prompt({
        type: "checkbox",
        name: "posts",
        message: "获取文章详情：",
        pageSize: size,
        choices: list
    })).then(({ posts }) => {
        posts.map(i => {
            printPost(i);
        })
    }).catch((e) => {
        if (e.isTtyError) {
            printError("render error, please change CMD!");
        } else {
            printError(e)
        }
    });
}