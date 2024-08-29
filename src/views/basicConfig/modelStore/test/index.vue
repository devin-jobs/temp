<template>
  <div class="auto-height-container record-hd-container no-background-container form-table-wrapper">
    <HdQueryForm>
      <HdQueryFormTopPanel>
        <el-form ref="formRef" inline label-width="49px" :model="queryForm" @submit.prevent>
          <el-form-item prop="companyIdList">
            <HdComSelect
              v-model="queryForm.companyIdList"
              placeholder="团队"
              :api="getAccessaCompanyList"
              :select="['nameCN', 'id']"
            />
          </el-form-item>
          <el-form-item prop="typeList">
            <el-select
              v-model="queryForm.typeList"
              class="depart-select select-tag-max"
              filterable
              clearable
              collapse-tags
              placeholder="类型"
              multiple
            >
              <el-option
                v-for="item in typeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="!item.select"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="enableStatus">
            <el-select
              v-model="queryForm.enableStatus"
              class="depart-select select-tag-max"
              filterable
              clearable
              collapse-tags
              placeholder="状态"
            >
              <el-option
                v-for="item in enableOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="first"
              :icon="Search"
              native-type="submit"
              type="primary"
              @click="queryData"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item class="button-border-blue">
            <el-button
              v-auth="'function_enable_config_add'"
              style="border: 1px solid #dcdfe6"
              :icon="Plus"
              @click="openDialog(false, {})"
              >添加</el-button
            >
          </el-form-item>
        </el-form>
      </HdQueryFormTopPanel>
    </HdQueryForm>
    <hd-card class="auto-height-card has-header">
      <el-table
        ref="tableRef"
        v-loading="listLoading"
        :border="border"
        :data="list"
        :header-cell-style="headerCellStyle"
        :size="lineHeight"
        :stripe="stripe"
        :row-style="rowStyle"
        @selection-change="setSelectRows"
        @row-click="showDetailHander"
      >
        <el-table-column type="index" width="60" label="序号" />
        <el-table-column
          v-for="(item, index) in finallyColumns"
          :key="index"
          align="center"
          :fixed="item.fixed"
          :label="item.label"
          :min-width="item.minWidth || 100"
          :prop="item.prop"
          show-overflow-tooltip
          :sortable="item.sortable"
        >
          <template #header>
            <span v-if="item.label === '手机号码'">
              {{ item.label }}
            </span>
            <span v-else>{{ item.label }}</span>
          </template>
          <template #default="{ row }">
            <span v-if="item.prop === 'type'">
              {{ typeOption.find(ele => ele.value === row[item.prop])?.label }}
            </span>
            <span v-else-if="item.prop === 'enableStatus'">
              <el-tag
                :style="{
                  color: getTagType(row)?.color,
                  background: getTagType(row)?.background,
                  border: getTagType(row)?.border,
                  marginRight: '6px'
                }"
              >
                {{ getTagType(row)?.label }}
              </el-tag>
            </span>
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" :fixed="fixed" label="操作" width="215">
          <template #header>
            <el-checkbox v-model="fixed" label="是否固定操作列" true-value="right" />
          </template>
          <template #default="{ row }">
            <el-button
              v-auth="'function_enable_config_edit'"
              class="reset-margin"
              link
              type="primary"
              size="default"
              title="编辑"
              @click="openDialog(true, row)"
            >
              <img style="width: 20px" :src="editIcon" />
            </el-button>
            <el-button
              v-auth="'function_enable_config_edit'"
              v-if="row.enableStatus === 0"
              class="reset-margin"
              link
              type="primary"
              title="启用"
              @click="handleStatus(row)"
            >
              <img style="width: 20px" :src="openIcon" />
            </el-button>
            <el-button
              v-auth="'function_enable_config_edit'"
              v-if="row.enableStatus === 1"
              class="reset-margin"
              link
              type="primary"
              title="停用"
              @click="handleStatus(row)"
            >
              <img style="width: 20px" :src="closeIcon" />
            </el-button>
            <el-button
              v-auth="'function_enable_config_delete'"
              class="reset-margin"
              link
              type="primary"
              title="删除"
              @click="deleteFn(row)"
            >
              <img style="width: 20px" :src="deleteIcon" />
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty
            class="hd-data-empty"
            description="暂无数据"
            :image="empty3"
            :image-size="300"
          />
        </template>
      </el-table>
      <hd-pagination
        :current-page="queryForm.pageNum"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </hd-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onActivated, onBeforeMount, watch, nextTick } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import { getAccessaCompanyList } from "@/api/common";
import {
  getEnabledConfigurationList,
  deleteEnabledConfiguration,
  updateEnabledConfiguration
} from "@/api/setting";
import { rowStyle } from "@/utils/constant/table";
import empty3 from "@/assets/empty/empty-3.png";
import { message } from "@/utils/message";
import openIcon from "@/assets/zuoxi/open.png";
import closeIcon from "@/assets/zuoxi/close.png";
import deleteIcon from "@/assets/zuoxi/deleteIcon.png";
import editIcon from "@/assets/zuoxi/edit.png";
import { ElMessageBox } from "element-plus";
defineOptions({
  name: "ModelList"
});
const tableRef = ref<any>(null);
const border = ref<boolean>(false);
const stripe = ref<boolean>(false);
const lineHeight = ref<any>("default");
const list = ref<any>([]);
const listLoading = ref<boolean>(false);
const headerCellStyle = {
  background: "var(--hd-bg-color)",
  color: "var(--hd-title-text-color)"
}; // 表头样式

