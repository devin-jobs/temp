<template>
  <el-select
    v-model="value"
    class="depart-select"
    filterable
    clearable
    :disabled="disabled"
    @change="onChange"
  >
    <el-option
      v-for="item in GENDER_STATUS"
      :key="item.id"
      :label="item.label"
      :value="item[select]"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch, defineOptions, onMounted } from "vue";
import { GENDER_STATUS } from "@/utils/constant/other";
defineOptions({
  name: "GenderSelect"
});
const props = defineProps({
  select: {
    type: String,
    default: "id"
  },
  id: {
    type: [String, Number],
    default: ""
  },
  disabled: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["update:id"]);
const value = ref<any>("");
watch(
  () => props.id,
  val => {
    value.value = val;
  },
  {
    immediate: true
  }
);
const reset = () => {
  value.value = "";
};
const onChange = (val: any) => {
  emit("update:id", val);
};

onMounted(() => {});
</script>

<style scoped lang="scss"></style>
