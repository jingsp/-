<template>
  <el-dialog
    :title="title"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="user-dialog"
    @close="closeDialog"
  >
    <el-form
      :model="userForm"
      label-position="right"
      label-width="150px"
      ref="userForm"
      :rules="rules"
    >
      <template>
        <div class="user__subtitle">
          <span>账号信息</span>
        </div>
      </template>
      <el-form-item
        label="登录名："
        prop="userName"
      >
        <el-input
          v-model="userForm.userName"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
          :disabled="pageStatus==='edit'"
        />
      </el-form-item>
      <el-form-item
        label="真实姓名："
        prop="fullName"
      >
        <el-input
          v-model="userForm.fullName"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="手机号："
        prop="telphone"
      >
        <el-input
          v-model="userForm.telphone"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="初始密码："
        prop="userPasswd"
      >
        <el-input
          v-model="userForm.userPasswd"
          autocomplete="off"
          show-password
          clearable
          class="user__input"
          placeholder="请输入"
          :disabled="pageStatus==='edit'"
        />
        <el-button
          type="text"
          @click="modifyPwd"
          v-if="pageStatus==='edit'"
        >去修改</el-button>
      </el-form-item>
      <template>
        <div
          class="user__subtitle"
          style="marginTop: 56px"
        >
          <span>个人/职能信息</span>
        </div>
      </template>
      <el-form-item
        label="角色类型："
        prop="roleId"
      >
        <el-select
          v-model="userForm.roleId"
          placeholder="请选择"
          class="user__input"
          @change="getElementTreeForChoosingByRole"
          :disabled="pageStatus==='edit'"
        >
          <el-option
            v-for="item in getRoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="管理属性："
        prop="userAttr"
      >
        <el-select
          v-model="userForm.userAttr"
          placeholder="请选择"
          class="user__input"
          :disabled="pageStatus==='edit'"
        >
          <el-option
            v-for="item in getUserAttr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        label="公司："
        prop="customerName"
      >
        <el-input
          v-model="userForm.customerName"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item> -->
      <el-form-item
        label="职位："
        prop="position"
      >
        <el-input
          v-model="userForm.position"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="邮箱："
        prop="mailbox"
      >
        <el-input
          v-model="userForm.mailbox"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="账号到期时间："
        prop="expireDate"
      >
        <el-date-picker
          v-model="userForm.expireDate"
          type="date"
          class="user__input"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item
        label="权限选择："
        prop="dataId"
      >
        <el-button
          type="text"
          v-if="!isAuthoritySet"
          @click="setAuthority"
        >去设置</el-button>
        <template v-else>
          已设置
          <el-button
            type="text"
            @click="setAuthority"
          >修改</el-button>
        </template>
      </el-form-item>
    </el-form>
    <div
      v-if="errorMsg"
      class="error"
    >{{ errorMsg }}</div>
    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancel">取 消</el-button>
      <el-button
        type="primary"
        @click="confirm()"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    dialogPwdVisible: {
      type: Boolean,
      default: false,
    },
    pageStatus: {
      type: String,
      default: 'add',
    },
    userId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      title: '新增用户',
      formLabelWidth: '100',
      userForm: {},
      errorMsg: '',
      roleList: this.$constants.roles,
      userTypeList: [{
        id: 0,
        name: '普通用户',
      }, {
        id: 1,
        name: '管理员',
      }],
      rules: {
        userName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 2, max: 10, message: '不能小于2个字符大于10个字符', trigger: 'blur',
          },
        ],
        fullName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        telphone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.validateTel, trigger: 'blur' },
        ],
        userPasswd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        roleId: [
          { required: true, message: '请选择角色类型', trigger: 'blur' },
        ],
        userAttr: [
          { required: true, message: '请选择管理属性', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '请输入公司名称', trigger: 'blur' },
        ],
        position: [
          { required: true, message: '请输入职位名称', trigger: 'blur' },
        ],
        mailbox: [
          { validator: this.validateEmail, trigger: 'blur' },
        ],
      },
      pickerOptions: {
        disabledDate: time => time.getTime() < Date.now(),
      },
    };
  },
  computed: {
    getRoleList() {
      let result = [];
      if (this.$utils.checkRole('admin')) {
        result = this.$constants.roles.filter(item => item.id !== 2);
      }
      if (this.$utils.checkRole('operator')) {
        result = this.$constants.roles.filter(item => item.id !== 3 || item.id !== 2);
      }
      if (this.$utils.checkRole('agent')) {
        result = this.$constants.roles.filter(item => item.id === 4);
      }
      if (this.$utils.checkRole('customer')) {
        result = this.$constants.roles.filter(item => item.id === 1);
      }
      if (this.$utils.checkRole('brand')) {
        result = this.$constants.roles.filter(item => item.id === 5);
      }
      return result;
    },
    getUserAttr() {
      //
      let result = this.userTypeList;
      const userAttr = this.$cookie.get('userAttr');
      // const privilege = this.$cookie.get('privilege');
      if (userAttr === '0' || (userAttr === '1' && !this.$utils.checkRole('admin') && !this.$utils.checkRole('operator'))) {
        // 普通用户
        result = result.filter(item => item.id === 0);
      }
      return result;
    },
  },
  methods: {
    validateTel(rule, value, callback) {
      const telReg = /^[1]([3-9])[0-9]{9}$/;
      if (telReg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的电话号码'));
      }
    },
    validateEmail(rule, value, callback) {
      const emailReg = /^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/; // eslint-disable-line
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error('请输入正确的邮箱地址'));
      }
    },
    async save() {
      // 保存用户信息
      // 过期时间格式化
      this.userForm.expireDate = this.$utils.getDateStr(this.userForm.expireDate, true);
      if (this.pageStatus === 'edit') {
        this.modifyUser();
      } else {
        this.addUser();
      }
    },
    cancel() {
      this.$refs.userForm.clearValidate();
      this.$emit('update:dialogFormVisible', false);
    },
    confirm() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.save();
        }
      });
    },
    closeDialog() {
      this.$refs.userForm.clearValidate();
      this.$emit('update:dialogFormVisible', false);
    },
    async getDetail() {
      const data = await this.$api.auth.getUserDetail({ id: this.userId });
      this.userForm = data || {};
      this.userForm.userPasswd = '******';
    },
    async addUser() {
      const data = await this.$api.auth.addUser({
        ...this.userForm, customerId: this.customerTree[0].shortId, dataAuthorityList: this.customerTree, elementTree: JSON.stringify(this.elementTree),
      });
      if (data && data.code === '101') {
        this.errorMsg = '参数错误';
      } else if (data && data.code === '902') {
        this.errorMsg = '无操作权限';
      } else {
        this.$emit('update:dialogFormVisible', false);
        // 更新用户列表
        this.$parent.reloadList();
        this.errorMsg = '';
      }
    },
    async modifyUser() {
      // 修改用户信息
      const data = await this.$api.auth.modifyUser({ ...this.userForm });
      if (data && data.code === '101') {
        this.errorMsg = '参数错误';
      } else if (data && data.code === '902') {
        this.errorMsg = '无操作权限';
      } else {
        await Promise.all([
          this.$api.auth.updateElementTreeByUsername(this.userForm.userName, JSON.stringify(this.elementTree)),
          this.$api.auth.updateCustomerTreeByUsername(this.userForm.userName, this.customerTree)]);
        this.$emit('update:dialogFormVisible', false);
        this.errorMsg = '';
      }
    },
  },
  watch: {
    pageStatus() {
      if (this.pageStatus === 'edit') {
        this.title = '修改';
        this.getDetail();
      } else {
        this.title = '新增用户';
      }
    },
  },
};
</script>
<style lang="scss">
.user-dialog {
  .el-dialog {
    width: 578px;
  }

  .el-dialog__header {
    padding: 14px 24px 14px;
  }

  .el-dialog__body {
    height: 500px;
    overflow: scroll;
  }

  .el-dialog__title {
    line-height: 1;
    font-size: 16px;
    // font-family:PingFangSC-Medium;
    font-weight:500;
    color: #000;
  }

  .user__subtitle {
    margin-bottom: 20px;
    font-size:14px;
    // font-family:PingFangSC-Medium;
    font-weight:500;
    color: #000;
  }

  .user__input {
    width: 344px;
  }

  .error {
    padding-left: 20px;
    color: #F56C6C;
    font-size: 12px;
  }
}
</style>
