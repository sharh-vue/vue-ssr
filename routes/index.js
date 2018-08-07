import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export function createRouter() {
  return new Router({
    mode: "history",
    fallback: false,
    routes: [
      {
        path: "/users/:id?",
        component: () =>
          import(/* webpackChunkName: "users__id" */ "~/pages/users/_id"),
        name: "users__id"
      },
      {
        path: "/user",
        component: () => import(/* webpackChunkName: "user" */ "~/pages/user"),
        name: "user"
      },
      {
        path: "/index",
        component: () =>
          import(/* webpackChunkName: "index" */ "~/pages/index"),
        name: "index"
      },
      {
        path: "/",
        component: () =>
          import(/* webpackChunkName: "index" */ "~/pages/index"),
        name: "baseIndex"
      },
      {
        path: "/demo",
        component: () => import(/* webpackChunkName: "demo" */ "~/pages/demo"),
        name: "demo"
      },
      {
        path: "/*",
        component: () => import(/* webpackChunkName: "404" */ "~/pages/404"),
        name: "404"
      }
    ]
  });
}
