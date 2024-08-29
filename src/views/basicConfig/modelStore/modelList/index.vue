<template>
  <div class="auto-height-container record-hd-container no-background-container form-table-wrapper">
    <div class="form-table-content">
      <div class="left-nav">
        <hd-card class="auto-height-card has-bottom left-content">
          <div class="filter-comp-title">筛选</div>
          <div class="filter-comp-group" v-for="(item, index) in categories">
            <div class="filter-comp-group-title">
              {{ item.name }}
              <el-button link type="primary" @click="handleTag(item.subcategories)">全部</el-button>
            </div>
            <span
              class="tag-checkable"
              :class="{ 'tag-checkable-checked': ele.checked }"
              v-for="(ele, idx) in item.subcategories"
              @click="handleTag(ele)"
            >
              {{ ele.name }}
            </span>
          </div>
        </hd-card>
      </div>

      <div class="right-content">
        <hd-card class="auto-height-card has-bottom ac-table">
          <div class="loading-wrapper">
            <div>
              <div
                class="model-card hot"
                v-for="(item, index) in cardList"
                :key="index"
                @mouseover="handleMouse(item, true)"
                @mouseout="handleMouse(item, false)"
              >
                <header>
                  <span class="model-icon" :style="{ 'background-image': `url(${model1})` }"></span>
                  <div class="card-name">{{ item.name }}</div>
                </header>
                <div class="model-card-description">
                  {{ item.desc }}
                </div>
                <footer>
                  <div class="model-card-apply">应用：{{ item.applicationCategory }}</div>
                  <div class="model-card-time">
                    <div>{{ item.utime ? dayjs(item.utime).format("YYYY-MM-DD") : "" }}更新</div>
                    <div
                      class="model-card-actions"
                      :style="{ display: item.hover ? 'flex' : 'none' }"
                    >
                      <div class="actions-item">
                        <img src="@/assets/models/api.png" alt="" />
                        <el-button link type="primary">API文档</el-button>
                      </div>
                      <div class="actions-item">
                        <img src="@/assets/models/experience.png" alt="" />
                        <el-button link type="primary">体验</el-button>
                      </div>
                      <div class="actions-item">
                        <img src="@/assets/models/gallery.png" alt="" />
                        <el-button link type="primary">画廊</el-button>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </hd-card>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import model1 from "@/assets/models/model-1.png";
