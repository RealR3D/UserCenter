# SiteServer CMS 用户中心（SS.Home）

SiteServer CMS 用户中心插件，包含用户中心设置、用户投稿、扩展菜单等功能，允许用户前台发布文章、编辑文章、编辑个人资料等。

用户中心插件采用ReactJs作为前端用户中心的开发框架，通过Webpack打包生成最终文件。

## 本地运行

```bash
npm install
npm start
```

打开浏览器输入http://localhost:8801/

## 打包

```bash
npm install gulp -g
npm install
gulp build
```

Js打包文件在reactjs/dist文件夹中