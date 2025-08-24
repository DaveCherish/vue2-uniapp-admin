<template>
  <div class="list-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>管理员列表</span>
        <div class="header-buttons">
          <el-button 
            type="danger" 
            size="small" 
            icon="el-icon-delete" 
            @click="handleBatchDelete"
            :disabled="selectedUsers.length === 0"
            class="btn-batch-delete"
          >
            批量删除 ({{ selectedUsers.length }})
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" class="btn-add">
            新增
          </el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table 
          :data="list" 
          class="list-page-table" 
          border 
          stripe 
          highlight-current-row 
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column 
            type="selection" 
            width="55" 
            :selectable="selectableRow"
          ></el-table-column>
          <el-table-column prop="id" label="ID" min-width="60"></el-table-column>
          <el-table-column prop="account" label="账号" min-width="120"></el-table-column>
          <el-table-column prop="roles" label="角色" min-width="180">
            <template slot-scope="scope">
              <span v-for="(role, index) in scope.row.roles" :key="role.id" class="role-tag"
                :class="{ 'last-tag': index === scope.row.roles.length - 1 }">{{ role.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
              <el-switch v-model="switchStatus[scope.row.id]" active-color="#13ce66" inactive-color="#909399"
                @change="handleStatusChange(scope.row, $event)" :disabled="scope.row.id === 1"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="280">
            <template slot-scope="scope">

              <el-button type="success" size="small" @click="handleAssignRoles(scope.row)"
                v-if="scope.row.id !== 1">分配角色</el-button>
              <el-button type="warning" size="small" @click="handleResetPassword(scope.row)">密码初始化</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)"
                v-if="scope.row.id !== 1">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页组件 -->
      <pagination
        :total="total"
        :page.sync="page"
        :pageSize.sync="pageSize"
        @pagination="handlePagination"
      />
    </el-card>

    <!-- 新增/编辑管理员弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="adminForm" :rules="adminRules" ref="adminForm" label-width="100px">
        <el-form-item v-if="adminForm.id" label="ID" prop="id">
          <el-input v-model="adminForm.id" placeholder="ID" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item label="账号" prop="account">
          <el-input v-model="adminForm.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!adminForm.id">
          <el-input v-model="adminForm.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword" v-if="!adminForm.id">
          <el-input v-model="adminForm.confirmPassword" type="password" placeholder="请确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 角色分配弹窗 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogVisible" width="600px">
      <el-tree :data="roleTree" show-checkbox default-expand-all node-key="id" ref="roleTree"
        highlight-current></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api'
import Pagination from '@/components/Pagination.vue'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectedUsers: [], // 存储选中的用户
      switchStatus: {}, // 存储每个管理员的开关状态
      list: [],
      roleTree: [
        {
          id: 1,
          label: '超级管理员'
        },
        {
          id: 2,
          label: '普通管理员'
        },
        {
          id: 3,
          label: '内容管理员'
        },
        {
          id: 4,
          label: '用户管理员'
        }
      ],
      dialogVisible: false,
      roleDialogVisible: false,
      dialogTitle: '新增',
      adminForm: {
        id: '',
        account: '',
        password: '',
        confirmPassword: ''
      },
      currentAdminId: null,
      adminRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 20, message: '账号长度在 5 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      },
      // 分页相关属性
      page: 1,
      pageSize: 1,
      total: 0
    };
  },
  mounted() {
    this.getAdminList();
  },
  methods: {
    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedUsers = selection;
    },

    // 控制哪些行可以被选择（超级管理员不能被选择删除）
    selectableRow(row) {
      return row.id !== 1; // ID为1的超级管理员不能被选择
    },

    // 批量删除
    handleBatchDelete() {
      if (this.selectedUsers.length === 0) {
        this.$message.warning('请选择要删除的管理员');
        return;
      }

      const userNames = this.selectedUsers.map(user => user.account).join('、');
      this.$confirm(
        `确定要删除以下管理员吗？\n${userNames}`,
        '批量删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        const userIds = this.selectedUsers.map(user => user.id);
        
        api.post('/Admin/user/batchDelete', { ids: userIds })
          .then(res => {
            if (res.result === 1) {
              this.$message({
                type: 'success',
                message: `成功删除 ${this.selectedUsers.length} 个管理员`
              });
              // 重新获取列表
              this.getAdminList();
              // 清空选择
              this.selectedUsers = [];
            } else {
              this.$message({
                type: 'error',
                message: res.msg || '批量删除失败'
              });
            }
          })
          .catch(err => {
            console.error('批量删除失败:', err);
            this.$message({
              type: 'error',
              message: '批量删除失败，请重试'
            });
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 获取管理员列表
    getAdminList() {
      api.get('/Admin/user/getList', {page: this.page, pageSize: this.pageSize}).then(res => {
        this.list = res.data.list || [];
        this.total = res.data.pagination && res.data.pagination.total || 0;
        // 初始化开关状态，将status=1映射为true，status=-1映射为false
        this.list.forEach(item => {
          this.$set(this.switchStatus, item.id, item.status === 1);
        });
      }).catch(err => {
        console.error('获取管理员列表失败:', err);
        this.$message.error('获取管理员列表失败');
      });
    },

    validateConfirmPassword(rule, value, callback) {
      if (value !== this.adminForm.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },

    // 处理分页事件
    handlePagination(params) {
      // 通过.sync修饰符，page和pageSize已经自动同步，这里只需要重新获取数据
      this.getAdminList();
    },
    handleAdd() {
      this.dialogTitle = '新增';
      this.adminForm = {
        account: '',
        password: '',
        confirmPassword: '',
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑管理员';
      // 深拷贝，避免直接修改原数据
      this.adminForm = {
        ...row,
        // 编辑时清除密码
        password: '',
        confirmPassword: ''
      };
      this.dialogVisible = true;
    },
    handleStatusChange(row, value) {
      const status = value ? 1 : -1;
      const statusText = value ? '启用' : '禁用';
      this.$confirm(`确定要${statusText}管理员 ${row.account} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用API更新状态
        api.post('/Admin/user/doStatus', {
          id: row.id,
          status: status
        }).then(res => {
          if (res.result === 1) {
            const index = this.list.findIndex(item => item.id === row.id);
            if (index !== -1) {
              this.list[index].status = status;
              this.$set(this.switchStatus, row.id, value);
            }
            this.$message({
              type: 'success',
              message: `${statusText}成功!`
            });
          } else {
            this.$message({
              type: 'error',
              message: res.msg || `${statusText}失败`
            });
          }
        }).catch(err => {
          console.error(`${statusText}管理员失败:`, err);
          this.$message({
            type: 'error',
            message: `${statusText}失败`
          });
        });
      }).catch(() => {
        // 取消操作，恢复原状态
        this.$set(this.switchStatus, row.id, row.status === 1);
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除管理员 ' + row.account + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除API
        api.post('/Admin/user/delete', { id: row.id }).then(res => {
          if (res.result === 1) {
            this.list = this.list.filter(item => item.id !== row.id);
            this.$message({
              type: 'success',
              message: res.msg || '删除成功!'
            });
          } else {
            this.$message({
              type: 'error',
              message: res.msg || '删除失败'
            });
          }
        }).catch(err => {
          console.error('删除管理员失败:', err);
          const errorMsg = err.response && err.response.data && err.response.data.msg ? err.response.data.msg : '删除失败';
          this.$message({
            type: 'error',
            message: errorMsg
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    handleSubmit() {
      this.$refs.adminForm.validate((valid) => {
        if (valid) {
          // 准备提交数据
          let formData = {};
          if (this.adminForm.id) {
            // 编辑（虽然隐藏了编辑按钮，但保留功能）
            formData = { ...this.adminForm };
            // 如果密码为空，则不更新密码
            if (!formData.password) {
              delete formData.password;
              delete formData.confirmPassword;
            }
          } else {
            // 新增，只提交account和password
            formData = {
              account: this.adminForm.account,
              password: this.adminForm.password
            };
          }

          // 调用API
          // 使用Promise处理API调用，以便能够返回结果
          api.post('/Admin/user/addOrEdit', formData).then(res => {
            if (res.result == 1) {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.dialogVisible = false;
              // 重新获取管理员列表
              this.getAdminList();
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
        }
      });
    },
    handleAssignRoles(row) {
      this.currentAdminId = row.id;
      // 在实际项目中，这里应该根据管理员ID获取已分配的角色并设置选中状态
      // 模拟选中当前管理员的角色
      setTimeout(() => {
        const admin = this.list.find(item => item.id === this.currentAdminId);
        if (admin && admin.roles && admin.roles.length > 0) {
          const roleIds = admin.roles.map(role => role.id);
          this.$refs.roleTree.setCheckedKeys(roleIds);
        }
      }, 0);
      this.roleDialogVisible = true;
    },
    handleRoleSubmit() {
      // 获取选中的角色ID
      const selectedRoleIds = this.$refs.roleTree.getCheckedKeys();
      // 获取对应的角色名称
      const selectedRoles = this.roleTree
        .filter(role => selectedRoleIds.includes(role.id))
        .map(role => ({ id: role.id, name: role.label }));
      // 更新管理员的角色
      const index = this.list.findIndex(item => item.id === this.currentAdminId);
      if (index !== -1) {
        this.list[index].roles = selectedRoles;
      }
      this.roleDialogVisible = false;
      this.$message({
        type: 'success',
        message: '角色分配成功!'
      });
    },
    handleResetPassword(row) {
      this.$confirm(`确定要初始化管理员 ${row.account} 的密码吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用密码初始化API
        api.post('/Admin/user/initpassword', { id: row.id }).then(res => {
          if (res.result === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            });
          } else {
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        }).catch(err => {
          console.error('密码初始化失败:', err);
          const errorMsg = err.response && err.response.data && err.response.data.msg ? err.response.data.msg : '密码初始化失败';
          this.$message({
            type: 'error',
            message: errorMsg
          });
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    }
  }
};
</script>

<style lang="scss">
// 操作栏按钮样式
.el-table .cell .el-button--small {
  margin-right: 5px !important;
  display: inline-block;
}

.el-table .cell .el-button--small:last-child {
  margin-right: 0 !important;
}

// 引入全局样式变量
@import '../../../assets/styles/variables.scss';

.header-buttons {
  .el-button {
    margin-left: 10px;
  }
  
  .btn-batch-delete {
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

// 角色标签样式
.role-tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: #e6f7ff;
  color: #1890ff;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 4px;

  &.last-tag {
    margin-right: 0;
  }
}

// 表格容器样式
.table-wrapper {
  padding: 20px;
  overflow-x: auto;
}


// 表格样式
.list-page-table {
  width: 100%;
  border-radius: $radius;
  overflow: hidden;
}

// 弹窗样式
.el-dialog {
  border-radius: $radius;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: dialogFadeIn 0.3s ease;
}

// 弹窗标题样式
.el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: $text-color;
  padding: 0 10px;
}

// 弹窗头部样式
.el-dialog__header {
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid $border-color;
}

// 弹窗内容区域样式
.el-dialog__body {
  padding: 24px;
  background-color: #fff;
  max-height: 60vh;
  overflow-y: auto;
}

// 弹窗淡入动画
@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 表单样式
.el-form-item {
  margin-bottom: 20px;
}
</style>