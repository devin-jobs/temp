<template>
  <el-dialog
    title="坐席身份信息采集"
    v-model="centerDialogVisible"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
    :show-close="false"
    :close-on-press-escape="false"
    width="850"
    @closed="close"
    class="id-card-dialog loading-class form-dialog-wapper"
  >
    <main v-loading="pageLoading">
      <el-form
        ref="formDataRef"
        label-width="100px"
        :model="formData"
        :rules="rules"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="员工姓名:" prop="name">
              <el-input
                v-model="formData.name"
                placeholder="员工姓名"
                maxlength="20"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号码:" prop="idcard">
              <el-input
                v-model="formData.idcard"
                @input="idcardChange"
                placeholder="身份证"
                maxlength="18"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号码:" prop="phone">
              <el-input
                v-model="formData.phone"
                placeholder="手机号码"
                maxlength="11"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄:" prop="age">
              <el-input
                v-model="formData.age"
                placeholder="年龄"
                disabled
                maxlength="20"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别:" prop="sex">
              <!-- <gender-select
                v-model:id="formData.sex"
                disabled
                title="选择性别"
              /> -->
              <el-select v-model="formData.sex" disabled>
                <el-option
                  v-for="item in GENDER_STATUS"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="入职时间:" prop="entryTime">
              <el-date-picker
                v-model="formData.entryTime"
                type="date"
                placeholder="入职时间"
                :disabled-date="disabledDate"
                disabled
                :shortcuts="shortcuts"
                value-format="x"
              />
            </el-form-item>
          </el-col> -->
        </el-row>

        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="籍贯(省市):" prop="address">
              <el-input
                v-model="formData.address"
                placeholder="例如：北京市朝阳区"
                maxlength="20"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="熟练语言:" prop="languages">
              <LanguagesSelect v-model:id="formData.languages" multiple />
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="身份证照片:" prop="obverseUrl">
              <div style="">
                <UploadDragAndDrop
                  ref="UploadDragAndDropRef"
                  class="w-h-100"
                  @changeFile="changeFile"
                  :limit="10"
                  :isShowList="false"
                  :auto-upload="false"
                  actionUrl="/api/account/api/user/uploadIdcard"
                  :uploadData="uploadData"
                  upLoadFileType=".jpg,.png,.jpeg"
                  :multiple="false"
                  isUpOverlay
                  v-loading="UploadLoadng"
                >
                  <template #trigger>
                    <el-icon class="el-icon--upload upload-img">
                      <img
                        :src="idCardMessage.url"
                        ref="rectifyImg"
                        style="object-fit: contain; width: 100%; height: 100%"
                        alt=""
                      />
                    </el-icon>
                    <div class="upload-text tip-text">
                      <div
                        v-if="idCardMessage.url !== idCard1"
                        class="upload-text-success"
                      >
                        <span>重新上传</span>
                        <span @click.stop="handleRotate(90)">
                          <img :src="xuanzhuanPng" width="16px" alt="" />
                          旋转
                        </span>
                        <span @click.stop="startOcr">
                          <img :src="zdsbPng" width="16px" alt="" />
                          自动识别
                        </span>
                      </div>
                      <template v-else>
                        <img :src="addLinePng" width="16px" alt="" />
                        添加身份证照片
                      </template>
                    </div>
                  </template>
                  <template #tip></template>
                </UploadDragAndDrop>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <!-- 擅长语言 -->
              <div class="id-card-right">
                <img :src="idCard2" alt="" />
                <div class="id-card-right-bottom">
                  <span>示例照片</span>
                  <span>注：上传图片必须和示例照片位置方向一致</span>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="面容录入:" prop="userFace.faceUrl">
              <div v-if="formData.userFace?.faceUrl" class="face-show">
                <el-image
                  style="width: 100%; height: 100%; border-radius: 8px"
                  :src="formData.userFace?.faceUrl"
                  :zoom-rate="1.2"
                  :max-scale="7"
                  :min-scale="0.2"
                  :preview-src-list="srcList"
                  fit="cover"
                />
                <div
                  v-if="!formData.userFace?.id"
                  class="close-icon"
                  @click="clearFace"
                >
                  <img :src="deletePng" class="imgClass" alt="" />
                  清除面容
                </div>
              </div>
              <el-button
                v-else
                type="primary"
                class="line-btn"
                @click="openFirstFaceAuth(false)"
              >
                <!-- <vab-icon icon="instagram-line" style="margin-right: 2px" /> -->
                去录入
              </el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="入职协议:" prop="contractFile">
              <UploadDragAndDrop
                ref="UploadDragAndDropFaceRef"
                class="w-h-100"
                @handleSucc="handleSuccPdf"
                @removeFile="removeFilePdf"
                :limit="1"
                isShowList
                :pubFileList="pubFileList"
                :auto-upload="true"
                actionUrl="/api/file/uploadFiles"
                :uploadData="{ type: '0' }"
                upLoadFileType=".pdf,.doc,.docx"
                :multiple="false"
                isUpOverlay
                :drag="false"
              >
                <template #trigger>
                  <el-button type="primary" class="line-btn" @click="">
                    <vab-icon icon="add-line" style="margin-right: 2px" />
                    选取文件
                  </el-button>
                </template>
                <template #tip>
                  <div class="upload-text tip-text" style="margin-top: 10px">
                    只能上传PDF或word文件，且不超过10M
                  </div>
                </template>
              </UploadDragAndDrop>
            </el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </main>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </template>
    <FaceAuthDialog
      ref="FaceAuthDialogRef"
      isUploadFace
      @uploadFn="uploadFace"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import {
  checkUserInfo,
  getIdCardImg,
  saveUserInfo,
  uploadIdcard,
  validateIdcard,
  validatePhone
} from "@/api/sysUser";
import idCard1 from "@/assets/login/id-card-1.png";
import idCard2 from "@/assets/login/id-card-2.png";
import idCard3 from "@/assets/login/id-card-3.png";
import xuanzhuanPng from "@/assets/acount/xuanzhuan.png";
import zdsbPng from "@/assets/acount/zdsb.png";
import addLinePng from "@/assets/acount/addLine.png";
import deletePng from "@/assets/acount/delete2x.png";
import {
  disabledDate,
  shortcuts,
  getAgeByBirthday
} from "@/utils/constant/date";
import { GENDER_STATUS } from "@/utils/constant/other";
import { isIdCard } from "@/utils/validate";
import { computed, defineComponent, ref, watch, nextTick } from "vue";
import FaceAuthDialog from "@/views/login/components/FaceAuthDialog.vue";
import UploadDragAndDrop from "@/components/upload/UploadDragAndDrop.vue";
import genderSelect from "@/components/GenderSelect.vue";
import { ElLoading, ElMessage, ElRow } from "element-plus";
defineOptions({
  name: "UserIdCardMessage"
});
const centerDialogVisible = ref(false); //弹窗显示
const checkUserInfoMsg = ref({}); //IDcard回显信息
const pageLoading = ref(false);
const formData = ref<any>({
  name: "", //员工姓名
  idcard: "", //身份证号码
  phone: "", //手机号码
  age: "", //年龄
  entryTime: "", //入职时间
  sex: "", //性别
  addressCode: [], //籍贯code
  address: "", //籍贯
  obverseUrl: "", //身份证正面照片地址
  languages: [], //熟练语言
  // reverseUrl: '', //本人照片地址
  contractFile: "", //入职协议地址
  userFace: {
    id: null,
    faceUrl: ""
  }
});
const validate_phoneNumber = (rule: any, value: any, callback: any) => {
  const reg = /^[1][3-9][0-9]{9}$/;
  if (!reg.test(value) && value != "") {
    callback(new Error("请输入正确的手机号码！"));
  } else {
    callback();
  }
};
const validatePhoneFun = async () => {
  let { phone } = formData.value;
  let { code, data } = await validatePhone({
    phone,
    userId: verifyStatus.value.userId
      ? verifyStatus.value.userId
      : userMessage.value.id
  });
  if (code == 200) {
    return data;
  } else {
    ElMessage.error("手机号验证服务异常");
  }
};
const validate_idCard = (rule: any, value: any, callback: any) => {
  if (!isIdCard(value)) callback(new Error("请输入有效的身份证号"));
  else callback();
};
const validateIdcardFun = async () => {
  let { idcard } = formData.value;
  let { code, data } = await validateIdcard({
    idcard,
    userId: verifyStatus.value.userId
      ? verifyStatus.value.userId
      : userMessage.value.id
  });
  if (code == 200) {
    return data;
  } else {
    ElMessage.error("身份证号验证服务异常");
  }
};
const rules = ref<any>({
  name: [{ required: true, message: "请输入员工姓名", trigger: "change" }],
  idcard: [
    { required: true, trigger: "change", message: "请输入身份证号码" },
    { validator: validate_idCard, trigger: ["change"] },
    {
      validator: async (rule: any, value: any, callback: any) => {
        if (value) {
          let flag = await validateIdcardFun();
          if (flag) {
            callback();
          } else {
            callback(new Error("身份证号已使用"));
          }
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  phone: [
    { required: true, trigger: "change", message: "请输入手机号" },
    { validator: validate_phoneNumber, trigger: ["change"] },
    {
      validator: async (rule: any, value: any, callback: any) => {
        if (value) {
          let flag = await validatePhoneFun();
          if (flag) {
            callback();
          } else {
            callback(new Error("手机号已使用"));
          }
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  age: [
    { required: false, message: "请输入年龄", trigger: "change" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value) {
          const isNumber = /^[1-9]\d*$/;
          const result = isNumber.test(value);
          if (!result) {
            callback(new Error("请输入正整数"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ],
  entryTime: [
    { required: false, message: "请输入入职时间", trigger: "change" }
  ],
  sex: [{ required: false, message: "请选择性别", trigger: "change" }],
  // addressCode: [{ required: true, message: '请选择籍贯', trigger: 'change' }],
  address: [{ required: true, message: "请输入籍贯", trigger: "change" }],
  languages: [{ required: true, message: "请选择熟练语言", trigger: "change" }],
  obverseUrl: [
    { required: true, message: "请上传身份证照片", trigger: "change" }
  ],
  // reverseUrl: [{ required: true, message: '请上传本人照片', trigger: 'change' }],
  "userFace.faceUrl": [
    { required: true, message: "请上传人脸照片", trigger: "change" }
  ]
});
const formDataRef = ref<any>();
// const userStore = useUserStore();
// const { loginUser, verifyStatus, currentUser } = storeToRefs(userStore);

import { storeToRefs } from "pinia";
import { useUserStoreHook } from "@/store/modules/user";
const { verifyStatus, userMessage } = storeToRefs(useUserStoreHook());

const emit = defineEmits([""]);
const pubFileList = ref<any>([]); //文件地址回显
const init = async () => {
  const { code, data } = await checkUserInfo({
    userId: verifyStatus.value.userId
      ? verifyStatus.value.userId
      : userMessage.value.id
  });
  if (code === 200) {
    const { check, info } = data;
    // centerDialogVisible.value = check == "false" ? false : true; //关闭验证
    centerDialogVisible.value = check == "false" ? true : false; //打开身份信息上传
    checkUserInfoMsg.value = info;
    if (info && centerDialogVisible.value) {
      formData.value = {
        name: info.name,
        phone: info.phone,
        entryTime: info.userCompanyMap?.entryTime,
        sex: info.sex,
        addressCode: info.addressCode ? JSON.parse(info.addressCode) : [],
        address: info.address,
        age: info.userIdcard?.age,
        idcard: info.userIdcard?.idcard,
        obverseUrl: info.userIdcard?.obverseUrl, //身份证照片
        // reverseUrl: info.userIdcard?.reverseUrl, //本人照片
        contractFile: info.contractFile,
        languages: info.languages
          ? info.languages.map((item: any) => item.id)
          : [],
        userFace: {
          id: info.userFace?.id,
          faceUrl: info.userFace?.faceUrl
        }
      };
      // 话加年龄
      if (info.birthday && !info.userIdcard?.age) {
        formData.value.age = getAgeByBirthday(info.birthday);
      }
      // 身份证照片逻辑
      if (info.userIdcard?.obverseUrl) {
        idCardMessage.value.url = info.userIdcard?.obverseUrl;
        getIdCardImg({ fileUrl: info.userIdcard?.obverseUrl })
          .then((res: any) => {
            var blob = new Blob([res], { type: "image/jpeg" });
            var imgURL = URL.createObjectURL(blob);
            idCardMessage.value.url = imgURL;
            nextTick(() => {
              handleRotate(0);
            });
          })
          .catch((err: any) => {
            console.log(err);
          });
      }
      // 本人照片逻辑暂留
      // if (info.userIdcard?.reverseUrl) {
      //   faceMessage.value.url = info.userIdcard?.reverseUrl
      //   getIdCardImg({ fileUrl: info.userIdcard?.reverseUrl })
      //     .then((res: any) => {
      //       var blob = new Blob([res], { type: 'image/jpeg' })
      //       var imgURL = URL.createObjectURL(blob)
      //       faceMessage.value.url = imgURL
      //     })
      //     .catch((err: any) => {
      //       console.log(err)
      //     })
      // }
      // 入职协议
      if (info.contractFile) {
        // 获取/后面的内容
        const fileName = info.contractFile?.split("/").pop();
        pubFileList.value = [
          {
            name: fileName,
            url: info.contractFile
          }
        ];
      }
    }
  }
};
const showEdit = () => {
  centerDialogVisible.value = true;
  pageLoading.value = false;
};
// 身份证变更会重新计算年龄和性别
const idcardChange = () => {
  if (isIdCard(formData.value.idcard)) {
    // 可能15位或者18位
    formData.value.age = getAgeByBirthday(idCardHd(formData.value.idcard, 1));
    formData.value.sex = GENDER_STATUS.find(
      (item: any) => item.label == idCardHd(formData.value.idcard, 2)
    )?.id;
  }
};
//通过身份证号计算年龄、性别、出生日期
const idCardHd = (userCard: any, num: number) => {
  //获取出生日期
  var birth;
  if (num == 1) {
    birth =
      userCard.substring(6, 10) +
      "-" +
      userCard.substring(10, 12) +
      "-" +
      userCard.substring(12, 14);
    return birth;
  }
  //获取性别
  if (num == 2) {
    if (parseInt(userCard.substr(16, 1)) % 2 == 1) {
      return "男";
    } else {
      return "女";
    }
  }
  //获取年龄 这个年龄精确到了月份
  if (num == 3) {
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - userCard.substring(6, 10) - 1;
    if (
      userCard.substring(10, 12) < month ||
      (userCard.substring(10, 12) == month && userCard.substring(12, 14) <= day)
    ) {
      age++;
    }
    return age;
  }
};

// 上传身份证
// 上传成功文件返回

const UploadDragAndDropRef = ref();
const idCardMessage = ref<any>({
  idcardInfo: {},
  url: idCard1,
  file: null
});
const uploadData = ref({
  type: "1" //0、获取图片路径 1、获取路径+读取信息
}); //附带参数
const errorMessage = ref<string>("");
const handleSucc = (response: any) => {
  let resObj = JSON.parse(response.data);
  console.log(resObj);
  if (resObj.idcardInfo && resObj.idcardInfo.code === 10001) {
    const { adress, birth, id_number, name, nation, sex } = resObj.idcardInfo;
    idCardMessage.value.idcardInfo = resObj.idcardInfo;
    // idCardMessage.value.url = response.url //不需要新地址
    formData.value.obverseUrl = resObj.url;
    // idcardInfo.adress 籍贯无法识别
    // if (birth) formData.value.age = getAgeByBirthday(conversionTime(response.idcardInfo.birth))
    // 根据身份证号码判断性别
    if (id_number) {
      formData.value.idcard = id_number;
      const sexNum = id_number.slice(-2, -1);
      if (sexNum % 2 === 0) {
        // 女
        formData.value.sex = GENDER_STATUS.find(
          (item: any) => item.label == "女"
        ).id;
      } else {
        // 男
        formData.value.sex = GENDER_STATUS.find(
          (item: any) => item.label == "男"
        ).id;
      }
      // 根据身份证算年龄
      // formData.value.age = getAgeByIdCard(id_number)
      idcardChange();
    }
    if (name) formData.value.name = name;
    if (sex)
      formData.value.sex = GENDER_STATUS.find(
        (item: any) => item.label == sex
      )?.id;
    // if (adress) formData.value.address = adress

    ElMessage.success("识别成功");
  } else {
    console.log(response);
    console.log(JSON.parse(response.data));
    // idCardMessage.value.idcardInfo = {}
    // idCardMessage.value.url = idCard1
    formData.value.obverseUrl = JSON.parse(response.data).url;
    if (resObj.idcardInfo) {
      ElMessage.error(resObj.idcardInfo.info);
    } else {
      ElMessage.error("识别失败");
    }
  }
};
const changeFile = (file: any) => {
  console.log(file);
  if (file) {
    idCardMessage.value.url = URL.createObjectURL(file.raw);
    idCardMessage.value.file = file.raw;
    startOcr();
  } else {
    idCardMessage.value.url = idCard1;
    idCardMessage.value.file = null;
  }
};
// 旋转图片
const rectifyImg = ref();
const rotate = ref(0);
const handleRotate = (horn: number) => {
  rotate.value += horn;
  // if (rotate.value >= 360) {
  //   rotate.value = 0
  // }
  let r1 = 90;
  let r2 = 180;
  let r3 = 270;
  rectifyImg.value.style.transform = `rotate(${rotate.value}deg)`;
  rectifyImg.value.style.transition = "transform 0.5s ease-in-out";

  const img = new Image();
  img.src = idCardMessage.value.url;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    if (rotate.value % 360 == 0) {
      ctx.drawImage(img, 0, 0);
    } else if (rotate.value % 360 == 90) {
      canvas.width = img.height;
      canvas.height = img.width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((r1 * Math.PI) / 180);
      ctx.drawImage(img, -canvas.height / 2, -canvas.width / 2);
    } else if (rotate.value % 360 == 180) {
      ctx.rotate((r2 * Math.PI) / 180);
      ctx.drawImage(img, -img.width, -img.height);
    } else {
      canvas.width = img.height;
      canvas.height = img.width;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((r3 * Math.PI) / 180);
      ctx.drawImage(img, -canvas.height / 2, -canvas.width / 2);
    }
    const ndata = canvas.toDataURL("image/jpeg", 1.0);
    // idCardMessage.value.url = ndata
    idCardMessage.value.file = dataURLtoFile(ndata);
  };
};
// 将base64转换为文件
const dataURLtoFile = (dataurl: any, filename = "file") => {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
// 开始识别身份证
const UploadLoadng = ref(false);
const startOcr = () => {
  let file = new FormData();
  file.append("file", idCardMessage.value.file);
  file.append("type", "1");
  UploadLoadng.value = true;
  uploadIdcard(file)
    .then((res: any) => {
      UploadLoadng.value = false;
      handleSucc(res);
    })
    .catch((err: any) => {
      UploadLoadng.value = false;
      console.log(err);
    });
};
// 上传本人照片
const faceMessage = ref<any>({
  url: idCard3
});

const UploadDragAndDropFaceRef = ref();
const handleSuccFace = (response: any, file: any, fileList: any) => {
  console.log(response, "-----");

  if (response.url) {
    faceMessage.value.url = response.url;
    formData.value.reverseUrl = response.url;
    ElMessage.success("上传成功");
  } else {
    faceMessage.value.url = idCard3;
    formData.value.reverseUrl = "";
    ElMessage.error("上传失败");
    UploadDragAndDropFaceRef.value.clearFiles();
  }
};
// 上传入职协议
const handleSuccPdf = (response: any, file: any, fileList: any) => {
  if (response) {
    formData.value.contractFile = response;
    ElMessage.success("上传成功");
  } else {
    ElMessage.error("上传失败");
  }
};
// 删除入职协议
const removeFilePdf = (file: any, fileList: any) => {
  formData.value.contractFile = "";
};
// 打开拍照录入面容
const FaceAuthDialogRef = ref();
// const openFirstFaceAuth = () => {
//   FaceAuthDialogRef.value.showEdit({ validate: false });
// };
const openFirstFaceAuth = (validate: boolean) => {
  FaceAuthDialogRef.value.showEdit({ validate });
};
// const $pub = inject<any>("$pub");

const close = async () => {
  // 重置
  // $pub("reload-router-view");
  centerDialogVisible.value = false;
};
// 需要跟新页面 上面不行的话就这个
const srcList = ref<any>([]);
const uploadFace = (data: any) => {
  console.log(data);
  // if (data.data) {
  //   let url = JSON.parse(data.data).url;
  //   console.log(url);
  //   // 获取解密照片
  //   getIdCardImg({ fileUrl: url })
  //     .then((res: any) => {
  //       var blob = new Blob([res], { type: "image/jpeg" });
  //       var imgURL = URL.createObjectURL(blob);
  //       formData.value.userFace.faceUrl = imgURL;
  //       srcList.value = [imgURL];
  //       formDataRef.value.validateField("userFace.faceUrl");
  //     })
  //     .catch((err: any) => {
  //       console.log(err);
  //     });
  // }
  if (data) {
    // formData.value.userFace.faceUrl = 'https://192.168.6.120/' + data
    formData.value.userFace.faceUrl = data;
    srcList.value = [formData.value.userFace.faceUrl];
    formDataRef.value.validateField("userFace.faceUrl");
  }
};
const clearFace = () => {
  formData.value.userFace.faceUrl = "";
  srcList.value = [];
};

const confirm = () => {
  // centerDialogVisible.value = false
  console.log("formData", formData.value);
  formDataRef.value.validate(async (valid: boolean) => {
    if (valid) {
      pageLoading.value = true;

      const {
        name,
        idcard,
        phone,
        age,
        entryTime,
        sex,
        addressCode,
        address,
        obverseUrl,
        languages,
        reverseUrl,
        contractFile,
        userFace
      } = formData.value;
      const params = {
        name,
        idcard,
        phone,
        age,
        entryTime,
        sex,
        addressCode,
        address,
        obverseUrl,
        // languages: languages.join(","),
        // reverseUrl,
        contractFile,
        userFace
      };
      try {
        const { code, data, message } = await saveUserInfo({
          userId: verifyStatus.value.userId
            ? verifyStatus.value.userId
            : userMessage.value.id,
          ...params
        });
        if (code === 200) {
          ElMessage.success("保存成功");
          centerDialogVisible.value = false;
        } else {
          ElMessage.error(message);
        }
        pageLoading.value = false;
      } catch (error) {
        console.log(error);
        pageLoading.value = false;
      }
    }
  });
};

init();
// watch(
//   () => formData.value,
//   (newValue) => {},
//   { deep: true }
// )
defineExpose({
  showEdit
});
</script>
<style lang="scss">
.id-card-dialog {
  --el-dialog-margin-top: 5vh !important;
  .el-dialog__header {
    height: 40px !important;
  }
}
</style>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
}
.el-upload-dragger .el-icon--upload {
  margin-bottom: 0 !important;
}
.dialog-footer {
}

.upload-text-success {
  display: flex;
  justify-content: space-around;
  color: #3370ff;
}
.icon {
  margin-right: 4px;
}
:deep(.el-upload-dragger) {
  // border: 1px dashed #87a9eb !important;
  // 留给使用的组件自行控制
  width: 268px;
  height: 170px;
}
.id-card-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    width: 185px;
  }
  .id-card-right-bottom {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    span {
      line-height: 26px;
    }
    & :nth-child(1) {
      font-size: 12px;
      color: #b0b0bc;
    }
    & :nth-child(2) {
      font-size: 14px;
      color: #fc9845;
    }
  }
}
.upload-img {
  margin-top: -20px;
  width: 180px;
  height: 110px;
  overflow: hidden;
  transition: all 0.5s;
}
.face-show {
  position: relative;
  width: 170px;
  height: 170px;
  border: 1px dashed #87a9eb;
  padding: 20px;
  border-radius: 8px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  .close-icon {
    position: absolute;
    right: 10px;
    top: -3px;

    i {
      font-size: 24px;
      color: #909399;
    }
    .imgClass {
      width: 14px !important;
    }
  }
}
</style>
