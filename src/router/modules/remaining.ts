const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false,
      rank: 101
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false,
      rank: 102
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  {
    path: "/error",
    redirect: "/error/403",
    meta: {
      icon: "ri:information-line",
      showLink: false,
      title: "异常页面",
      rank: 9
    },
    children: [
      {
        path: "/error/403",
        name: "403",
        component: () => import("@/views/error/403.vue"),
        meta: {
          title: "403"
        }
      },
      {
        path: "/error/404",
        name: "404",
        component: () => import("@/views/error/404.vue"),
        meta: {
          title: "404"
        }
      },
      {
        path: "/error/500",
        name: "500",
        component: () => import("@/views/error/500.vue"),
        meta: {
          title: "500"
        }
      }
    ]
  },
  {
    path: "/incentiveList",
    name: "incentiveList",
    component: () => import("@/views/app_zuoxi/index.vue"),
    meta: {
      title: "cs首页",
      showLink: false
    }
  },
  {
    path: "/personalCenterCs",
    name: "personalCenterCs",
    meta: {
      title: "个人信息",
      showLink: false
    },
    component: () => import("@/views/system/personCenter/personalCenterCs.vue")
  }
] satisfies Array<RouteConfigsTable>;
