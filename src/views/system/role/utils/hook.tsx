import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { ElMessageBox, ElMessage } from "element-plus";
import { usePublicHooks } from "../../hooks";
import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import type { PaginationProps } from "@pureadmin/table";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getRoleList, addRole, getRoleMenu, updateRole, deleteRoleApi, getRoleTypeList } from "@/api/system";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch } from "vue";

export function useRole(treeRef?: Ref) {
  const form = reactive({
    name: "",
    code: "",
    attributeId: '',
    status: ""
  });
  let editFormValue = reactive({
    roleName: "",
    notes: "",
    attributeId: '',
    authorizationIds: []
  })
  const curRow = ref();
  const formRef = ref();
  const dataList = ref([]);
  const treeIds = ref([]);
  const treeData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const loadingSave = ref(false);
  const isLinkage = ref(true);
  const treeSearchValue = ref();
  const switchLoadMap = ref({});
  const isExpandAll = ref(false);
  const isSelectAll = ref(false);
  const { switchStyle } = usePublicHooks();
  const treeProps = {
    value: "id",
    label: "name",
    children: "children"
  };
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "ID",
      prop: "roleId"
    },
    {
      label: "角色名称",
      showOverflowTooltip: true,
      prop: "roleName"
    },
    {
      label: "角色描述",
      showOverflowTooltip: true,
      prop: "notes"
    },
    {
      label: "角色属性",
      showOverflowTooltip: true,
      prop: "attributeName"
    },
    {
      label: "操作",
      fixed: "right",
      showOverflowTooltip: false,
      width: 240,
      slot: "operation"
    }
  ];
  // const buttonClass = computed(() => {
  //   return [
  //     "!h-[20px]",
  //     "reset-margin",
  //     "!text-gray-500",
  //     "dark:!text-white",
  //     "dark:hover:!text-primary"
  //   ];
  // });
  const attributeSelect = ref([]);

  function handleDelete(row) {
    message(`您删除了角色名称为${row.name}的这条数据`, { type: "success" });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
    onSearch()
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
    onSearch(val)
  }

  function handleSelectionChange(val) {
    console.log("handleSelectionChange", val);
  }

  async function onSearch(val?: any) {
    console.log("onSearch", val);
    loading.value = true;
    pagination.currentPage = val ? val : 1
    const { data } = await getRoleList({ roleName: form.name, attributeId: form.attributeId, pageSize: pagination.pageSize, pageNum: pagination.currentPage });
    console.log("data", data);
    dataList.value = data.records;
    setTimeout(() => {
      curRow.value = data.records.length === 0 ? {} : data.records[0];
      let str = data.records.length === 0 ? '{}' : JSON.stringify(data.records[0]);
      let arr = JSON.parse(str);
      console.log("arr", arr);
      if (data.records.length > 0) {
        editFormValue.roleName = arr.roleName
        editFormValue.attributeId = arr.attributeId
        editFormValue.notes = arr.notes
        editFormValue.authorizationIds = arr.authorizationIds
        console.log("editFormValue", editFormValue);
        treeRef.value.setCheckedKeys(editFormValue.authorizationIds);
      } else {
        editFormValue.roleName = ''
        editFormValue.attributeId = 1
        editFormValue.notes = ''
        editFormValue.authorizationIds = []
        treeRef.value.setCheckedKeys(editFormValue.authorizationIds);
      }
    }, 500)
    pagination.total = data.total;
    pagination.pageSize = data.size;
    pagination.currentPage = data.current;

    setTimeout(() => {
      loading.value = false;
    }, 500);
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  function openDialog(title = "新增", row?: any) {
    addDialog({
      title: `${title}角色`,
      props: {
        formInline: {
          name: row?.name ?? "",
          notes: row?.notes ?? "",
          attributeId: row?.attributeId ?? ''
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`您${title}了角色名称为${curData.name}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              const res = await addRole({ name: curData.name, notes: curData.notes, attributeId: curData.attributeId });
              if (res.code === 200) {
                chores();
              } else {
                ElMessage.error(res.message);
              }
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              chores();
            }
          }
        });
      }
    });
  }

  // 删除角色
  async function deleteRole(row?: any) {
    console.log(row)
    ElMessageBox.confirm(
      `您确定要删除角色【${row.roleName}】吗？`,
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        if (row.userCount > 0) {
          ElMessage({
            type: 'warning',
            message: '该角色下有用户，不能删除！'
          });
        } else {
          deleteRoleApi(row.roleId).then((res) => {
            if (res.code == 200) {
              message(`已删除角色【${row.roleName}】`, {
                type: 'success',
              }
              )
              onSearch(pagination.currentPage);
            } else {
              message(`删除角色【${row.roleName}】失败`, {
                type: 'error',
              }
              )
            }
          })
        }
      })
      .catch(() => {
        message(`已取消删除角色【${row.roleName}】`, {
          type: 'info',
        }
        )
      })
    // const { data } = await deleteRoleById(row.id);
  }

  // /** 菜单权限 */
  async function handleMenu(row?: any) {
    const { roleId } = row;
    if (roleId) {
      curRow.value = row;
      let str = JSON.stringify(row);
      let arr = JSON.parse(str);

      editFormValue.roleName = arr.roleName
      editFormValue.attributeId = arr.attributeId
      editFormValue.notes = arr.notes
      editFormValue.authorizationIds = arr.authorizationIds
      isShow.value = true;
      treeRef.value.setCheckedKeys(editFormValue.authorizationIds);
    } else {
      editFormValue.roleName = ''
      editFormValue.notes = ''
      editFormValue.attributeId = ''
      editFormValue.authorizationIds = []
      treeRef.value.setCheckedKeys(editFormValue.authorizationIds);
      curRow.value = null;
      isShow.value = false;
    }
  }

  /** 高亮当前权限选中行 */
  function rowStyle({ row: { roleId } }) {
    return {
      cursor: "pointer",
      background: roleId === curRow.value?.roleId ? "var(--el-fill-color-light)" : ""
    };
  }

  /** 菜单权限-保存 */
  async function handleSave() {

    const nodes = treeRef.value.getCheckedNodes(true, false)
    // console.log(nodes)
    // console.log(treeRef.value.getCheckedKeys())
    let authorizationlist = []
    nodes.map((item) => {
      authorizationlist.push(item.id)
    })

    loadingSave.value = true
    const { roleId } = curRow.value;
    const res = await updateRole({ name: editFormValue.roleName, attributeId: editFormValue.attributeId, notes: editFormValue.notes, authorizationlist: authorizationlist }, roleId)
    console.log("data", res);
    if (res.code == 200) {
      // 根据用户 id 调用实际项目中菜单权限修改接口
      // console.log(id, treeRef.value.getCheckedKeys());
      message(`角色名称为${editFormValue.roleName}的菜单权限修改成功`, {
        type: "success"
      });
      onSearch(pagination.currentPage);

    } else {
      message(res.message, {
        type: "error"
      });
    }
    loadingSave.value = false
  }

  /** 数据权限 可自行开发 */
  // function handleDatabase() {}

  const onQueryChanged = (query: string) => {
    console.log("onQueryChanged", query);
    console.log("treeIds", treeRef.value);
    treeRef.value!.filter(query);
  };

  const filterMethod = (query: string, node) => {
    return transformI18n(node.name)!.includes(query);
  };

  const getRoleType = async () => {
    // alert("getRoleType")
    const res = await getRoleTypeList()
    if (res.code == 200) {
      attributeSelect.value = res.data
    } else {
      message(`获取角色类型失败`, {
        type: "error"
      });
    }
  }

  getRoleType()

  onMounted(async () => {
    onSearch();
    const { data } = await getRoleMenu();
    treeIds.value = getKeyList(data, "id");
    treeData.value = handleTree(data);
  });

  watch(isExpandAll, val => {
    val
      ? treeRef.value.setExpandedKeys(treeIds.value)
      : treeRef.value.setExpandedKeys([]);
  });

  watch(isSelectAll, val => {
    val
      ? treeRef.value.setCheckedKeys(treeIds.value)
      : treeRef.value.setCheckedKeys([]);
  });

  return {
    form,
    isShow,
    curRow,
    editFormValue,
    loading,
    loadingSave,
    columns,
    rowStyle,
    dataList,
    treeData,
    treeProps,
    isLinkage,
    pagination,
    isExpandAll,
    isSelectAll,
    treeSearchValue,
    attributeSelect,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleMenu,
    deleteRole,
    handleSave,
    handleDelete,
    filterMethod,
    transformI18n,
    onQueryChanged,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange,
    handleSelectionChange
  };
}
