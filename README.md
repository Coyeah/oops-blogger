# oops-blogger

一个快速生成 markdown 来编写文章的工具。

## 使用

```shell
npm i oops-blogger -g

blogger new 我的第一篇文章 [-r ./] [-d iso] [-f]
```

+ -r | --root:  生成文件的路径，相对当前命令下的路径，默认当前路径；
+ -d | --date:  生成时间的格式，默认 ymd；
  + ymd:        YYYY-MM-DD
  + ymdhms:     YYYY-MM-DD HH:mm:ss
  + timestamp:  时间戳
+ iso：         ISO
+ -f | --file:  是否以文件为单位，否则以文件夹的形式为一个文档的单位；默认否；