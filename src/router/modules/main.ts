const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

const constantRoutes: RouteConfigsTable[] = [
  {
    path: "/",
    name: "Home",
    component: Layout,
    redirect: "/welcome",
    meta: {
      icon: "ep:home-filled",
      title: "首页"
    },
    children: [
      {
        path: "/welcome",
        name: "Welcome",
        component: () => import("@/views/welcome/index.vue"),
        meta: {
          title: "概览"
        }
      }
    ]
  },
  {
    // 模型商店
    path: "/modelStore",
    redirect: "/modelStore/modelList",
    meta: {
      icon: "ri:store-2-line",
      title: "模型商店"
    },
    children: [
      {
        path: "/modelStore/modelList",
        name: "modelList",
        component: () => import("@/views/basicConfig/modelStore/modelList/index.vue"),
        meta: {
          title: "模型商店",
          tips: '集中展示与管理精选预置山海大模型，支持对模型进行评估、体验或部署。',
        }
      }
    ]
  },
  {
    path: "/organization",
    redirect: "/system/user",
    meta: {
      icon: "ri:settings-3-line",
      title: "组织管理"
    },
    children: [
      {
        path: "/system/user",
        name: "SystemUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          // icon: "ri:admin-line",
          title: "账号管理",
          showParent: true,
          roles: ["account_manage_query"],
          tips: '集中展示与管理精选预置山海大模型，支持对模型进行评估、体验或部署。',
        }
      },
      {
        path: "/system/role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          // icon: "ri:admin-fill",
          title: "角色管理",
          showParent: true,
          roles: ["role_manage_query"]
        }
      },
      {
        path: "/personCenter",
        name: "personCenter",
        component: () =>
          import("@/views/system/personCenter/personalCenter.vue"),
        meta: {
          title: "个人信息",
          showParent: false,
          showLink: false
        }
      },
    ]
  },
];

export default constantRoutes;
