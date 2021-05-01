const path = require("path");
const fs = require("fs");
const exec = require('child_process').execSync;
const moment = require("moment");
const inquirer = require("inquirer");

const { printError, printPost, printText } = require("../utils/print");
const { readMarkdown } = require("../utils/fs");
const { getDate, DATE_FORMAT_ENUM } = require("../utils/date");

const MD_REG = /\.md$/;
const readdirOpts = {
    withFileTypes: true,
};

module.exports = (argv) => {
    const { root, CWD, size, edit } = argv;
    const targetPath = path.resolve(CWD, root);

    const handleSingleFile = (dirent, localPath = targetPath) => {
        if (MD_REG.test(dirent.name)) {
            // markdown
            const name = dirent.name.replace(MD_REG, "");
            const info = readMarkdown(path.resolve(localPath, name));
            if (!info) return null;
            return {
                path: "./" + path.relative(CWD, path.resolve(localPath, dirent.name)),
                title: info.title,
                date: moment(info.date),
            };
        }
        return null;
    };

    new Promise((resolve, reject) => {
        try {
            const list = fs
                .readdirSync(targetPath, readdirOpts)
                .map((i) => {
                    if (i.isDirectory()) {
                        const localPath = path.resolve(targetPath, i.name);
                        return fs
                            .readdirSync(localPath, readdirOpts)
                            .map((j) => handleSingleFile(j, localPath));
                    }
                    return handleSingleFile(i);
                })
                .reduce((prev, next) => prev.concat(next), [])
                .filter((i) => !!i)
                .sort((a, b) => (a.date.isBefore(b.date) ? 1 : -1))
                .map((i) => {
                    i.date = getDate(DATE_FORMAT_ENUM.YMDHMS, i.date);
                    return {
                        name: i.title,
                        value: i,
                    };
                });

            if (list.length > size) {
                list.push(new inquirer.Separator());
            }

            resolve(list);
        } catch (e) {
            reject(e);
        }
    })
        .then((list) => {
            if (edit) {
                return [
                    {
                        type: "list",
                        name: "post",
                        message: "选择文章：",
                        pageSize: size,
                        choices: list,
                    },
                    {
                        type: "input",
                        name: "way",
                        message: "打开文章方式：",
                        default: "vim",
                    },
                ];
            }

            return {
                type: "checkbox",
                name: "posts",
                message: "选择文章获取详情：",
                pageSize: size,
                choices: list,
            };
        })
        .then((q) => inquirer.prompt(q))
        .then(({ posts, post, way }) => {
            if (edit) {
                printPost(post);
                printText(['运行命令', `${way} ${post.path}`]);
                exec(`${way} ${post.path}`, { stdio: 'inherit' });
            } else {
                posts.map((i) => {
                    printPost(i);
                });
            }
        })
        .catch((e) => {
            if (e.isTtyError) {
                printError("render error, please change CMD!");
            } else {
                printError(e);
            }
        });
};
