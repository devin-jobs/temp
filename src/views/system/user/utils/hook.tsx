import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { message } from "@/utils/message";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import {
  getKeyList,
  isAllEmpty,
  hideTextAtIndex,
  deviceDetection
} from "@pureadmin/utils";
import {
  getRoleIds,
  getUserList,
  getCitysList,
  getAllRoleList,
  addUser,
  editUser,
  updateUserStatus
} from "@/api/system";
import {
  ElMessageBox
} from "element-plus";
import {
  Ref,
  h,
  ref,
  toRaw,
  computed,
  reactive,
  onMounted
} from "vue";

export function useUser(tableRef: Ref, treeRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    accountName: '',
    name: "",
    phone: "",
    status: "0",
    roleIds: [],
    cityIds: [],
    countyIds: []
  });
  const formRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const higherDeptOptions = ref();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      type: "expand",
      slot: "expand"
    },
    {
      label: "账号",
      prop: "accountName",
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      label: "姓名",
      prop: "name",
      showOverflowTooltip: true,
      minWidth: 130
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      showOverflowTooltip: true,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.status === 1 ? "success" : "info"}
          effect="light"
        >
          {row.status === 1 ? "启用中" : "停用"}
        </el-tag>
      )
    },
    {
      label: "邮箱",
      prop: "email",
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      label: "手机号码",
      prop: "phone",
      minWidth: 90,
      showOverflowTooltip: true,
      formatter: ({ phone }) => hideTextAtIndex(phone, { start: 3, end: 6 })
    },
    {
      label: "角色",
      prop: "roleNames",
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      label: "所属地市",
      prop: "cityNames",
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      label: "所属县区",
      prop: "countyNames",
      showOverflowTooltip: true,
      minWidth: 90
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      showOverflowTooltip: false,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "!h-[20px]",
      "reset-margin",
      "!text-gray-500",
      "dark:!text-white",
      "dark:hover:!text-primary"
    ];
  });

  const roleOptions = ref([]);

  function onChange(row) {
    let status = row.status;
    let accountName = row.accountName;
    ElMessageBox.confirm(
      `您确定要${status == 1 ? '停用' : '启用'}账号${accountName}吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        updateUserStatus({
          accountName,
          newStatus: status == 1 ? 2 : 1,
        }).then((res) => {
          if (res.code == 200) {
            message("已成功修改账户状态", {
              type: 'success',
            }
            )
            onSearch()
          } else {
            message("修改账户状态失败", {
              type: 'error',
            }
            )
          }
        })
      })
      .catch(() => {
        message("已取消修改账户状态", {
          type: 'info',
        }
        )
      })
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    onSearch()
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    onSearch(val)
  }

  async function onSearch(val?: any) {
    // pagination.currentPage = val ? val : 1
    loading.value = true;
    const { data } = await getUserList({
      ...form,
      status: form.status === '0' ? '' : Number(form.status),
      pageSize: pagination.pageSize,
      pageNum: pagination.currentPage
    });
    if (data.records.length == 0 && pagination.currentPage != 1) {
        pagination.currentPage = pagination.currentPage - 1 
        onSearch()
      } else {
        dataList.value = data.records;
        pagination.total = data.total;
        pagination.pageSize = data.size;
        pagination.currentPage = data.current;
      }

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    form.deptId = "";
    treeRef.value.onTreeReset();
    onSearch();
  };

  function onTreeSelect({ id, selected }) {
    form.deptId = selected ? id : "";
    onSearch();
  }

  function formatHigherDeptOptions(treeList) {
    // 根据返回数据的status字段值判断追加是否禁用disabled字段，返回处理后的树结构，用于上级部门级联选择器的展示（实际开发中也是如此，不可能前端需要的每个字段后端都会返回，这时需要前端自行根据后端返回的某些字段做逻辑处理）
    if (!treeList || !treeList.length) return;
    const newTreeList = [];
    for (let i = 0; i < treeList.length; i++) {
      treeList[i].disabled = treeList[i].status === 0 ? true : false;
      formatHigherDeptOptions(treeList[i].children);
      newTreeList.push(treeList[i]);
    }
    return newTreeList;
  }

  function openDialog(title = "添加", row?: any) {
    addDialog({
      title: `${title}账号`,
      props: {
        formInline: {
          title,
          higherDeptOptions: formatHigherDeptOptions(higherDeptOptions.value),
          accountName: row?.accountName ?? "",
          name: row?.name ?? "",
          phone: row?.phone ?? "",
          email: row?.email ?? "",
          roleIds: row?.roleIds ?? [],
          cityIds: row?.cityIds ?? [],
          countyIds: row?.countyIds ?? [],
          status: row?.status ?? 1,
          shopIds: row?.shopIds ?? [],
          organization: row?.organization ?? "",
          wechat: row?.wechat ?? "",
          dingding: row?.dingding ?? "",
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as any;
        function chores() {
          message(`您${title}了用户姓名为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            let params = {
              ...curData,
              // roleIds: curData.roleIds.join(","),
              // cityIds: curData.cityIds.join(","),
              // countyIds:curData.countyIds.join(",")
            }
            delete params.title

            // 表单规则校验通过
            if (title === "添加") {
              // 实际开发先调用新增接口，再进行下面操作
              const res = await addUser(params);
              if (res.code === 200) {
                chores();
              } else {
                message(res.message, {
                  type: "info"
                });
              }

            } else {
              // 实际开发先调用修改接口，再进行下面操作
              let editParams = {
                newName: curData.name,
                newPhone: curData.phone,
                newEmail: curData.email,
                newStatus: curData.status,
                newRoleIds: curData.roleIds,
                newCityIds: curData.cityIds,
                newCountyIds: curData.countyIds,
                newShopIds: curData.shopIds,
                newOrganization: curData.organization,
                newWechat: curData.wechat,
                newDingding: curData.dingding,
              }
              const res = await editUser(editParams, curData.accountName);
              if (res.code === 200) {
                chores();
              } else {
                message(res.message, {
                  type: "info"
                });
              }
            }
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = (await getRoleIds({ userId: row.id })).data ?? [];
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: (done, { options }) => {
        const curData = options.props.formInline as any;
        console.log("curIds", curData.ids);
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        done(); // 关闭弹框
      }
    });
  }

  onMounted(async () => {
    treeLoading.value = true;
    onSearch();

    // 角色列表
    // roleOptions.value = (await getAllRoleList()).data;
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    openDialog,
    onTreeSelect,
    handleRole,
    handleSizeChange,
    handleCurrentChange,
    onChange,
  };
}
