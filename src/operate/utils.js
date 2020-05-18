const NamesType = {
  'label': '标签',
  'folder': '文件夹',
  'blog': '博文',
};

let formatNames = {};
Object.keys(NamesType).map(key => {
  formatNames[key] = (name, prefix = key) => `${NamesType[prefix] || ''} [ ${name} ] `;
});

module.exports = {
  formatBlogName: (blogName) => blogName.replace(/(\s)+/g, "_"),
  formatNames,
}