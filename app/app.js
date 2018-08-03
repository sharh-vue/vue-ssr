import Vue from 'vue'

import Layout from '~/layouts/layout'
import { createRouter } from "~/routes/index";


// server
export function createApp (context) {
  const router = createRouter(context)
  let app = new Vue({
    router,
    render: h => h(Layout)
  })

  return {app, router}
}