# oops-blogger

一个快速生成 markdown 来编写文章的工具。

## 开始

```shell
npm i oops-blogger -g

blogger new 我的第一篇文章 [-r ./] [-d iso] [-f]
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

选项：
      --version  显示版本号                                               [布尔]
  -h, --help     显示帮助信息                                             [布尔]
```