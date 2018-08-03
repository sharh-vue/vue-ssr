import { createApp } from './app.js'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp(context)
    // 这里必须将context.url进行下router的push，不然默认是/，就达不到服务器端渲染的效果了
    router.push(context.url);
    // 在router准备好了之后再将app返回
    router.onReady(() => {

      resolve(app)
    }, reject)
  })
}