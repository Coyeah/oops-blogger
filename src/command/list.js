const inquirer = require("inquirer");

const { printError, printPost } = require("../utils/print");
const { getBlogList } = require("../utils/fs");

module.exports = (argv) => {
    const { size, edit } = argv;

    let globalList = [];

    getBlogList(argv)
        .then((list) => {

            globalList = list;

            if (list.length > size) {
                list.push(new inquirer.Separator());
            }

            if (edit) {
                const result = [{
                    type: "list",
                    name: "post",
                    message: "选择文章：",
                    pageSize: size,
                    choices: list,
                }];

                if (typeof edit !== 'string') {
                    result.push({
                        type: "input",
                        name: "way",
                        message: "打开文章方式：",
                        default: "vim",
                    });
                }

                return result;
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
        .then(({ posts, post, way = edit }) => {
            if (edit) {
                printPost(post);
                require("./edit")({
                    ...argv,
                    edit: way,
                    path: post.path,
                }, globalList);
            } else {
                posts.map(printPost);
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
