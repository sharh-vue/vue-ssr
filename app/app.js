import Vue from 'vue'

import Layout from '~/layouts/layout'
import { createRouter } from "~/routes/index"
import { createStore } from "~/store/index"

// server
export function createApp (context) {
  const router = createRouter(context)
  const store = createStore(context)
  let app = new Vue({
    router,
    store,
    render: h => h(Layout)
  })

  return {app, router, store}
}