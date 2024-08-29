<template>
  <el-drawer
    title="坐席项目技能"
    class="vab-drawer form-table-border"
    v-model="dialogFormVisible"
    :wrapper-closable="false"
    destroy-on-close
    size="600"
    @close="close"
  >
    <div v-loading="loading" class="w-h-100">
      <div class="cheched-list">
        <strong>已选标签</strong>
        <div class="tag-check-list">
          <template v-if="chechedTags.length > 0">
            <el-tag
              class="tag-name"
              v-for="tag in chechedTags"
              :key="tag.id"
              closable
              effect="dark"
              :disable-transitions="false"
              @close="tagClose(tag)"
            >
              {{ tag.label }}
            </el-tag>
          </template>
          <el-empty
            v-else
            description="暂无标签"
            style="margin: 0 auto"
            :image="empty3"
            :image-size="200"
          />
        </div>
      </div>
      <div class="tag-list" element-loading-text="加载中...">
        <div>
          <el-input v-model="filterText" placeholder="请输入关键词" />
        </div>
        <div class="tree-b">
          <el-tree
            ref="treeRef"
            :data="source.treeList"
            show-checkbox
            node-key="id"
            class="role-tree"
            :props="source.defaultProps"
            default-expand-all
            :default-checked-keys="tagIds"
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
          />
          <!-- <el-empty v-else description="暂无数据" style="margin: 0 auto" /> -->
        </div>
      </div>
    </div>

    <template #footer>
      <div style="margin-left: 50px; margin-top: 6px">
        <el-button :loading="submitButtonLoading" type="primary" @click="save">
          <!-- <vab-icon icon="send-plane-fill" /> -->
          确定
        </el-button>
        <el-button plain @click="close">取消</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  defineEmits,
  defineExpose
} from "vue";
import { ElMessage } from "element-plus";
import { getMyTags, setUserTags, tagTree } from "@/api/seatManage";
import empty3 from "@/assets/empty/empty-3.png";
defineOptions({
  name: "SeatTagging"
});
const submitButtonLoading = ref(false);
const loading = ref(false);
const dialogFormVisible = ref(false); //是否显示
const form = ref<any>({
  id: "",
  name: ""
});
const source = ref({
  defaultProps: {
    children: "children",
    label: "label"
  },
  treeList: [] //树数据
});
const checkStrictly = ref(false);
// 打开准备
const showEdit = async (row: any) => {
  loading.value = true;
  form.value = Object.assign({}, row);
  await getAuth();
  await selectAgentById();
  dialogFormVisible.value = true;
  submitButtonLoading.value = false;
  loading.value = false;
};
const treeRef = ref<any>(null);
const getAuth = async () => {
  let params = <any>{};
  params.id = form.value.id;
  const { code1, data } = await tagTree({
    status: 1 //
  });

  source.value.treeList = data;
};
// 回显树
const selectAgentById = async () => {
  const { code, data, message } = await getMyTags({ userId: form.value.id });
  if (code === 20000) {
    let checkedList = <any>[];
    let dataSource1 = data.filter((item: any) => item.dataSource == 1);
    dataSource1.map((item: any) => {
      item.label = item.name;
      checkedList.push(item.id);
    });
    tagIds.value = checkedList;
    chechedTags.value = dataSource1;
  } else {
    ElMessage.error(message);
  }
};
const formRef = ref<any>(null);
const emit = defineEmits(["fetch-data"]);
const close = () => {
  form.value = {
    id: "",
    name: ""
  };
  filterText.value = "";
  tagIds.value = [];
  chechedTags.value = [];
  dialogFormVisible.value = false;
  emit("fetch-data");
};
const save = async () => {
  // let temp = <any>[]
  // let checkedList = <any>[]
  // checkedList = treeRef.value.getCheckedNodes(true, false)
  // checkedList.forEach(function (node: any) {
  //   temp.push(node.id)
  // })
  submitButtonLoading.value = true;
  loading.value = true;
  const { code } = await setUserTags({
    userId: form.value.id,
    tagIds: tagIds.value
  });
  if (code == 20000) {
    ElMessage.success("保存成功");
    emit("fetch-data");
    close();
    submitButtonLoading.value = false;
  } else {
    ElMessage.error("保存失败");
    submitButtonLoading.value = false;
  }
  loading.value = false;
};
// 树过滤s
const filterText = ref("");
watch(filterText, val => {
  treeRef.value!.filter(val);
});
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};
// 树过滤e
// 树变更s
const tagIds = ref<any>([]);
const chechedTags = ref<any>([]);
const handleCheckChange = (
  data: any,
  checked: boolean,
  indeterminate: boolean
) => {
  const nodes = treeRef.value!.getCheckedNodes(true, false);
  // const halfCheckedNodes = treeRef.value!.getHalfCheckedNodes()
  const value = <any>[];
  chechedTags.value = [];
  nodes.forEach((item: any) => {
    value.push(item.id);
    chechedTags.value.push(item);
  });
  tagIds.value = value;
  // console.log('触发树变更事件', tagIds.value)
};
// 树变更e
// 顶部标签显示s
const tagClose = (tag: any) => {
  console.log("tag", tag);
  const index = tagIds.value.indexOf(tag.id);
  const checkedNodes = treeRef.value!.getCheckedNodes(false, true);
  if (index >= 0) {
    tagIds.value.splice(index, 1);
  }
  if (checkedNodes.length > 0) {
    const node = checkedNodes.filter((item: any) => item.id == tag.id)[0];
    treeRef.value!.setChecked(node, false, false);
  }
};
// 顶部标签显示e
defineExpose({
  showEdit
});
</script>

<style lang="scss" scoped>
.value-span {
  color: #d3d7d9;
}
.button-div {
  z-index: 999;
  height: 50px;
  width: 100%;
  background-color: #ddd;
  position: fixed;
  bottom: 0;
}
.cheched-list {
  width: 100%;
  height: calc(50% - 50px);
}
.tag-check-list {
  width: 100%;
  height: calc(100% - 50px);
  overflow-y: auto;
  padding-top: 10px;
  .tag-name {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
.tag-list {
  width: 100%;
  height: 50%;
  padding-right: 20px;
  // overflow: auto;
  .tree-b {
    height: calc(100% - 70px);
    overflow: auto;
    margin-top: 20px;
  }
}
</style>
