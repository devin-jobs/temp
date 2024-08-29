<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/rule";
import { FormProps } from "./utils/types";
import { useRole } from "./utils/hook";

const { attributeSelect } = useRole();

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    name: "",
    notes: "",
    attributeId: ''
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
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
    <el-form-item label="角色名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        maxlength="40"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
    <el-form-item label="角色描述">
      <el-input
        v-model="newFormInline.notes"
        placeholder="请输入角色描述"
        maxlength="200"
        show-word-limit
        type="textarea"
      />
    </el-form-item>
    <el-form-item label="角色属性" prop="attributeId">
      <el-select
        v-model="newFormInline.attributeId"
        placeholder="请选择角色属性"
        clearable
      >
        <el-option
          v-for="(item, index) in attributeSelect"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>
