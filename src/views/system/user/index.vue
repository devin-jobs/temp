<template>
  <div class="page-main">
    <el-form
      ref="formRef"
      :inline="true"
      :model="form"
      class="search-form w-[99/100] pl-0 pt-[0px] overflow-auto"
    >
      <el-form-item label="" prop="username">
        <el-input v-model="form.accountName" placeholder="账号" clearable class="!w-[180px]" />
      </el-form-item>
      <el-form-item label="" prop="username">
        <el-input v-model="form.name" placeholder="姓名" clearable class="!w-[180px]" />
      </el-form-item>
      <el-form-item label="" prop="phone">
        <el-input v-model="form.phone" placeholder="手机号" clearable class="!w-[180px]" />
      </el-form-item>
      <el-form-item label="" prop="status">
        <el-select v-model="form.status" placeholder="状态" clearable class="!w-[180px]">
          <el-option label="全部" value="0" />
          <el-option label="启用" value="1" />
          <el-option label="停用" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="roleIds">
        <el-select
          v-model="form.roleIds"
          filterable
          multiple
          collapse-tags
          placeholder="角色"
          clearable
          class="!w-[200px]"
        >
          <el-option
            v-for="(item, index) in roleOptions"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="cityIds">
        <el-select
          v-model="form.cityIds"
          multiple
          filterable
          style="position: relative"
          collapse-tags
          placeholder="所属地市"
          class="!w-[200px]"
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
      <el-form-item label="" prop="countyIds">
        <el-select
          multiple
          filterable
          style="position: relative"
          collapse-tags
          v-model="form.countyIds"
          placeholder="请选择所属县区"
          class="!w-[200px]"
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
      <el-form-item>
        <el-button
          v-auth="'account_manage_query'"
          type="primary"
          :icon="useRenderIcon('ri:search-line')"
          :loading="loading"
          @click="onSearch(1)"
        >
          查询
        </el-button>
        <el-button
          v-auth="'account_manage_add'"
          style="color: #3370ff"
          :icon="Plus"
          @click="openDialog()"
        >
          添加
        </el-button>
      </el-form-item>
    </el-form>
    <div :class="['contain-box', 'flex', 'justify-between']">
      <div class="w-full">
        <pure-table
          ref="tableRef"
          row-key="id"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          align-whole="center"
          table-layout="auto"
          :loading="loading"
          size="large"
          :data="dataList"
          :columns="columns"
          :pagination="pagination"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #expand="{ row }">
            <div class="expand-box">
              <el-row>
                <el-col :span="6">
                  <span>账号</span><span class="expand-text">{{ row.accountName }}</span>
                </el-col>
                <el-col :span="6">
                  <span>姓名</span><span class="expand-text">{{ row.name }}</span>
                </el-col>
                <el-col :span="6">
                  <span>手机号</span><span class="expand-text">{{ row.phone }}</span>
                </el-col>
                <el-col :span="6">
                  <span>邮箱</span><span class="expand-text">{{ row.email }}</span>
                </el-col>
              </el-row>
              <el-row style="margin: 20px 0">
                <el-col :span="6">
                  <span>状态</span
                  ><span class="expand-text">{{ row.status == 1 ? "启用中" : "停用" }}</span>
                </el-col>
                <el-col :span="6">
                  <span>角色</span><span class="expand-text">{{ row.roleNames }}</span>
                </el-col>
                <el-col :span="6">
                  <span>所属地市</span><span class="expand-text">{{ row.cityNames }}</span>
                </el-col>
                <el-col :span="6">
                  <span>所属区县</span><span class="expand-text">{{ row.countyNames }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <span>所属门店</span><span class="expand-text">{{ transShop(row.shopIds) }}</span>
                </el-col>
                <el-col :span="6">
                  <span>所属组织</span><span class="expand-text">{{ row.organization }}</span>
                </el-col>
                <el-col :span="6">
                  <span>微信</span><span class="expand-text">{{ row.wechat }}</span>
                </el-col>
                <el-col :span="6">
                  <span>钉钉</span><span class="expand-text">{{ row.dingding }}</span>
                </el-col>
              </el-row>
            </div>
          </template>
          <template #operation="{ row }">
            <el-button
              v-auth="'account_manage_edit'"
              class="reset-margin"
              link
              type="primary"
              size="default"
              @click="openDialog('编辑', row)"
            >
              <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                <img width="20px" :src="editPng" />
              </el-tooltip>
            </el-button>
            <el-button
              v-auth="'account_manage_reset_operate'"
              class="reset-margin"
              link
              type="primary"
              @click="onChange(row)"
            >
              <el-tooltip class="box-item" effect="dark" content="停用" placement="top">
                <img width="20px" v-if="row.status == 1" :src="closePng" />
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="启用" placement="top">
                <img width="20px" v-if="row.status == 2" :src="openPng" />
              </el-tooltip>
            </el-button>
            <el-button
              v-auth="'account_manage_reset_pwd'"
              class="reset-margin"
              link
              type="primary"
              @click="resetPassword(row)"
            >
              <el-tooltip class="box-item" effect="dark" content="重置密码" placement="top">
                <img width="20px" :src="resetPng" />
              </el-tooltip>
            </el-button>
          </template>
        </pure-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message } from "@/utils/message";