// 开启一个定时器 每一秒打印下
const total = ref<any>(0);
const selectRows = ref<any>([]);
const columns = ref<any>([
  {
    label: "类型",
    prop: "type",
    checked: true,
    minWidth: 100
  },
  {
    label: "团队",
    prop: "companyName",
    checked: true,
    minWidth: 150
  },
  {
    label: "坐席",
    prop: "userNameList",
    checked: true,
    minWidth: 150
  },
  {
    label: "状态",
    prop: "enableStatus",
    checked: true,
    minWidth: 100
  },
  {
    label: "创建人",
    prop: "operatorName",
    checked: true,
    minWidth: 100
  },
  {
    label: "创建时间",
    prop: "ctime",
    checked: true,
    width: 180
  }
]);
const checkList = ref<any>([]);
//类型下拉数据 1：会话分析，2：失败根因监控，3：优秀话术筛选，4：实时话术辅助
const typeOption = [
  {
    label: "会话分析",
    value: 1,
    select: true
  },
  {
    label: "失败根因监控",
    value: 2,
    select: false
  },
  {
    label: "优秀话术筛选",
    value: 3,
    select: false
  },
  {
    label: "实时话术辅助",
    value: 4,
    select: false
  }
];
// 启用状态 0:未启用 1:已启用
const enableOption = [
  {
    label: "未启用",
    value: 0,
    background: "#F3F3F3",
    border: "1px solid #C9C6C6",
    color: "#808899"
  },
  {
    label: "已启用",
    value: 1,
    background: "#E5F8F4",
    border: "1px solid #73DDC3",
    color: "#00C193"
  }
];
const getTagType = (val: any) => {
  return enableOption.find(item => item.value == val.enableStatus);
};
const queryForm = reactive<any>({
  pageNum: 1,
  pageSize: 10,
  companyIdList: [], //团队
  typeList: [], //类型
  enableStatus: null //状态
});
const fixed = ref<string>("right");

// 表行数据
const finallyColumns = computed(() => {
  return columns.value.filter((item: any) => checkList.value.includes(item.label));
});
// 查询方法
const fetchData = async (type?: string) => {
  listLoading.value = true;
  const { data, code, success, message: msg } = await getEnabledConfigurationList(queryForm);

  if (success) {
    list.value = data.list;
    total.value = data.total;
  } else {
    list.value = [];
    total.value = 0;
  }

  listLoading.value = false;
};
// 多样化表格start
const queryData = () => {
  queryForm.pageNum = 1;
  fetchData();
};
// 清空表单
const formRef = ref();
const clearForm = () => {
  formRef.value.resetFields();
};
// 页数量比昂
const handleSizeChange = (value: number) => {
  queryForm.pageNum = 1;
  queryForm.pageSize = value;
  fetchData();
};
// 切换页
const handleCurrentChange = (value: number) => {
  queryForm.pageNum = value;
  fetchData();
};
const setSelectRows = (value: any) => {
  selectRows.value = value;
};
const showDetailHander = (row: any, column: any) => {};
const handleStatus = (row: any) => {
  // 变更状态
  const params = {
    id: row.id,
    enableStatus: row.enableStatus == 1 ? 0 : 1
  };
  ElMessageBox.confirm(`您确定要${row.enableStatus == 1 ? "禁用" : "启用"}该配置吗？`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const { success } = await updateEnabledConfiguration(params);
      if (success) {
        message("操作成功", { type: "success" });
        fetchData();
      } else {
        message("操作失败", { type: "error" });
      }
    })
    .catch(() => {});
};
// 编辑新增
const enableDetailRef = ref(null);
const openDialog = (edit: boolean, row: any) => {
  enableDetailRef.value.showEdit(edit, row);
};
const deleteFn = (row: any) => {
  ElMessageBox.confirm(`您确定要删除该配置吗？`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const { success } = await deleteEnabledConfiguration({
        id: row.id
      });
      if (success) {
        message("操作成功", { type: "success" });
        queryData();
      } else {
        message("操作失败", { type: "error" });
      }
    })
    .catch(() => {
      message(`已取消删除`, {
        type: "info"
      });
    });
};

onActivated(() => {
  tableRef.value.doLayout();
});
onBeforeMount(() => {
  columns.value.forEach((item: any) => {
    if (item.checked) checkList.value.push(item.label);
  });
  fetchData();
});
</script>
<style lang="scss" scoped>
.auto-height-container {
  padding: var(--el-padding) !important;
}
.depart-select {
  width: 175px;
}
.url-class {
  display: grid;
  row-gap: 20px;

  .url-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 15px;
    .title {
      color: #3b3b3b;
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
