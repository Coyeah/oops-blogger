const inquirer = require("inquirer");

const { printError, printPost } = require("../utils/print");
const { getBlogList } = require("../utils/fs");

module.exports = (argv) => {
    const { size, edit } = argv;

    let globalList = [];

    if (edit) {
        require("./edit")(argv);
        return;
    }

    getBlogList(argv)
        .then((list) => {

            globalList = list;

            if (list.length > size) {
                list.push(new inquirer.Separator());
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
        .then(({ posts }) => {
            posts.map(printPost);
        })
        .catch((e) => {
            if (e.isTtyError) {
                printError("render error, please change CMD!");
            } else {
                printError(e);
            }
        });
};
