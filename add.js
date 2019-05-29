<-- dialog关闭和取消的时候不能设置form的值为空 会影响表单验证 导致表格不能输入 -->

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
      if (this.$utils.checkRole('
