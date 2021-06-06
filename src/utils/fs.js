const fs = require("fs");
const path = require("path");
const moment = require("moment");

const { tryTo } = require("./utils");
const { getDate, DATE_FORMAT_ENUM } = require("./date");

const markdown_reg = /^\-\-\-\n(\s|\S)*\n\-\-\-\n/;
const markdown_version_reg = /\_v(\d+)$/;
const MD_REG = /\.md$/;
const readdirOpts = {
    withFileTypes: true,
};

function readMarkdown(targetPath, ext = '.md') {
    const data = fs.readFileSync(targetPath + ext, "utf-8");
    const target = data.match(markdown_reg);
    if (!target || target.index !== 0) return;
    const [str] = target;
    const result = {};
    str
        .replace(/\-\-\-\n/g, "")
        .split("\n")
        .forEach((i) => {
            if (!i) return;
            const [title, content] = i.split(/\:\s/);
            result[title] = content.replace(/(\"|\')/g, "").trim();
        });

    const v = targetPath.match(markdown_version_reg);
    if (v) {
        result.version = v[1];
    }

    return result;
}

function checkFolder(targetPath, mkdir = false) {
    if (!targetPath) return false;
    let result = false;
    try {
        const stats = fs.statSync(targetPath);
        if (stats.isFile()) {
            throw new Error();
        }
        result = true;
    } catch (e) {
        // 文件夹不存在
        if (mkdir) {
            // 新建文件夹
            fs.mkdirSync(targetPath);
            result = true;
        }
    }
    return result;
}

/**
 * 创建文件，若遇到相同文件名称可区分版本
 * @param {string} targetPath 文件路径
 * @param {*} content 文件内容
 * @returns version number | null
 */
function createFile(targetPath, content) {
    if (!targetPath) return false;
    let v = 0;
    let result = null;
    while (result === null && v < 50) {
        const suffix = (v === 0 ? "" : `_v${v}`) + ".md";
        const stats = tryTo(() => fs.statSync(targetPath + suffix), null);
        if (!stats) {
            fs.writeFileSync(targetPath + suffix, content);
            result = v;
            break;
        }
        v++;
    }
    return result;
}

function getBlogList(params) {
    const { CWD, root, targetPath = path.resolve(CWD, root), } = params;

    const handleSingleFile = (dirent, localPath, needUnknow = false) => {
        if (MD_REG.test(dirent.name)) {
            // markdown
            const name = dirent.name.replace(MD_REG, "");
            const info = readMarkdown(path.resolve(localPath, name));
            if (!info) {
                if (!needUnknow) return null;

                // 非通过 blogger 创建的 md
                const stats = fs.statSync(path.resolve(localPath, dirent.name));
                return {
                    path: "./" + path.relative(CWD, path.resolve(localPath, dirent.name)),
                    title: dirent.name,
                    date: moment(new Date(stats.mtime)),
                    isUnknow: true,
                }
            };
            return {
                path: "./" + path.relative(CWD, path.resolve(localPath, dirent.name)),
                title: info.title,
                date: moment(new Date(info.date)),
                version: info.version,
            };
        }
        return null;
    };

    return new Promise((resolve, reject) => {
        try {
            const list = fs.readdirSync(targetPath, readdirOpts)
                .map(i => {
                    if (i.isDirectory()) {
                        const localPath = path.resolve(targetPath, i.name);
                        return fs
                            .readdirSync(localPath, readdirOpts)
                            .map((j) => handleSingleFile(j, localPath));
                    }
                    return handleSingleFile(i, targetPath, true);
                })
                .reduce((prev, next) => prev.concat(next), [])
                .filter((i) => !!i)
                .sort((a, b) => (a.date.isBefore(b.date) ? 1 : -1))
                .map((i) => {
                    i.date = getDate(DATE_FORMAT_ENUM.YMDHMS, i.date);
                    return {
                        name: `${i.title}${i.version ? ` | 版本 ${i.version}` : ''}`,
                        value: i,
                    };
                });

            if (!list.length) return reject("该目录下暂无文章！");

            resolve(list);
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    checkFolder,
    createFile,
    readMarkdown,
    getBlogList,
};
