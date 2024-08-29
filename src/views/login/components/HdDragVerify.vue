<!--  -->
<template>
  <div ref="wrap" class="slider-unlock">
    <div class="before">请按住滑块拖动验证</div>
    <div ref="after" class="after">
      <div class="after-inner">{{ success ? "验证成功" : "正在验证..." }}</div>
    </div>
    <div ref="slider" class="slider">
      <div class="iconfont icon-a-" v-if="!success">
        <img :src="right2" alt="" />
      </div>
      <div class="iconfont icon-dagou" v-else>
        <img :src="success1" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import right2 from "@/assets/login/right2-1.png";
import success1 from "@/assets/login/success-1.png";
const success = ref(false);
var clear: any = null;
const after: any = ref(null);
const slider: any = ref(null);
const wrap: any = ref(null);
const emit = defineEmits(["sliderNo"]);
function init() {
  // 设置after-inner的固定宽度
  after.value.childNodes[0].style.width = wrap.value.offsetWidth - 48 + "px";
  // 滑块移动最大位置
  const limit = wrap.value.offsetWidth - slider.value.offsetWidth;

  // 实时计算滑块的偏移量
  let offsetX: any;
  // 点击滑块时的鼠标X位置
  let initX: any;

  // // 页面鼠标移动事件
  const docMousemoveHandler = (e: any) => {
    // 获取移动后鼠标实时位置
    const moveX = e.clientX;
    // 计算滑块应该移动的偏移量
    offsetX = moveX - initX;

    // 限制上下限
    if (offsetX < 0) {
      offsetX = 0;
    } else if (offsetX > limit) {
      offsetX = limit;
    }

    // 移动滑块
    slider.value.style.left = offsetX + "px";
    // 修改高亮背景宽度
    after.value.style.width = offsetX + "px";
    //此处写你要做函数
    if (offsetX >= limit) {
      success.value = true;
      emit("sliderNo", success.value);
      document.removeEventListener("mousemove", docMousemoveHandler);
      slider.value.removeEventListener("mousedown", sliderMousedownHandler);
      // 成功
      after.value.childNodes[0].style.background = "#5A8EFF";
      wrap.value.style.background = "#5A8EFF";
    }
  };
  // 页面鼠标松开事件
  const docMouseupHandler = (e: any) => {
    // 解绑事件
    document.removeEventListener("mousemove", docMousemoveHandler);
    // 重置滑块
    if (offsetX < limit) {
      slider.value.style.left = 0;
      after.value.style.width = 0;
    }
  };

  // 滑块点击事件
  const sliderMousedownHandler = (e: any) => {
    // 获取鼠标位置
    initX = e.clientX;
    // 绑定页面的鼠标移动事件
    document.addEventListener("mousemove", docMousemoveHandler);
  };

  // 绑定滑块点击事件
  slider.value.addEventListener("mousedown", sliderMousedownHandler);

  // 页面鼠标松开事件
  document.addEventListener("mouseup", docMouseupHandler);

  // 定义清理方法
  clear = () => {
    document.removeEventListener("mousemove", docMousemoveHandler);
    slider.value.removeEventListener("mousedown", sliderMousedownHandler);
    document.removeEventListener("mouseup", docMouseupHandler);
  };
}
onMounted(() => {
  init();
});
onBeforeUnmount(() => {
  clear && clear();
});
</script>
<style lang="scss" scoped>
.slider-unlock {
  width: 100%;
  height: 52px;
  background: #ebf1fb;
  border-radius: 4px;
  position: relative;
  box-sizing: border-box;
  user-select: none;
  border-radius: 10px;
  // background: linear-gradient(90deg, #b3d2ff 26%, #9afef8 100%);

  .before,
  .after {
    position: absolute;
    // margin: -1px 0 0 -1px;
    top: 0;
    left: 0;
    z-index: 1;
    height: calc(100% - 2px);
    box-sizing: content-box;
    font-size: 14px;
    line-height: 52px;
    text-indent: 4em;
    text-align: center;
  }

  .before {
    width: calc(100% - 52px);
    color: #92979c;
    padding: 0 1px 1px 0;
    text-align: center;
  }

  .after {
    width: 0;
    overflow: hidden;
    padding: 0 0 1px 0;

    &-inner {
      position: absolute;
      width: 100%;
      height: 100%;
      color: #fff;
      // background-color: #40c057;
      background: linear-gradient(90deg, #b3d2ff 26%, #9afef8 100%);
    }
  }

  .slider {
    position: absolute;
    // margin: -1px 0 0 -1px;
    top: 0;
    left: 0;
    z-index: 3;
    width: 52px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    cursor: pointer;
    background: no-repeat center center #fff;
    user-select: none;
    border: 1px solid #dbe4f5;
    border-radius: 10px;

    .icon-a- {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 2px);
      user-select: none;
      img {
        width: 16px;
        -webkit-user-drag: none;
      }
    }

    .icon-dagou {
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 2px);
      user-select: none;
      img {
        width: 16px;
        -webkit-user-drag: none;
      }
    }
  }
}
.after-inner {
  border-radius: 10px 0 0 10px;
}
</style>
