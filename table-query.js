<template>
  <div class="user-list-container">
    <div class="search-wrapper">
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center">
          <label
            for=""
            class="search-wrapper__label"
          >登录名：</label>
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="userName"
            class="search-wrapper__ipt"
            clearable
          />
        </div>
        <div class="d-flex align-center">
          <label
            for=""
            class="search-wrapper__label"
          >手机号：</label>
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="telphone"
            class="search-wrapper__ipt"
            clearable
          />
        </div>
        <div class="d-flex align-center">
          <label
            for=""
            class="search-wrapper__label"
          >姓名：</label>
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="fullName"
            class="search-wrapper__ipt"
            clearable
          />
        </div>
        <div class="d-flex align-center">
          <label
            for=""
            class="search-wrapper__label"
          >状态：</label>
          <el-select
            v-model="userState"
            class="search-wrapper__ipt"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option
              v-for="item of userStateObj"
              :key="item.id"
              :label="item.text"
              :value="item.id"
            />
          </el-select>
        </div>
      </div>
      <div class="d-flex justify-end search-btn">
        <el-button
          size="small"
          type="primary"
          @click="search"
        >查询</el-button>
        <el-button
          size="small"
          @click="reset"
        >重置</el-button>
      </div>
    </div>
    <div class="data-wrapper">
      <div class="btn-wrapper">
        <el-button
          type="primary"
          @click="add"
        >新增用户</el-button>
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
      >
        <el-table-column
          prop="fullName"
          label="姓名"
          width="150"
        />
        <el-table-column
          prop="userName"
          label="登录名"
          width="120"
        />
        <el-table-column
          prop="telphone"
          label="手机号"
          width="125"
        />
        <el-table-column
          prop="userState"
          label="用户状态"
          width="120"
        >
          <template slot-scope="scope">
            <!-- {{ scope.userState }} -->
            <div
              class="state-style"
              :class="{'valid': scope.row.userState===0 }"
            >
              <span
                class="dot"
                :class="{'valid': scope.row.userState===0 }"
              />
              <!-- {{ userStateObj[scope.row.userState] || '' }} -->
              {{ userStateObj.find(item => item.id === scope.row.userState).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="用户类型"
          width="100"
        />
        <el-table-column
          prop="userAttr"
          label="管理属性"
          width="120"
        >
          <template slot-scope="scope">
            {{ userAttrObj[scope.row.userAttr] || '' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="120"
        >
          <template slot-scope="scope">
            {{ $utils.formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLogon"
          label="上次登录时间"
          width="120"
        >
          <template slot-scope="scope">
            {{ $utils.formatDate(scope.row.lastLogon) }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="130"
        >
          <template
            slot-scope="scope"
          >
            <div class="d-flex align-center justify-space-between ">
              <el-button
                @click="goDetail(scope.row)"
                type="text"
                size="small"
              >查看</el-button>
              <el-button
                type="text"
                size="small"
                @click="openAuthorityModal(scope.row)"
                v-if="scope.row.userName!==$cookie.get('username')"
              >权限</el-button>
              <template v-if="scope.row.userName!==$cookie.get('username')">
                <el-dropdown
                  size="mini"
                  @command="handleCommand(scope.row, $event)"
                >
                  <span class="el-dropdown-link">
                    更多<i class="el-icon-arrow-down el-icon--right"/>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="modify">修改</el-dropdown-item>
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                    <el-dropdown-item command="freeze">冻结</el-dropdown-item>
                    <el-dropdown-item command="uptPwd">修改密码</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        :page-size="this.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="totalUsers"
        class="pagination-wrapper"
      />
    </div>
    <add-user
      :dialog-form-visible.sync="dialogFormVisible"
      :user-id="userId"
      :page-status="pageStatus"
      ref="addUser"
    />
  </div>
</template>

<script>
import AddUser from './add-user';

export default {
  data() {
    return {
      dialogFormVisible: false,
      dialogPwdVisible: false,
      pageStatus: 'add',
      userList: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      userName: '',
      telphone: '',
      fullName: '',
      userState: null,
      totalUsers: 0,
      userStateObj: [{
        id: 0,
        text: '生效中',
      }, {
        id: 1,
        text: '已失效',
      }, {
        id: 2,
        text: '已删除',
      }],
      userAttrObj: {
        0: '普通用户',
        1: '管理员',
      },
      userId: null,
      currentUserName: '',
    };
  },
  components: {
    AddUser,
  },
  methods: {
    reset() {
      this.userName = '';
      this.telphone = '';
      this.fullName = '';
      this.userState = null;
    },
    getParams() {
      const params = {};
      if (this.userName) {
        params.userName = this.userName;
      }
      if (this.telphone) {
        params.telphone = this.telphone;
      }
      if (this.fullName) {
        params.fullName = this.fullName;
      }
      if (this.userState || this.userState === 0) {
        params.userState = this.userState;
      }
      return params;
    },
    search() {
      this.currentPage = 1;
      const params = this.getParams();
      this.getUserList(params);
    },
    add() {
      this.dialogFormVisible = true;
      this.userId = null;
      this.pageStatus = 'add';
      this.$refs.addUser.userForm = {};
    },
    goDetail(row) {
      this.$router.push({
        path: `/user-detail/${row.id}`,
      });
    },
    async handleCommand(row, command) {
      this.currentUserName = row.userName;
      if (command === 'uptPwd') {
        this.dialogPwdVisible = true;
      } else if (command === 'modify') {
        // 修改
        this.userId = row.id;
        this.pageStatus = 'edit';
        this.dialogFormVisible = true;
      } else if (command === 'delete') {
        // 删除
        const data = await this.$confirm('你是否确认删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        if (data === 'confirm') {
          await this.operateUser({ id: row.id, state: 2 });
          await this.reloadList();
        }
      } else if (command === 'freeze') {
        const data = await this.$confirm('被冻结的帐号在帐号密码正确的情况下也无法正常登录系统，确定冻结？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
        if (data === 'confirm') {
          await this.operateUser({ id: row.id, state: 1 });
          await this.reloadList();
        }
      }
    },
    uptPassword() {
      this.dialogPwdVisible = true;
    },
    handleCurrentChange() {
      const params = this.getParams();
      this.getUserList(params);
    },
    async getUserList(params = {}) {
      const data = await this.$api.auth.getUserList({ pageNum: this.currentPage, pageSize: this.pageSize, module: params });
      this.userList = data.dataList || [];
      this.totalUsers = data.totalNumbers || 0;
    },
    async operateUser(params = {}) {
      await this.$api.auth.operateUser(params);
    },
    reloadList() {
      const params = this.getParams();
      this.getUserList(params);
    },
};
</script>
<style lang="scss">
.user-list-container {
  .el-dropdown {
    line-height: 1;
    font-size: 12px;
    color: #3E76FE;
  }
 .data-wrapper {
   .el-button + .el-button {
     margin-left: 0;
   }
 }

}

</style>

<style lang="scss" scoped>
.user-list-container {
  padding: 24px;
  // height: 100%;
  min-height: 500px;
  background-color: #fff;
}

.search-wrapper {

  &__label {
    width: 60px;
    text-align: right;
  }

  &__ipt {
    // margin-right: 30px;
    width: 191px;
  }

  .search-btn {
    margin: 24px 0;
  }
}

.state-style {
  display: inline-block;
  width: 80px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: rgba(0, 0, 0, 0.25);
  background-color: rgba(241,245,254,1);
  border-radius: 12px;
  &.valid {
    color: #52C41A;
    background-color: rgba(82,196,26,0.1);
  }
  .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.25);
    &.valid {
      background-color: #52C41A;
    }
  }

}

.data-wrapper {

  .btn-wrapper {
    margin-bottom: 24px;
  }
}
</style>
