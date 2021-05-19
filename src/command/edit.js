const exec = require('child_process').execSync;
const inquirer = require("inquirer");

const { printText, printError, printPost } = require("../utils/print");
const { getBlogList } = require("../utils/fs");

module.exports = async (argv, blogList) => {

    (async function () {
        const { path, edit, size } = argv;

        const q = [];

        if (!edit) {
            q.unshift({
                type: "input",
                name: "way",
                message: "打开文章方式：",
                default: "vim",
            });
        }

        if (!path) {
            let list = blogList;

            if (!Array.isArray(blogList)) {
                list = await getBlogList(argv);
            }

            list.push(new inquirer.Separator());

            q.unshift({
                type: "list",
                name: "post",
                message: "选择文章：",
                pageSize: size,
                choices: list,
            });
        }

        let _edit = edit, _path = path;

        if (q.length) {
            const { post, way = edit } = await inquirer.prompt(q);
            printPost(post);
            _edit = way;
            _path = post ? post.path : path;
        }

        printText(['运行命令', `${_edit} ${_path}`]);
        exec(`${_edit} ${_path}`, { stdio: 'inherit' });
    })()
        .catch(e => {
            if (e.isTtyError) {
                printError("render error, please change CMD!");
            } else {
                printError(e);
            }
        })
}