<template>
  <!-- 通用下拉，可单选多选，支持接口做参，回传已选为[1,2] -->
  <el-select
    v-model="modelValue"
    class="select-tag-max"
    filterable
    clearable
    collapse-tags
    collapse-tags-tooltip
    reserve-keyword
    :multiple="multiple"
    @change="onChange"
    :value-key="select[1]"
    :placeholder="placeholder"
    :fallback-placements="fallbackPlacements"
    :style="{ width: `${selectWidth}` }"
    :disabled="disabled"
  >
    <el-option
      v-for="item in options"
      :key="item[select[1]]"
      :label="item[select[0]] ? item[select[0]] : item[select[2]]"
      :value="item[select[1]]"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
// :value="multiple ? item : item[select[1]]"
defineOptions({
  name: "HdComSelect"
});
const props = defineProps({
  select: {
    type: <any>Array,
    default: ["name", "id"] //label value 当label没有的时候取第三个
  },
  modelValue: {
    type: [String, Number, Array],
    default: ""
  }, //回显值
  multiple: {
    type: Boolean,
    default: true
  }, //是否多选
  placeholder: {
    type: String,
    default: "请选择"
  }, //文字提示
  fallbackPlacements: {
    type: <any>Array,
    default: () => {
      return ["bottom-start"];
    }
  }, //提示位置
  disabled: {
    type: Boolean,
    default: false
  }, //是否禁选
  selectWidth: {
    type: String,
    default: "180px"
  }, //宽度
  apiParams: {
    type: Object,
    default: () => {
      return {};
    }
  }, //接口参数
  api: {
    type: Function,
    default: () => {
      return async () => {
        return {
          code: 200,
          data: [],
          message: "success"
        };
      };
    }
  }, //请求接口api
  optionsList: {
    type: Array,
    default: () => {
      return [];
    }
  }, //直接显示下拉数据 不走请求
  isAutoRequest: {
    type: Boolean,
    default: true
  }, //是否自动请求
  extraOptions: {
    type: Array,
    default: () => {
      return [];
    }
  } //额外的选项 一般是全部这些
});
const emit = defineEmits(["update:modelValue", "change"]);
const options = ref<any>([]);
const modelValue = ref<any>("");
const getData = async (query?: any) => {
  let param = {
    ...props.apiParams,
    ...query
  };
  // 如果有optionsList直接使用不走请求
  if (props.optionsList.length > 0) {
    options.value = props.optionsList;
    modelValue.value = props.modelValue;
  } else {
    let { data, message, code } = await props.api(param);
    if (code === 200 || code === 20000) {
      // 有的是data 有的是list
      if (data && data.list) {
        options.value = data.list;
      } else {
        options.value = data;
      }
      pluginAddOptions();
      if (Array.isArray(props.modelValue)) {
        // modelValue.value = props.modelValue.map((item: any) => {
        //   return options.value.find((i: any) => i.id === item);
        // });
        // 回显应该有缺陷 碰到了改
        modelValue.value = props.modelValue;
      } else {
        modelValue.value = props.modelValue;
      }
    } else {
    }
  }
};

// 将外部传入的加到options里面 但是options里面可能是空数组或者null
const pluginAddOptions = () => {
  if (options.value) {
    options.value = [...props.extraOptions, ...options.value];
  } else {
    options.value = props.extraOptions;
  }
};
const clearData = () => {
  options.value = [];
  modelValue.value = "";
};
const onChange = (val: any) => {
  emit("update:modelValue", val);
  emit("change");
};
onMounted(() => {
  props.isAutoRequest && getData();
});
watch(
  () => props.modelValue,
  val => {
    modelValue.value = val;
  },
  { immediate: true, deep: true }
);
defineExpose({
  getData,
  clearData,
  options
});
</script>

<style scoped lang="scss"></style>
