<template>
  <!-- 标签数选择 -->
  <el-tree-select
    ref="treeRef"
    v-model="value"
    :data="source.treeList"
    node-key="id"
    value-key="id"
    multiple
    :render-after-expand="false"
    :props="source.defaultProps"
    :filter-node-method="filterNode"
    :default-checked-keys="defaultCheckedKeys"
    show-checkbox
    collapse-tags
    clearable
    collapse-tags-tooltip
    @change="handleChange"
    :placeholder="placeholder"
    class="role-tree select-tag-max"
  >
    <template #header>
      <el-input
        v-model="filterText"
        style="width: 240px"
        placeholder="过滤关键词"
      />
    </template>
  </el-tree-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue";
import { ElTree } from "element-plus";
import { tagTree } from "@/api/seatManage";
defineOptions({
  name: "TagTreeSelect"
});
interface Tree {
  [key: string]: any;
}

const props = defineProps({
  id: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: "项目技能标签"
  }
});
const value = ref<any>([]);
nextTick(() => {
  value.value = props.id;
});
const defaultCheckedKeys = ref(props.id);
const source = ref({
  defaultProps: {
    children: "children",
    label: "label"
  },
  treeList: [] //树数据
});
const getAuth = async () => {
  const { code, data } = await tagTree({});
  if (code == 20000) {
    source.value.treeList = data;
  } else {
    source.value.treeList = [];
  }
};
// 筛选树
const filterText = ref("");
const treeRef = ref<InstanceType<typeof ElTree>>();
watch(filterText, val => {
  treeRef.value!.filter(val);
});
const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.includes(value);
};
const emit = defineEmits(["update:id"]);
// 树变更事件
const handleChange = (val: any, item: any, a: any) => {
  emit("update:id", value);
};
onMounted(() => {
  getAuth();
});
</script>

<style scoped lang="scss">
.role-tree {
  width: 175px;
}
</style>
