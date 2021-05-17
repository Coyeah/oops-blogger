const fs = require("fs");
const path = require("path");
const moment = require("moment");

const { getDate, DATE_FORMAT_ENUM } = require("./date");

const markdown_reg = /^\-\-\-\n(\s|\S)*\n\-\-\-\n/;

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
            result[title] = content.replace(/(\"|\')/g, "");
        });

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

function createFile(targetPath, content) {
    if (!targetPath) return false;
    let v = 0;
    let result = false;
    while (!result) {
        const suffix = (v === 0 ? "" : `_v${v}`) + ".md";
        try {
            const stats = fs.statSync(targetPath + suffix);
            if (stats.isDirectory()) {
                throw new Error();
            }
        } catch (e) {
            fs.writeFileSync(targetPath + suffix, content);
            result = true;
        }
        v++;
    }
    return result;
}

const MD_REG = /\.md$/;
const readdirOpts = {
    withFileTypes: true,
};
function getBlogList(params) {
    const { CWD, root, targetPath = path.resolve(CWD, root), } = params;

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
