# 开始

```
npm install 

npm run dev

```

# 目录结构说明

```
.
├── app  Vue-SSR启动入口设置目录，包含client-entry，server-entry，以及导出createApp、router、store
├── assets  静态资源目录，参与webpack打包放在此目录
├── build   构建生成目录，server.bundle.json和client.bundle.json在此目录下，另外webpack打包的资源在此目录下的dist目录
├── layouts   Vue APP入口布局文件存放
├── pages   页面文件存放，在开发模式下会自动监测此目录文件变化并生成路由文件
├── routes  路由入口文件，自动生成到此目录
├── server  服务器相关
├── static  静态资源目录，建议不参与webpack打包
├── store   store存放目录，导出function
├── webpack webpack配置文件存放目录
├── .babelrc babel配置文件
├── app.template.html Vue-SSR模板html文件
├── build.config.js 启动文件
└── postcss.config.js postcss配置文件
```