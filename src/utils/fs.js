const fs = require("fs");

const markdown_reg = /^\-\-\-\n(\s|\S)*\n\-\-\-\n/;

function readMarkdown(targetPath, ext = '.md') {
    const data = fs.readFileSync(targetPath + ext, "utf-8");
    const target = data.match(markdown_reg);
    const index = target.index;
    if (index !== 0) return;
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

module.exports = {
    checkFolder,
    createFile,
    readMarkdown,
};
