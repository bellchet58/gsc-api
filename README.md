# gsc-api
A node.js wrapper for the [公孙测](https://www.gsc.cn/)  api to fetch data or upload packages.

A way to access the [gsc api](https://www.gsc.cn/) using promises. Upload APK or IPA file without opening browser.

## 安装

```bash
yarn add gsc-api // 1. 模块引用的方式
yarn add gsc-api -D  // 2. 命令行的方式
```

## 使用方式
1. 模块引用方式
```javascript
const gscApiInit = require('gsc-api');
const { oss, upload } = gscApiInit({ token: '这是token' }) // 引用需要的模块 or
const gscApi = gscApiInit({ token: '这是token' })

const uploadShortUrl = await upload();  // 上传
const sign = await oss.getSign({ bucket, dir }); //获取Aliyun OSS签名
...
```
2. 命令行方式
```bash
gsc-api upload {要上传的文件在项目中的路径/绝对路径} --token {公孙测上登陆后的token}
```

## 说明
1. 在上传OSS后获取到包的信息，之后会根据`已发布列表`是否有同名的包，来决定是发布新包，还是编辑原包并添加新版本。
