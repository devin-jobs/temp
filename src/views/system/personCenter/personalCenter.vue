<template>
  <div class="page-main">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-anchor
          class="anchorClass"
          :container="containerRef"
          direction="vertical"
          type="default"
          :offset="0"
          @click="handleClick"
        >
          <el-anchor-link href="#part1" title="个人信息" />
          <el-anchor-link href="#part2" title="技能标签" />
          <el-anchor-link href="#part3" title="荣誉成就" />
          <el-anchor-link href="#part4" title="学习记录" />
        </el-anchor>
      </el-col>
      <el-col :span="19">
        <div ref="containerRef" class="containerBox">
          <div id="part1" style="margin-top: 1px" class="part part1Class">
            <div class="partTitle">坐席档案</div>
            <div class="line"></div>
            <div class="innerTitle">账号信息</div>
            <div class="info">
              <span>账号：</span>
              <span class="infoContent">{{ currentShowMessage.accountName }}</span>
            </div>
            <div class="info">
              <span>手机号码：</span>
              <span class="infoContent">{{ currentShowMessage.phone }}</span>
            </div>
            <div class="info">
              <span>账号角色：</span>
              <span class="infoContent">{{ getUserTypeRole(currentShowMessage.type) }}</span>
            </div>
            <div class="innerTitle">基本信息</div>
            <div class="info">
              <span>姓名：</span>
              <span class="infoContent">{{ currentShowMessage.name }}</span>
            </div>
            <div class="info">
              <span>性别：</span>
              <span class="infoContent">{{ gender(currentShowMessage.sex) }}</span>
            </div>
            <div class="info">
              <span>年龄：</span>
              <span class="infoContent">{{ getAgeByBirthday(currentShowMessage.birthday) }}</span>
            </div>
            <div class="innerTitle">身份认证</div>
            <div class="info">
              <span>本人照片：</span>
              <span
                v-if="currentShowMessage.userFace"
                @click="openUserMessage(3)"
                class="blue-color"
                >查看</span
              >
              <template v-else>
                <span v-if="isSelf" @click="openFirstFaceAuth(false)" class="blue-color"
                  >去认证 ></span
                >
                <span v-else>暂无</span>
              </template>
            </div>
            <div class="info">
              <span>声纹：</span>
              <span
                v-if="currentShowMessage.userVoice"
                @click="openUserMessage(1)"
                class="blue-color"
                >播放</span
              >
              <template v-else>
                <span v-if="isSelf" @click="openFirstPhoneAuth(false)" class="blue-color"
                  >去录制 ></span
                >
                <span v-else>暂无</span>
              </template>
            </div>
            <div class="info">
              <span>身份证照片：</span>
              <span
                v-if="currentShowMessage.userIdcard?.obverseUrl"
                @click="openUserMessage(2)"
                class="blue-color"
                >查看</span
              >
              <template v-else>
                <span v-if="isSelf" class="blue-color" @click="openUserMessage(2)">去认证 ></span>
                <span v-else>暂无</span>
              </template>
            </div>
            <div class="info">
              <span>身份证号：</span>
              <span v-if="currentShowMessage.userIdcard?.idcard" class="infoContent">{{
                currentShowMessage.userIdcard?.idcard
              }}</span>
              <span v-else>暂无</span>
            </div>
          </div>
          <div id="part2" class="part part2Class">
            <div class="partTitle">技能标签</div>
            <div class="line"></div>
            <div class="innerTitle">业务技能：</div>
            <div class="tagsBox">
              <span
                class="tags"
                v-for="(item, index) in getSkillOrBusiness(currentShowMessage.tags, 1)"
                :key="index"
              >
                {{ item.name }}
              </span>
            </div>
            <div class="innerTitle">擅长业务标签：</div>
            <div class="tagsBox">
              <span
                class="tags"
                style="background-color: #3370ff"
                v-for="(item, index) in getSkillOrBusiness(currentShowMessage.tags, 2)"
                :key="index"
              >
                {{ item.name }}
              </span>
            </div>
            <div class="innerTitle">工作履历：</div>
            <div class="content">
              <ul v-if="experiences && experiences.length > 0">
                <li v-for="exp in experiences" :key="exp.id">
                  <div class="skills-item">
                    <span class="time">
                      {{ dateFormat(exp.entryTime, "YYYY-MM-DD") }} -
                      {{
                        exp.dimissionTime
                          ? dateFormat(exp.dimissionTime, "YYYY-MM-DD")
                          : dateFormat(exp.entryTime, "YYYY-MM-DD")
                            ? "至今"
                            : ""
                      }}
                    </span>
                    <div class="main-company">
                      <div class="company-top">
                        <div>
                          <span>{{ exp.companyName }}</span>
                          <span style="margin-left: 20px; color: #3370ff">{{ exp.roleName }}</span>
                        </div>
                        <span style="text-align: right">{{ exp.accountName }}</span>
                      </div>
                      <div class="skill-list">
                        <span class="skill-title">项目技能标签：</span>
                        <span v-if="exp.tags" class="skill-tag-box">
                          <span
                            class="skill-tag"
                            v-for="(item, index) in getSkillOrBusiness(exp.tags, 1)"
                            :key="index"
                          >
                            {{ item.name }}
                          </span>
                        </span>
                      </div>
                      <div class="skill-list">
                        <span class="skill-title">擅长业务标签：</span>
                        <span v-if="exp.tags" class="skill-tag-box">
                          <span
                            class="skill-tag"
                            v-for="(item, index) in getSkillOrBusiness(exp.tags, 2)"
                            :key="index"
                          >
                            {{ item.name }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <el-empty v-else description="暂无工作经历" :image="empty3" :image-size="200">
              </el-empty>
            </div>
          </div>
          <div id="part3" class="part part3Class">
            <div class="partTitle">荣誉成就</div>
            <div class="partContent">
              <div class="contentItem">
                <div class="tabBox">
                  <span :class="['tab', activeTab == 1 ? 'active' : '']" @click="tabClick(1)"
                    >全部
                  </span>
                  <span :class="['tab', activeTab == 2 ? 'active' : '']" @click="tabClick(2)"
                    >优秀坐席</span
                  >
                  <span :class="['tab', activeTab == 3 ? 'active' : '']" @click="tabClick(3)"
                    >星级坐席</span
                  >
                </div>
                <div class="tabContent">
                  <template v-if="getAwards(currentShowMessage.awards, [1, 2]).length > 0">
                    <div
                      v-if="
                        (activeTab == 1 || activeTab == 2) &&
                        getAwards(currentShowMessage.awards, 1).length > 0
                      "
                      class="tabContent-item"
                    >
                      <div :class="['Item', selected == 1 ? 'Itembg' : '']">
                        <img src="@/assets/zuoxi/youxiu.png" alt="" @click="selectedCheck(1)" />
                      </div>
                      <div
                        style="
                          text-align: center;
                          color: #454c5c;
                          font-weight: 500;
                          margin-top: 5px;
                        "
                      >
                        优秀坐席
                      </div>
                      <div
                        style="
                          text-align: center;
                          color: #808899;
                          margin-top: 10px;
                          font-size: 16px;
                        "
                      >
                        {{
                          getAwards(currentShowMessage.awards, 1).length > 0
                            ? dateFormat(
                                getAwards(currentShowMessage.awards, 1)[0].validTimeEnd,
                                "YYYY-MM"
                              )
                            : ""
                        }}
                      </div>
                    </div>
                    <div
                      v-if="
                        (activeTab == 1 || activeTab == 3) &&
                        getAwards(currentShowMessage.awards, 2).length > 0
                      "
                      class="tabContent-item"
                    >
                      <div :class="['Item', selected == 2 ? 'Itembg1' : '']">
                        <img src="@/assets/zuoxi/xingji.png" alt="" @click="selectedCheck(2)" />
                      </div>
                      <div
                        style="
                          text-align: center;
                          color: #454c5c;
                          font-weight: 500;
                          margin-top: 5px;
                        "
                      >
                        星级坐席
                      </div>
                      <div
                        style="
                          text-align: center;
                          color: #808899;
                          margin-top: 10px;
                          font-size: 16px;
                        "
                      >
                        {{
                          getAwards(currentShowMessage.awards, 2).length > 0
                            ? dateFormat(
                                getAwards(currentShowMessage.awards, 2)[0].validTimeEnd,
                                "YYYY-MM"
                              )
                            : ""
                        }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="tabContent-empty">
                      <el-empty
                        :image-size="200"
                        :image="empty4"
                        description="您当前还没有获得荣耀成就哦~继续加油吧"
                      />
                    </div>
                  </template>
                </div>
              </div>
              <div class="contentItem">
                <div class="contentItem-title">
                  <span style="float: left">{{ selected == 1 ? "优秀坐席" : "星级坐席" }}</span>
                  <span style="float: right; font-size: 14px; font-weight: 400; color: #808899"
                    >被评定{{
                      selected == 1
                        ? getAwards(currentShowMessage.awards, 1).length
                        : getAwards(currentShowMessage.awards, 2).length
                    }}次</span
                  >
                </div>
                <div class="contentItem-date">
                  <span
                    >获奖日期{{
                      selected == 1
                        ? getAwards(currentShowMessage.awards, 1)
                            .map((item: any) => {
                              return dateFormat(item.validTimeEnd, "YYYY-MM");
                            })
                            .join("、")
                        : getAwards(currentShowMessage.awards, 2)
                            .map((item: any) => {
                              return dateFormat(item.validTimeEnd, "YYYY-MM");
                            })
                            .join("、")
                    }}</span
                  >
                </div>
                <div class="contentItem-content">
                  介绍：{{ selected == 1 ? yxzx : selected == 2 ? xjzx : "" }}
                </div>
              </div>
            </div>
          </div>
          <div id="part4" class="part part4Class">
            <div class="partTitle">学习记录</div>
            <div class="part4Content">
              <div class="part4content-item">
                <div class="tabBox">
                  <span :class="['tab', activeStudy == 1 ? 'active' : '']" @click="studyClick(1)"
                    >总览
                  </span>
                  <span :class="['tab', activeStudy == 2 ? 'active' : '']" @click="studyClick(2)"
                    >优秀录音</span
                  >
                </div>
                <div class="studyClass">
                  <div class="studyItem">
                    <div class="studyNum">64</div>
                    <div class="studyType">总次数</div>
                  </div>
                  <div class="studyItem">
                    <div class="studyNum" style="color: #f6c12d">64</div>
                    <div class="studyType">学习录音总条数</div>
                  </div>
                </div>
                <div class="during">学习时长：1天5小时26分</div>
              </div>
              <div class="part4content-item">
                <div class="partTitle">详细数据</div>
                <div class="part4content-item-content">2024.03.22 优秀录音 4条</div>
                <div class="part4content-item-content">2024.03.22 优秀录音 4条</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <userMessageC ref="userMessageRef" :currentShowMessage="currentShowMessage" />
    <miniIdCardMessage ref="miniIdCardMessageRef" @refresh="init" />
    <PhoneAuthDialog ref="PhoneAuthDialogRef" @voiceVerifyFnReg="init" />
    <FaceAuthDialog ref="FaceAuthDialogRef" @faceVerifyFnReg="init" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import miniIdCardMessage from "./miniIdCardMessage.vue";
import userMessageC from "./userMessage.vue";
import PhoneAuthDialog from "@/views/login/components/PhoneAuthDialog.vue";
import FaceAuthDialog from "@/views/login/components/FaceAuthDialog.vue";
import { useRouter, useRoute } from "vue-router";
import { selectUserById, workExperienceByUserId } from "@/api/seatManage";
import { ElMessage } from "element-plus";
import empty3 from "@/assets/empty/empty-3.png";
import empty4 from "@/assets/empty/empty-4.png";
import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
const { userMessage } = storeToRefs(useUserStoreHook());
import { getUserTypeRole, gender, getAgeByBirthday, dateFormat } from "@/utils/constant/formatter";
import { parseSearchObj } from "@/utils/constant/location";
const yxzx = ref(
  "能够在对话中快速与客户建立融洽的关系，破冰并创造良好的交流氛围。具备良好的理解力，通过沟通明白客户的需求，注意倾听，准确把握客户意图。在沟通过程中，让客户感受到愉悦的服务，并且在电话沟通过程中始终贯彻自己的目的，保持稳定的情绪和语言逻辑。保障河北优质坐席规模全国领先、着力提升交互能力"
);
const xjzx = ref(
  "星级坐席是客服团队中的佼佼者，在优秀坐席的基础上，展现出更高层次的专业能力和服务水平。你们的表现不仅能够提升客户满意度，还能增强公司的市场竞争力。从而更加的保障河北优质坐席规模全国领先、着力提升交互能力。"
);

const route = useRoute();
const containerRef = ref(null);
const currentShowMessage = ref<any>({});
const experiences = ref<any>([]);
// 判断是不是本人的信息
const isSelf = ref(true);

onMounted(() => {
  containerRef.value.scrollTop = "1";
});

// 查看信息 1声纹信息 2身份证信息 身份证照片信息 3人脸验证信息
const userMessageRef = ref();
const miniIdCardMessageRef = ref();
const openUserMessage = (type: Number) => {
  // userMessageRef.value.showEdit({ type });
  if (type === 2) {
    miniIdCardMessageRef.value.showEdit({
      isSelf: isSelf.value,
      id: userMessage.value.id
    });
  } else {
    userMessageRef.value.showEdit({ type });
  }
};

// 获取项目技能或擅长业务
const getSkillOrBusiness = (tags: any, type: number) => {
  let arr = [];
  if (tags && tags.length > 0) {
    arr = tags.filter((ele: any) => ele.dataSource == type);
  }
  return arr;
};
// 获取项目技能或擅长业务
const getAwards = (awards: any, type: any) => {
  let arr = [];
  if (awards && awards.length > 0) {
    arr = awards.filter((ele: any) => {
      if (Array.isArray(type)) {
        return type.includes(ele.type);
      } else {
        return ele.type == type;
      }
    });
  }
  return arr;
};
// 获取个人信息
const selectUserInfo = async () => {
  const { code, data, message } = await selectUserById();
  if (code === 20000) {
    console.log(data);
    currentShowMessage.value = data;
    if (getAwards(currentShowMessage.value.awards, 1).length < 1) {
      selected.value = 2;
    } else {
      selected.value = 1;
    }
  } else {
    ElMessage.error(message);
  }
};
// 获取工作经历
const getWorkExperienceByUserId = async () => {
  const { code, data, message } = await workExperienceByUserId();
  if (code === 20000) {
    experiences.value = data;
  } else {
    experiences.value = [];
    ElMessage.error(message);
  }
};
selectUserInfo();
getWorkExperienceByUserId();

const init = () => {
  const api = [selectUserInfo(), getWorkExperienceByUserId()];
  Promise.all(api).then(() => {});
};

// 录制声纹打开
const PhoneAuthDialogRef = ref();
const openFirstPhoneAuth = (validate: boolean) => {
  // validate true表示验证 false表示首次认证
  PhoneAuthDialogRef.value.showEdit({ validate });
};
// 人脸验证打开
const FaceAuthDialogRef = ref();
const openFirstFaceAuth = (validate: boolean) => {
  FaceAuthDialogRef.value.showEdit({ validate });
};

const handleClick = (e: MouseEvent) => {
  e.preventDefault();
};

const activeTab = ref(1);
function tabClick(val) {
  if (val == 1) {
    // 第一个 selected
    if (getAwards(currentShowMessage.value.awards, 1).length < 1) {
      selected.value = 2;
    } else {
      selected.value = 1;
    }
  }
  if (val == 2) {
    selected.value = 1;
  }
  if (val == 3) {
    selected.value = 2;
  }
  activeTab.value = val;
}
const selected = ref(1);
function selectedCheck(val) {
  selected.value = val;
}

const activeStudy = ref(1);
function studyClick(val) {
  activeStudy.value = val;
}
</script>
<style scoped lang="scss">
.page-main {
  padding: var(--el-padding);
}
.anchorClass {
  width: 104px;
  height: 213px;
  background: #ffffff;
  box-shadow: 0px 2px 13px 0px rgba(49, 93, 182, 0.15);
  float: right;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
}
.el-anchor__item {
  margin-bottom: 20px;
}
.containerBox {
  height: calc(100vh - 100px);
  width: 880px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
}
.part {
  width: 880px;
  background: #ffffff;
  border-radius: 20px 20px 20px 20px;
  margin-bottom: 20px;
  padding: 24px 34px;
  .partTitle {
    height: 23px;
    font-weight: 500;
    font-size: 20px;
    color: #454c5c;
    line-height: 23px;
    text-align: left;
    margin-bottom: 13px;
  }
  .line {
    width: 100%;
    height: 0px;
    border: 1px solid #e6e6e6;
    margin-bottom: 13px;
  }
  .innerTitle {
    height: 19px;
    font-weight: 500;
    font-size: 16px;
    color: #454c5c;
    line-height: 19px;
    text-align: left;
    margin-bottom: 15px;
  }
  .info {
    height: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #808899;
    line-height: 20px;
    text-align: left;
    margin-bottom: 13px;
  }
  .infoContent {
    color: #454c5c;
  }
}
.part1Class {
  height: 533px;
}
.part2Class {
  // height: 414px;
  .tagsBox {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: center;
    .tags {
      // float: left;
      padding: 6px 16px;
      text-align: center;
      font-weight: 400;
      font-size: 14px;
      color: #454c5c;
      line-height: 20px;
      background: #f1f5fb;
      border-radius: 6px 6px 6px 6px;
      margin-right: 20px;
      margin-bottom: 10px;
    }
  }
}
.tabBox {
  width: 100%;
  height: 30px;
  font-weight: 400;
  font-size: 16px;
  color: #b0b0bc;
  line-height: 20px;
  .tab {
    padding-bottom: 5px;
    margin-right: 24px;
  }
  .active {
    border-bottom: 5px solid #3370ff;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
  }
}
.part3Class {
  height: 338px;
  .partContent {
    display: flex;
    justify-content: space-between;
    align-content: center;
    .contentItem {
      width: 396px;
      height: 256px;
      background: linear-gradient(180deg, #f4f8fe 0%, rgba(244, 248, 254, 0) 62%);
      border-radius: 18px 18px 18px 18px;
      padding: 15px;
    }
    .tabContent {
      width: 100%;
      height: 190px;
      display: flex;
      justify-content: space-around;
    }
    .tabContent-item {
      width: 140px;
      height: 100%;
      .Item {
        width: 140px;
        height: 140px;
        text-align: center;
        line-height: 140px;
        img {
          width: 97px;
          height: 97px;
          margin: 22px;
        }
      }
      .Itembg {
        background: url(@/assets/zuoxi/youxiuSelect.png) no-repeat center center / 200%;
      }
      .Itembg1 {
        background: url(@/assets/zuoxi/xingjiSelect.png) no-repeat center center / 200%;
      }
    }
    .contentItem-title {
      height: 30px;
      font-weight: 500;
      font-size: 16px;
      color: #454c5c;
    }
    .contentItem-date {
      width: 100%;
      height: 16px;
      font-weight: 400;
      font-size: 14px;
      color: #454c5c;
      line-height: 16px;
      text-align: left;
      margin: 10px 0;
      // 溢出隐藏
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .contentItem-content {
      width: 100%;
      height: 170px;
      overflow: auto;
      font-weight: 400;
      font-size: 14px;
      color: #808899;
      line-height: 20px;
      text-align: left;
      font-style: normal;
      text-transform: none;
    }
  }
}
.part4Class {
  height: 286px;
  .part4Content {
    width: 100%;
    height: 203px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .part4content-item {
    width: 396px;
    height: 100%;
    background: linear-gradient(180deg, #f4f8fe 0%, rgba(244, 248, 254, 0) 62%);
    border-radius: 18px 18px 18px 18px;
    padding: 15px;
  }
  .studyClass {
    width: 100%;
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .studyItem {
      // width: 100%;
      flex: 1;
      height: 80px;
      .studyNum {
        width: 100%;
        height: 50px;
        font-weight: bold;
        font-size: 43px;
        color: #3370ff;
        line-height: 50px;
        text-align: center;
      }
      .studyType {
        height: 19px;
        font-weight: 400;
        font-size: 16px;
        color: #2b2b2b;
        line-height: 19px;
        text-align: center;
      }
      .during {
        height: 19px;
        font-weight: bold;
        font-size: 16px;
        color: #454c5c;
        line-height: 19px;
        text-align: left;
        font-style: normal;
        text-transform: none;
      }
    }
  }
  .part4content-item-content {
    height: 16px;
    font-weight: 400;
    font-size: 14px;
    color: #454c5c;
    line-height: 16px;
    text-align: left;
    margin-bottom: 10px;
  }
}
.blue-color {
  color: #3673f5;
  cursor: pointer;
}
// 工作经历
.content {
  padding: 10px 10px 0 10px;

  ul {
    padding-left: 0;
    list-style-type: none;

    li {
      margin-bottom: 10px;
      color: #2b2b2b;

      strong {
        display: inline-block;
        max-width: 100px;
        font-weight: bold;
        color: #787878;
      }
    }
  }
}

.skills-item {
  width: 539px;
  min-height: 105px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #ccdbec;
  padding: 20px;
  position: relative;
  margin-bottom: 20px;
  .time {
    position: absolute;
    left: 0;
    top: -10px;
    background-color: #fff;
    padding: 2px 5px;
    font-weight: 500;
  }
  .main-company {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .company-top {
      display: flex;
      justify-content: space-between;
      line-height: 19px;
      & :nth-child(1) {
        font-weight: 500;
        font-size: 16px;
        color: #2b2b2b;
      }
      & :nth-child(2) {
        font-weight: 500;
        font-size: 16px;
        color: var(--hd-bule-text-color);
        flex: 1;
        text-align: center;
      }
      & :nth-child(3) {
        font-weight: 400;
        font-size: 14px;
        color: #2b2b2b;
        text-align: right;
      }
    }
    .skill-title {
      display: inline-block;
      margin-top: 10px;
      line-height: 20px;
    }
    .skill-list {
      margin-top: 10px;
    }
    .skill-tag-box {
      .skill-tag {
        display: inline-block;
        margin-top: 10px;
        margin-right: 10px;
        line-height: 20px;
        padding: 4px 12px;
        border-radius: 6px;
        // background: #ecf8ff;
      }
      :nth-child(3n + 1) {
        background: #ecf8ff;
        color: #77b1ed;
      }
      :nth-child(3n + 2) {
        background: rgba(127, 208, 110, 0.15);
        color: #7fd06e;
      }
      :nth-child(3n + 3) {
        background: rgba(252, 152, 69, 0.15);
        color: #fc9845;
      }
    }
  }
}
</style>
