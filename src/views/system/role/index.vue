<script setup lang="ts">
import { useRole } from "./utils/hook";
import { ref, computed, nextTick, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { delay, subBefore, deviceDetection, useResizeObserver } from "@pureadmin/utils";
import { useUserStoreHook } from "@/store/modules/user";

// import Database from "@iconify-icons/ri/database-2-line";
// import More from "@iconify-icons/ep/more-filled";
import Delete from "@iconify-icons/ep/delete";
import EditPen from "@iconify-icons/ep/edit-pen";
import Refresh from "@iconify-icons/ep/refresh";
import Menu from "@iconify-icons/ep/menu";
import AddFill from "@iconify-icons/ri/add-circle-line";
import Close from "@iconify-icons/ep/close";
import Check from "@iconify-icons/ep/check";
import deletePng from "@/assets/acount/delete2x.png";
import { Plus } from "@element-plus/icons-vue";
import editPng from "@/assets/acount/edit2x.png";

defineOptions({
  name: "SystemRole"
});

const iconClass = computed(() => {
  return [
    "w-[22px]",
    "h-[22px]",
    "flex",
    "justify-center",
    "items-center",
    "outline-none",
    "rounded-[4px]",
    "cursor-pointer",
    "transition-colors",
    "hover:bg-[#0000000f]",
    "dark:hover:bg-[#ffffff1f]",
    "dark:hover:text-[#ffffffd9]"
  ];
});

const treeRef = ref();
const formRef = ref();
const tableRef = ref();
const contentRef = ref();
const treeHeight = ref();
const editFormValueRef = ref();
const submit = () => {
  editFormValueRef.value.validate(valid => {
    if (valid) {
      handleSave();
    } else {
      return false;
    }
  });
};

const {
  form,
  isShow,
  curRow,
  loading,
  loadingSave,
  columns,
  rowStyle,
  dataList,
  treeData,
  treeProps,
  isLinkage,
  pagination,
  isSelectAll,
  treeSearchValue,
  attributeSelect,
  // buttonClass,
  onSearch,
  resetForm,
  openDialog,
  handleMenu,
  deleteRole,
  handleSave,
  handleDelete,
  filterMethod,
  transformI18n,
  onQueryChanged,
  // handleDatabase,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  editFormValue
} = useRole(treeRef);

onMounted(() => {
  useResizeObserver(contentRef, async () => {
    await nextTick();
    delay(60).then(() => {
      console.log(tableRef.value.getTableDoms().tableWrapper.style.height);
      let str = (tableRef.value.getTableDoms().tableWrapper.style.height - 156).toString();
      treeHeight.value = parseFloat(subBefore(str, "px"));
    });
  });
});
</script>

<template>
  <div class="main page-main">
    <div>
      <el-input v-model="form.name" placeholder="请输入关键字" clearable class="!w-[180px]" />
      <el-select
        v-model="form.attributeId"
        placeholder="请选择角色属性"
        class="!w-[180px] ml-[10px]"
        clearable
      >
        <el-option
          v-for="(item, index) in attributeSelect"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-button
        type="primary"
        style="margin-left: 10px"
        :icon="useRenderIcon('ri:search-line')"
        :loading="loading"
        @click="onSearch(1)"
      >
        查询
      </el-button>
      <el-button
        v-auth="'role_manage_add'"
        style="color: #3370ff"
        :icon="Plus"
        @click="openDialog()"
      >
        新增角色
      </el-button>
    </div>
    <div
      ref="contentRef"
      :class="['contain-box', 'flex', deviceDetection() ? 'flex-wrap' : '']"
      style="background: transparent; padding: 0"
    >
      <PureTableBar
        :class="[isShow && !deviceDetection() ? '!w-[60vw]' : 'w-full', 'contain-box', 'mt-0']"
        style="transition: width 220ms cubic-bezier(0.4, 0, 0.2, 1); padding: 20px"
        title=""
        :columns="columns"
        @refresh="onSearch"
      >
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            align-whole="center"
            showOverflowTooltip
            table-layout="auto"
            :loading="loading"
            size="large"
            adaptive
            :adaptiveConfig="{ offsetBottom: 98 }"
            :data="dataList"
            :columns="columns"
            :pagination="pagination"
            :paginationSmall="size === 'small' ? true : false"
            :header-cell-style="{
              background: 'var(--el-fill-color-light)',
              color: 'var(--el-text-color-primary)'
            }"
            @selection-change="handleSelectionChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            style="margin-top: -60px"
          >
            <template #operation="{ row }">
              <el-tooltip class="box-item" effect="dark" content="编辑" placement="top">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  @click="handleMenu(row)"
                >
                  <img width="20px" :src="editPng" />
                </el-button>
              </el-tooltip>
              <span style="margin-left: 10px"></span>
              <el-tooltip class="box-item" effect="dark" content="删除" placement="top">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  size="default"
                  v-if="row.type !== 1"
                  @click="deleteRole(row)"
                >
                  <img width="20px" :src="deletePng" />
                </el-button>
              </el-tooltip>
            </template>
          </pure-table>
        </template>
      </PureTableBar>

      <div
        style="margin-top: 10px"
        class="!min-w-[calc(100vw-60vw-268px)] px-2 pb-2 bg-bg_color ml-4 overflow-auto contain-box"
      >
        <div class="flex justify-between w-full px-3 pt-5 pb-4">
          <div class="flex"></div>
          <p class="font-bold truncate">
            <el-button
              v-auth="'role_manage_edit'"
              type="primary"
              style="margin-left: 10px"
              :loading="loadingSave"
              @click="submit"
            >
              保存
            </el-button>
          </p>
        </div>
        <el-form ref="editFormValueRef" :model="editFormValue" label-width="82px">
          <el-form-item
            label="角色名称"
            required
            :rules="[
              {
                required: true,
                message: '角色名称为必填项',
                trigger: 'blur'
              }
            ]"
            prop="roleName"
          >
            <el-input
              v-model="editFormValue.roleName"
              clearable
              maxlength="40"
              show-word-limit
              placeholder="请输入角色名称"
            />
          </el-form-item>

          <el-form-item label="角色描述">
            <el-input
              v-model="editFormValue.notes"
              placeholder="请输入角色描述"
              show-word-limit
              maxlength="200"
              type="textarea"
            />
          </el-form-item>

          <el-form-item
            label="角色属性"
            prop="attributeId"
            :rules="[
              {
                required: true,
                message: '角色属性为必填项',
                trigger: 'blur'
              }
            ]"
          >
            <el-select
              v-model="editFormValue.attributeId"
              placeholder="请选择角色属性"
              :disabled="useUserStoreHook().attributeTypeIds.includes(1)"
            >
              <el-option
                v-for="(item, index) in attributeSelect"
                :key="index"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="权限">
            <el-input
              v-model="treeSearchValue"
              placeholder="请输入菜单进行搜索"
              class="mb-1"
              clearable
              @input="onQueryChanged"
            />
          </el-form-item>
        </el-form>
        <el-tree-v2
          style="padding-left: 72px"
          ref="treeRef"
          show-checkbox
          :data="treeData"
          :props="treeProps"
          :height="300"
          :check-strictly="!isLinkage"
          :filter-method="filterMethod"
        >
          <template #default="{ node }">
            <span>{{ node.label }}</span>
          </template>
        </el-tree-v2>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-main {
  padding: var(--el-padding);
}
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
:deep(.el-pagination) {
  margin: 20px 0 0 !important;
}
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