import { getListOfModelShops } from "@/api/modelStore";
import dayjs from "dayjs";
defineOptions({
  name: "ModelList"
});
// 筛选数据
const categories = ref<any>([
  {
    name: "模型类别",
    subcategories: [
      { id: 1, name: "文本处理", value: 1 },
      { id: 2, name: "语音处理", value: 2 },
      { id: 3, name: "图像处理", value: 3 }
    ]
  },
  {
    name: "应用类别",
    subcategories: [
      { id: 4, name: "提效分配算法", value: 1 },
      { id: 5, name: "大模型语义质检模型", value: 2 },
      { id: 6, name: "话术引导", value: 3 }
    ]
  }
]);
// 模型列表
const arr1 = [
  {
    id: 1,
    name: "语义质检模型-叠加包类",
    type: "文本处理",
    applicationCategory: "大模型语义质检模型",
    label: "运营商垂直类小模型",
    desc: "依托先进的语义分析技术和大数据算法，能够对海量的文本内容进行全面、深入的剖析。模型具有出色的灵活性和定制性，依据运营商行业的规范和需求进行个性化配置，满足叠加包各方面的质检需求。",
    tryUsed: true,
    enabled: true,
    ctime: "2024-07-09 13:50:28",
    utime: "2024-07-16 10:58:40"
  },
  {
    id: 2,
    name: "坐席画像",
    type: "文本处理",
    applicationCategory: "提效分配算法",
    label: "推荐",
    desc: "企业专属的精细化服务分析模型，相较传统的坐席评估方式实现了全面革新与优化，广泛适用于各类客户服务场景；支持深度挖掘坐席的多元特征数据，保障对坐席的精准描绘与分析。",
    tryUsed: false,
    enabled: true,
    ctime: "2024-07-12 16:39:09",
    utime: "2024-07-12 16:45:47"
  },
  {
    id: 3,
    name: "用户画像",
    type: "文本处理",
    applicationCategory: "提效分配算法",
    label: "推荐",
    desc: "自主研发的核心级精准分析模型，相较传统的用户分析手段实现了全面的优化与革新，广泛适用于各类业务的精准营销场景；支持深度融合多源数据渠道，确保用户特征洞察的全面与准确。",
    tryUsed: false,
    enabled: true,
    ctime: "2024-07-12 16:41:06",
    utime: "2024-07-12 16:47:23"
  },
  {
    id: 4,
    name: "数据敏感度",
    type: "文本处理",
    applicationCategory: "提效分配算法",
    label: "预测",
    desc: "精心打造的尖端级高效分析模型，相较上一代实现了功能的全面提升，广泛应用于各个行业的数据处理复杂任务场景；支持智能对接权威数据平台，保障数据评估的精准度和及时性。",
    tryUsed: false,
    enabled: true,
    ctime: "2024-07-12 16:41:41",
    utime: "2024-07-12 16:46:54"
  }
];
const cardList: any = ref([
  // {
  //   title: "全流程审批",
  //   description:
  //     "全流程审批包括从申请、审核到最终的审批完成，能够全面覆盖企业在不同环节的审批需求。不同的流程节点可以灵活配置，以适应企业的具体业务需求。有效提高审批效率，缩短审批周期。全流程审批包括从申请、审核到最终的审批完成，能够全面覆盖企业在不同环节的审批需求。不同的流程节点可以灵活配置，以适应企业的具体业务需求。有效提高审批效率，缩短审批周期。全流程审批包括从申请、审核到最终的审批完成，能够全面覆盖企业在不同环节的审批需求。不同的流程节点可以灵活配置，以适应企业的具体业务需求。有效提高审批效率，缩短审批周期。全流程审批包括从申请、审核到最终的审批完成，能够全面覆盖企业在不同环节的审批需求。不同的流程节点可以灵活配置，以适应企业的具体业务需求。有效提高审批效率，缩短审批周期。",
  //   author: "发布者: 系统管理员",
  //   date: "2023-07-14",
  //   apply: "提效分配算法"
  // },
]);
// 点击标签选中
const handleTag = (items: any | any[]) => {
  const toggleTag = (item: any, checked: boolean) => {
    categories.value.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (subcategory.id === item.id) {
          subcategory.checked = checked;
        }
      });
    });
  };
  if (Array.isArray(items)) {
    // 如果是数组，将所有传入的标签全部选中
    items.forEach(item => toggleTag(item, true));
  } else {
    // 如果是单个标签对象，取反其选中状态
    categories.value.forEach(category => {
      category.subcategories.forEach(subcategory => {
        if (subcategory.id === items.id) {
          subcategory.checked = !subcategory.checked;
        }
      });
    });
  }
};
// 获取初始模型数据
const getModelList = () => {
  let params = {
    type: "", //模型类别
    applicationCategory: "" //应用类别
  };
  getListOfModelShops(params)
    .then(res => {
      if (res.success) {
        cardList.value = res.data;
      }
    })
    .catch(err => {
      cardList.value = arr1;
    });
};
//悬浮变更
const handleMouse = (item: any, hover: boolean) => {
  item.hover = hover;
};
onMounted(() => {
  getModelList();
});
</script>
<style lang="scss" scoped>
.auto-height-container {
  padding: var(--el-padding);
  overflow-x: auto;
}
.form-table-content {
  display: grid;
  grid-template-columns: 270px 1fr;
}
.left-content {
  height: 100%;
  overflow-y: auto;
}
.filter-comp-title {
  margin-bottom: 18px;
  font-size: 18px;
  color: #454c5c;
  line-height: 22px;
  font-weight: 500;
}
.filter-comp-group {
  margin-bottom: 18px;
  .filter-comp-group-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #454c5c;
    font-weight: 500;
    font-size: 16px;
    line-height: 26px;
  }
  .tag-checkable {
    cursor: pointer;
    display: inline-block;
    height: auto;
    margin: 10px 8px 0 0;
    padding: 2px 8px;
    font-size: 12px;
    line-height: 20px;
    background: #f1f5fb;
    border-radius: 6px;
    transition: all 0.3s;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 400;
    font-size: 12px;
    color: #454c5c;
  }
  .tag-checkable-checked {
    background: #3370ff;
    color: #ffffff;
  }
}
.ac-table {
  min-width: 800px;
  background-color: transparent;

  :deep() {
    .el-card__body {
      padding: 0 var(--el-padding);
    }
  }
  .loading-wrapper {
    // height: 100%;
    position: relative;
    overflow-y: auto;
  }
  .loading-wrapper > div {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    .model-card {
      position: relative;
      width: calc(50% - 16px);
      // min-width: 375px;
      height: 267px;
      margin-bottom: 16px;
      margin-right: 16px;
      padding: 16px;
      background-image: linear-gradient(180deg, #fff 2%, #fff 30%);
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .model-icon {
        float: left;
        margin-right: 12px;
        width: 24px;
        height: 24px;
        vertical-align: bottom;
        line-height: 24px;
        background-size: contain;
        background-origin: content-box;
        background-clip: content-box;
        background-repeat: no-repeat;
      }
      .card-name {
        line-height: 24px;
        color: #454c5c;
        font-weight: 500;
      }
      .model-card-description {
        height: 127px;
        font-weight: 400;
        font-size: 14px;
        color: #454c5c;
        display: -webkit-box; /* 必须结合 -webkit-box-orient 使用 */
        -webkit-box-orient: vertical; /* 设置盒子为垂直排列 */
        -webkit-line-clamp: 6; /* 限制显示的行数为5行 */
        overflow: hidden; /* 隐藏超出部分的内容 */
        text-overflow: ellipsis; /* 使用省略号表示超出部分 */
        white-space: normal; /* 正常的文本换行 */
      }
      footer {
        font-weight: 400;
        font-size: 14px;
        .model-card-apply {
        }
        .model-card-time {
          color: #b0b0bc;
          height: 32px;
          line-height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .model-card-actions {
            display: flex;
            align-items: center;
            .actions-item {
              display: flex;
              align-items: center;
              font-weight: 400;
              font-size: 14px;
              color: #3370ff;
            }
            img {
              width: 20px;
              margin-left: 6px;
              margin-right: 3px;
            }
          }
        }
      }
    }
    .model-card.hot::before {
      content: "";
      width: 48px;
      height: 24px;
      display: block;
      position: absolute;
      top: -1px;
      right: -1px;
      background: url(@/assets/zuoxi/youxiuSelect.png) no-repeat center center / 100%;
      border-top-right-radius: 4px;
    }
    .model-card.hot::after {
      // content: "热门";
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #ffffff;
      line-height: 20px;
      font-weight: 400;
      display: block;
      position: absolute;
      top: 2px;
      right: 6px;
    }
    .model-card:hover {
      transform: scale(1.01);
      transition: all 0.1s ease-in-out;
      background: linear-gradient(180deg, #dae5ff 0%, #ffffff 57%);
    }
  }
}
@media screen and (min-width: 1657px) {
  .model-card {
    width: calc(33.3% - 16px) !important;
  }
}
</style>
