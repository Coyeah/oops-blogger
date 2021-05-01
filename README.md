# oops-blogger

[![npm version](https://badge.fury.io/js/oops-blogger.svg)](https://badge.fury.io/js/oops-blogger)
[![npm downloads](https://img.shields.io/npm/dm/oops-blogger.svg?style=flat-square)](http://npm-stat.com/charts.html?package=oops-blogger)

🔧 **快速生成 markdown 模板**

## 开始

```shell
npm i oops-blogger -g

blogger new 我的第一篇文章 [-r ./] [-d iso] [-f]

blogger list [-r ./] [-s 15] [-e]
```

## 使用

```shell
blogger --help
```

```text
Usage: blogger new [title] <options>

新建文章：
  -r, --root  相对路径                                   [字符串] [默认值: "./"]
  -d, --date  时间格式    [字符串] [可选值: "ymd", "iso", "timestamp", "ymdhms"]
  -f, --file  构建单个文件                                [布尔] [默认值: false]

浏览文章：
  -r, --root  相对路径                                   [字符串] [默认值: "./"]
  -s, --size  单页条目数量                                   [数字] [默认值: 15]
  -e, --edit  打开选中文章                                [布尔] [默认值: false]

选项：
      --version  显示版本号                                               [布尔]
  -h, --help     显示帮助信息                                             [布尔]
```