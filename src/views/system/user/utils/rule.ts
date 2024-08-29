import { reactive } from "vue";
import type { FormRules } from "element-plus";
import { isPhone, isEmail } from "@pureadmin/utils";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  accountName: [
    { required: true, message: "账号名称为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value.length <= 25) {
          callback();
        } else {
          callback(new Error("账号名称不能超过25字"));
        }
      },
      trigger: "blur"
    }
  ],
  name: [
    { required: true, message: "姓名为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        function validateChineseEnglishOnly(inputString) {
          // 正则表达式，匹配中文汉字和英文字母（包括大小写）
          var regex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
          // 使用test方法检查字符串是否匹配正则表达式
          return regex.test(inputString);
        }
        console.log(validateChineseEnglishOnly(value));
        if (validateChineseEnglishOnly(value)) {
          callback();
        } else {
          callback(new Error("姓名只支持中、英文"));
        }
      },
      trigger: "blur"
    },
    {
      validator: (rule, value, callback) => {
        if (value.length <= 25) {
          callback();
        } else {
          callback(new Error("姓名不能超过25字"));
        }
      },
      trigger: "blur"
    }
  ],
  phone: [
    { required: true, message: "手机号为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
      // trigger: "click" // 如果想在点击确定按钮时触发这个校验，trigger 设置成 click 即可
    }
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  status: [{ required: true, message: "状态为必填项", trigger: "blur" }],
  roleIds: [{ required: true, message: "角色为必填项", trigger: "blur" }],
  cityIds: [{ required: true, message: "所属地市为必填项", trigger: "blur" }],
  countyIds: [{ required: true, message: "所属区县为必填项", trigger: "blur" }],
  organization: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (value.length <= 25) {
          callback();
        } else {
          callback(new Error("所属组织不能超过25字"));
        }
      },
      trigger: "blur"
    }
  ],
  wechat: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (value.length <= 25) {
          callback();
        } else {
          callback(new Error("微信不能超过25字"));
        }
      },
      trigger: "blur"
    }
  ],
  dingding: [
    {
      validator: (rule, value, callback) => {
        if (!value) {
          callback();
        } else if (value.length <= 25) {
          callback();
        } else {
          callback(new Error("钉钉不能超过25字"));
        }
      },
      trigger: "blur"
    }
  ]
});
