import { createApp } from './app'

// client-specific bootstrapping logic...

const { app, router } = createApp()
// 在router ready之后再进行mount，不然会报服务器跟客户端代码不同步
router.onReady(() => {
  // 注意需要在layout里面设置一个div `id="app"`
  app.$mount('#app')
})

