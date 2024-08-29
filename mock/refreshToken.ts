import { defineFakeRoute } from "vite-plugin-fake-server/client";

// 模拟刷新token接口
export default defineFakeRoute([
  {
    url: "/refresh-token",
    method: "post",
    response: ({ body }) => {
      if (body.refreshToken) {
        return {
          success: true,
          data: {
            accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJoZC13bWIiLCJyblN0ciI6Ilh4NnhnYU1sR2dhT0dlNnNzVXczUFZCY3NiZEgzd3hoIiwiaXNzIjoiaGQtd21iIiwibG9naW5Vc2VySXAiOiIxOTIuMTY4LjE2Ni4zOSIsInBlcm1pc3Npb25zIjpbXX0.oAtw0-2MhlLrsBvZSDtj7ut8NUYlphyRD5awmHgtRjY",
            refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJoZC13bWIiLCJyblN0ciI6Im1ySktadHh3OGhxb2FuSGtWbE5FVW9iMVJyTHVFb0owIiwiaXNzIjoiaGQtd21iIiwibG9naW5Vc2VySXAiOiIxOTIuMTY4LjE2Ni4zOSIsInBlcm1pc3Npb25zIjpbXX0.UsLWbDlRCkkiqsCWE1r7zvl6XtbSCW_mU3TbpFW8tEE",
            // `expires`选择这种日期格式是为了方便调试，后端直接设置时间戳或许更方便（每次都应该递增）。如果后端返回的是时间戳格式，前端开发请来到这个目录`src/utils/auth.ts`，把第`38`行的代码换成expires = data.expires即可。
            expires: "2030/10/30 23:59:59"
          }
        };
      } else {
        return {
          success: false,
          data: {}
        };
      }
    }
  }
]);
