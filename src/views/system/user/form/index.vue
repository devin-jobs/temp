<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import ReCol from "@/components/ReCol";
import { formRules } from "../utils/rule";
import { FormProps } from "../utils/types";
import { usePublicHooks } from "../../hooks";
import {
  getRoleSelectList,
  getCitysList,
  getShopSelectListAccount
} from "@/api/system";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    title: "添加",
    higherDeptOptions: [],
    accountName: 0,
    name: "",
    phone: "",
    email: "",
    roleIds: [],
    cityIds: [],
    countyIds: [],
    shopIds: [],
    organization: "",
    wechat: "",
    dingding: "",
    status: 1 ///1:启用，2:禁用
  })
});

const sexOptions = [
  {
    value: 0,
    label: "男"
  },
  {
    value: 1,
    label: "女"
  }
];
const roleOptions = ref<any>([]);
const cityOptions = ref<any>([]);
const countyOptions = ref<any>([]);
const shopOptions = ref<any>([]);
onMounted(async () => {
  const res = await getRoleSelectList();
  roleOptions.value = res.data;
  const res1 = await getCitysList({ parentIds: 1 });
  cityOptions.value = res1.data;
  if (newFormInline.value.title == "编辑") {
    getCountyOptions();
    getShopOptionsApi();
  }
});
function getCountyOptions() {
  getCitysList({ parentIds: newFormInline.value.cityIds.join(",") }).then(
    res => {
      countyOptions.value = res.data;
    }
  );
}
function getShopOptionsApi() {
  getShopSelectListAccount({
    countys: newFormInline.value.countyIds.join(",")
  }).then(res => {
    shopOptions.value = res.data;
  });
}
function getCountyOptionsFn(val: any) {
  console.log(val);
  if (val.length > 0) {
    getCountyOptions();
  } else {
    countyOptions.value = [];
    newFormInline.value.countyIds = [];
    newFormInline.value.shopIds = [];
  }
}
function getShopOptions(val: any) {
  if (val.length > 0) {
    getShopOptionsApi();
  } else {
    shopOptions.value = [];
    newFormInline.value.shopIds = [];
  }
}
const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

function handleCheck(type) {
  if (type === 1 && cityOptions.value.length > 0) {
    newFormInline.value.cityIds = [];
    cityOptions.value.forEach(v => {
      newFormInline.value.cityIds.push(v.id);
    });
    getCountyOptionsFn(newFormInline.value.cityIds);
  } else if (type === 2 && countyOptions.value.length > 0) {
    newFormInline.value.countyIds = [];
    countyOptions.value.forEach(v => {
      newFormInline.value.countyIds.push(v.id);
    });
    getShopOptions(newFormInline.value.countyIds);
  }
}

defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="formRules"
    label-width="82px"
  >
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="账号" prop="accountName">
          <el-input
            :disabled="newFormInline.title == '编辑'"
            v-model="newFormInline.accountName"
            clearable
            placeholder="请输入账号"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入姓名"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="newFormInline.status"
            placeholder="请选择状态"
            class="w-full"
          >
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="2" />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="newFormInline.roleIds"
            multiple
            placeholder="请选择角色"
            class="w-full"
            clearable
          >
            <el-option
              v-for="(item, index) in roleOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属地市" prop="cityIds">
          <el-select
            v-model="newFormInline.cityIds"
            multiple
            collapse-tags
            placeholder="请选择所属地市"
            class="w-full"
            @change="getCountyOptionsFn"
            clearable
          >
            <el-option
              v-for="(item, index) in cityOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span class="allBtn" @click="handleCheck(1)">全部</span>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属县区" prop="countyIds">
          <el-select
            multiple
            v-model="newFormInline.countyIds"
            placeholder="请选择所属县区"
            @change="getShopOptions"
            class="w-full"
            collapse-tags
            clearable
          >
            <el-option
              v-for="(item, index) in countyOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span class="allBtn" @click="handleCheck(2)">全部</span>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属门店" prop="shopIds">
          <el-select
            v-model="newFormInline.shopIds"
            placeholder="请选择所属门店"
            class="w-full"
            collapse-tags
            multiple
            clearable
          >
            <el-option
              v-for="(item, index) in shopOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="所属组织" prop="organization">
          <el-input
            v-model="newFormInline.organization"
            clearable
            placeholder="请输入所属组织"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="微信" prop="wechat">
          <el-input
            v-model="newFormInline.wechat"
            clearable
            placeholder="请输入微信"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="钉钉" prop="dingding">
          <el-input
            v-model="newFormInline.dingding"
            clearable
            placeholder="请输入钉钉"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
.allBtn {
  position: absolute;
  right: 28px;
  font-size: 12px;
  cursor: pointer;
}
</style>
