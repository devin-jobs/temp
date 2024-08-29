// 根据角色动态生成路由
import { defineFakeRoute } from "vite-plugin-fake-server/client";

export default defineFakeRoute([
  {
    url: "/login",
    method: "post",
    response: ({ body }) => {
      if (body.username === "admin") {
        return {
          success: true,
          data: {
            avatar: "https://avatars.githubusercontent.com/u/44761321",
            username: "admin",
            nickname: "小铭",
            // 一个用户可能有多个角色
            roles: ["admin"],
            accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJoZC13bWIiLCJyblN0ciI6Ilh4NnhnYU1sR2dhT0dlNnNzVXczUFZCY3NiZEgzd3hoIiwiaXNzIjoiaGQtd21iIiwibG9naW5Vc2VySXAiOiIxOTIuMTY4LjE2Ni4zOSIsInBlcm1pc3Npb25zIjpbXX0.oAtw0-2MhlLrsBvZSDtj7ut8NUYlphyRD5awmHgtRjY",
            refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJoZC13bWIiLCJyblN0ciI6Im1ySktadHh3OGhxb2FuSGtWbE5FVW9iMVJyTHVFb0owIiwiaXNzIjoiaGQtd21iIiwibG9naW5Vc2VySXAiOiIxOTIuMTY4LjE2Ni4zOSIsInBlcm1pc3Npb25zIjpbXX0.UsLWbDlRCkkiqsCWE1r7zvl6XtbSCW_mU3TbpFW8tEE",
            expires: "2030/10/30 00:00:00"
          }
        };
      } else {
        return {
          success: true,
          data: {
            avatar: "https://avatars.githubusercontent.com/u/52823142",
            username: "common",
            nickname: "小林",
            roles: ["common"],
            accessToken: "eyJhbGciOiJIUzUxMiJ9.common",
            refreshToken: "eyJhbGciOiJIUzUxMiJ9.commonRefresh",
            expires: "2030/10/30 00:00:00"
          }
        };
      }
    }
  }
]);
