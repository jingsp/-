<template>
  <el-dialog
    :title="title"
    :visible="addDialogVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    class="user-dialog"
    @close="closeDialog"
  >
    <el-form
      :model="goodsForm"
      label-position="right"
      label-width="150px"
      ref="goodsForm"
      :rules="rules"
    >
      <el-form-item
        label="商品名称："
        prop="goodsName"
      >
        <el-input
          v-model="goodsForm.goodsName"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
          :disabled="pageStatus==='edit'"
        />
      </el-form-item>
      <el-form-item
        label="商品编码："
        prop="goodsId"
      >
        <el-input
          v-model="goodsForm.goodsId"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="品牌："
        prop="brandName"
      >
        <el-input
          v-model="goodsForm.brandName"
          autocomplete="off"
          class="user__input"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item
        label="品类："
        prop="category"
      >
        <el-input
          v-model="goodsForm.category"
          autocomplete="off"
          show-password
          clearable
          class="user__input"
          placeholder="请输入"
          :disabled="pageStatus==='edit'"
        />
      </el-form-item>
      <el-form-item
        label="售价："
        prop="price"
      >
        <el-select
          v-model="goodsForm.price"
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
        label="图片："
        prop="pic"
      >
        <el-select
          v-model="goodsForm.pic"
          placeholder="请选择"
          class="user__input"
          :disabled="pageStatus==='edit'"
        >
          <el-option
            v-for="item in getpic"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
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
    addDialogVisible: {
      type: Boolean,
      default: false,
    },
    pageStatus: {
      type: String,
      default: 'add',
    },
  },
  data() {
    return {
      title: '新增用户',
      formLabelWidth: '100',
      goodsForm: {},
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
        goodsName: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          {
            min: 2, max: 10, message: '不能小于2个字符大于10个字符', trigger: 'blur',
          },
        ],
        goodsId: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
        ],
        brandName: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: this.validateTel, trigger: 'blur' },
        ],
        category: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请选择角色类型', trigger: 'blur' },
        ],
        pic: [
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
    };
  },
  computed: {
  },
  methods: {
    cancel() {
      this.$refs.goodsForm.clearValidate();
      this.$emit('update:addDialogVisible', false);
    },
    confirm() {
      this.$refs.goodsForm.validate((valid) => {
        if (valid) {
          this.save();
        }
      });
    },
    closeDialog() {
      this.$refs.goodsForm.clearValidate();
      this.$emit('update:addDialogVisible', false);
    },
    async save() {
      if (this.pageStatus === 'edit') {
        this.updateGoods();
      } else {
        this.addUser();
      }
    },
    async getGoodsDetail() {
      const data = await this.$api.coupon.getGoodsDetail({ id: this.userId });
      this.goodsForm = data || {};
      this.goodsForm.category = '******';
    },
    async addGoods() {
      const data = await this.$api.coupon.addGoods({
        ...this.goodsForm, customerId: this.customerTree[0].shortId,
      });
      if (data && data.code === '101') {
        this.errorMsg = '参数错误';
      } else if (data && data.code === '902') {
        this.errorMsg = '无操作权限';
      } else {
        this.$emit('update:addDialogVisible', false);
        // 更新用户列表
        this.$parent.reloadList();
        this.errorMsg = '';
      }
    },
    async updateGoods() {
      // 修改用户信息
      const data = await this.$api.coupon.updateGoods({ ...this.goodsForm });
      if (data && data.code === '101') {
        this.errorMsg = '参数错误';
      } else if (data && data.code === '902') {
        this.errorMsg = '无操作权限';
      }
    },
  },
  watch: {
    pageStatus() {
      if (this.pageStatus === 'edit') {
        this.title = '修改商品';
        this.getGoodsDetail();
      } else {
        this.title = '新增商品';
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
