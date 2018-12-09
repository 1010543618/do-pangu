# do-pangu

一个使用 [remark-pangu](https://github.com/VincentBel/remark-pangu) 格式化 Markdown 文件和文件名的插件。

# 安装

npm:

`npm install --save-dev do-pangu`

yarn:

`yarn add do-pangu --dev`

# 使用

1.  首先确保您的项目使用了 Git 进行版本控制
2.  使用 `do-pangu [options]` 命令格式化 Markdown 文件和文件名.

# 选项

-   `-S`, `--onlyStagedFiles`   (默认) 只格式化 Git 暂存区的`.md`文件.
-   `-C`, `--allCachedFiles`    格式化 Git 控制的全部`.md`文件.