import { ref } from "vue";
import { useUser, onMounted } from "./utils/hook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

import { Plus } from "@element-plus/icons-vue";
import editPng from "@/assets/acount/edit2x.png";
import closePng from "@/assets/acount/close2x.png";
import openPng from "@/assets/acount/open2x.png";
import resetPng from "@/assets/acount/reset2xPng.png";

import { getRoleSelectList, getCitysList, getShopSelectList, resetPasswordApi } from "@/api/system";

defineOptions({
  name: "SystemUser"
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const roleOptions = ref<any>([]);
const cityOptions = ref<any>([]);
const countyOptions = ref<any>([]);
const shopOptions = ref<any>([]);

function transShop(id: any) {
  let str = "";
  if (id.length > 0) {
    id.forEach((v, i) => {
      str = str + shopOptions.value.find((item: any) => item.id === v)?.name;
      if (i < id.length - 1) {
        str = str + ",";
      }
    });
  }
  return str;
}

function handleCheck(type) {
  if (type === 1 && cityOptions.value.length > 0) {
    form.cityIds = [];
    cityOptions.value.forEach(v => {
      form.cityIds.push(v.id);
    });
    getCountyOptionsFn(form.cityIds);
  } else if (type === 2 && countyOptions.value.length > 0) {
    form.countyIds = [];
    countyOptions.value.forEach(v => {
      form.countyIds.push(v.id);
    });
  }
}

getShopSelectList({
  countys: ""
}).then(res => {
  shopOptions.value = res.data;
});

getRoleSelectList().then(res => {
  roleOptions.value = res.data;
});
getCitysList({ parentIds: 1 }).then(res => {
  cityOptions.value = res.data;
});

function getCountyOptionsFn(val: any) {
  form.countyIds = [];
  if (val.length === 0) {
    countyOptions.value = [];
  } else {
    getCitysList({ parentIds: form.cityIds.join(",") }).then(res => {
      countyOptions.value = res.data;
    });
  }
}

function resetPassword(row: any) {
  resetPasswordApi(row.accountName).then(res => {
    if (res.code == 200) {
      message("已重置密码", {
        type: "success"
      });
    } else {
      message("重置密码失败", {
        type: "info"
      });
    }
  });
}

const {
  onChange,
  form,
  loading,
  columns,
  dataList,
  treeData,
  treeLoading,
  selectedNum,
  pagination,
  buttonClass,
  onSearch,
  openDialog,
  onTreeSelect,
  handleRole,
  handleSizeChange,
  handleCurrentChange
} = useUser(tableRef, treeRef);
</script>

<style scoped lang="scss">
.page-main {
  padding: var(--el-padding);
}
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
:deep(.el-pagination) {
  // padding: 0 20px 20px;
  margin: 20px 0 0 !important;
}
.pure-table {
  background-color: #fff;
}
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}

.expand-box {
  box-shadow: inset 0 0 20px #174a831a;
  padding: 20px;
  margin: 0 20px;
  border-radius: 12px;
  .expand-text {
    margin-left: 20px;
  }
}
.allBtn {
  position: absolute;
  right: 28px;
  font-size: 12px;
  cursor: pointer;
}
</style>
