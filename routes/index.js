import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const indexPage = () => import(/* webpackChunkName: "pages_index" */'~/pages/index.vue')
const userPage = () => import(/* webpackChunkName: "pages_user" */'~/pages/user.vue')


export function createRouter(){
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      {
        path: "/",
        component: indexPage,
        name: "indexPage"
      },
      {
        path: "/users/:id?",
        component: userPage,
        name: "userPage"
      }
    ]
  })
}