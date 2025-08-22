<template>
  <div class="list-page">
    <el-card>
      <div slot="header" class="clearfix">
        <span>角色管理</span>
        <div class="header-buttons">
          <el-button 
            type="danger" 
            size="small" 
            icon="el-icon-delete" 
            @click="handleBatchDelete"
            :disabled="selectedRoles.length === 0"
            class="btn-batch-delete"
          >
            批量删除 ({{ selectedRoles.length }})
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" class="btn-add">
            新增
          </el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table 
          :data="roleList" 
          class="list-page-table" 
          border 
          stripe 
          highlight-current-row 
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="角色ID" min-width="80"></el-table-column>
          <el-table-column prop="name" label="角色名称" min-width="180"></el-table-column>
          <el-table-column prop="desc" label="角色描述" width="auto" min-width="200"></el-table-column>
          <el-table-column label="操作" fixed="right" min-width="240">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="success" size="small" @click="handleAssignPermission(scope.row)">分配权限</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 新增/编辑角色弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="roleForm" :rules="roleRules" ref="roleForm" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="roleForm.desc" type="textarea" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 权限分配弹窗 -->
    <el-dialog title="分配权限" :visible.sync="permissionDialogVisible" width="600px">
      <el-tree :data="permissionTree" show-checkbox default-expand-all node-key="id" ref="permissionTree"
        highlight-current style="max-height: 450px; overflow-y: auto;" :props="treeProps"
        :default-checked-keys="defaultCheckedKeys"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '../../../utils/api';
export default {
  data() {
    return {
      selectedRoles: [], // 存储选中的角色
      switchStatus: {}, // 存储每个角色的开关状态
      roleList: [],
      permissionTree: [],
      dialogVisible: false,
      permissionDialogVisible: false,
      dialogTitle: '新增角色',
      roleForm: {
        id: '',
        name: '',
        desc: '',
        status: true
      },
      currentRoleId: '',
      roleRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },
      treeProps: {
        checked: 'checked'
      },
      defaultCheckedKeys: []
    }
  },
  mounted() {
    // 加载角色列表
    this.getRoleList();
  },
  methods: {
    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedRoles = selection;
    },

    // 批量删除
    handleBatchDelete() {
      if (this.selectedRoles.length === 0) {
        this.$message.warning('请选择要删除的角色');
        return;
      }

      const roleNames = this.selectedRoles.map(role => role.name).join('、');
      this.$confirm(
        `确定要删除以下角色吗？\n${roleNames}`,
        '批量删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        const roleIds = this.selectedRoles.map(role => role.id);
        
        api.post('/Admin/Permission/batchDelete', { ids: roleIds })
          .then(res => {
            if (res.result === 1) {
              this.$message({
                type: 'success',
                message: `成功删除 ${this.selectedRoles.length} 个角色`
              });
              // 重新获取列表
              this.getRoleList();
              // 清空选择
              this.selectedRoles = [];
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

    // 获取角色列表
    getRoleList() {
      api.get('/Admin/Permission/getList')
        .then(res => {
          if (res.result == 1) {
            this.roleList = res.data || [];
            // 初始化开关状态（1表示启用，0表示禁用）
            this.roleList.forEach(item => {
              this.$set(this.switchStatus, item.id, item.status === 1);
            });
          } else {
            this.$message.error(res.msg || '获取角色列表失败');
          }
        })
        .catch(err => {
          console.error('获取角色列表错误:', err);
          this.$message.error('网络错误，请稍后重试');
        });
    },

    handleAdd() {
      this.dialogTitle = '新增角色';
      this.roleForm = {
        id: '',
        name: '',
        desc: '',
        status: true
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑角色';
      this.roleForm = {
        ...row,
        status: row.status === 1
      };
      this.dialogVisible = true;
    },
    handleStatusChange(row, value) {
      const statusText = value ? '启用' : '禁用';
      this.$confirm(`确定要${statusText}角色 ${row.name} 吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用API更新角色状态（true转换为1，false转换为0）
        api.post('/Admin/Permission/updateStatus', {
          id: row.id,
          status: value ? 1 : 0
        })
          .then(res => {
            if (res.result == 1) {
              const index = this.roleList.findIndex(item => item.id === row.id);
              if (index !== -1) {
                this.roleList[index].status = value;
                this.$set(this.switchStatus, row.id, value);
              }
              this.$message({
                type: 'success',
                message: `${statusText}成功!`
              });
            } else {
              this.$message.error(res.msg || `${statusText}失败`);
              // 恢复原状态
              this.$set(this.switchStatus, row.id, row.status);
            }
          })
          .catch(err => {
            console.error('更新角色状态错误:', err);
            this.$message.error('网络错误，请稍后重试');
            // 恢复原状态
            this.$set(this.switchStatus, row.id, row.status);
          });
      }).catch(() => {
        // 取消操作，恢复原状态
        this.$set(this.switchStatus, row.id, row.status);
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    handleDelete(row) {
      this.$confirm('确定要删除角色 ' + row.name + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用API删除角色
        api.post('/Admin/Permission/delete', {
          id: row.id
        })
          .then(res => {
            if (res.result == 1) {
              this.roleList = this.roleList.filter(item => item.id !== row.id);
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message.error(res.msg || '删除失败');
            }
          })
          .catch(err => {
            console.error('删除角色错误:', err);
            this.$message.error('网络错误，请稍后重试');
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSubmit() {
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          // 调用API提交角色数据
          const apiMethod = 'post';
          const apiUrl = '/Admin/Permission/addOrEdit';

          // 提交前将status布尔值转换为1/0
          const formData = {
            ...this.roleForm,
            status: this.roleForm.status ? 1 : 0
          };
          api[apiMethod](apiUrl, formData)
            .then(res => {
              if (res.result == 1) {
                this.dialogVisible = false;
                this.$message({
                  type: 'success',
                  message: this.roleForm.id ? '编辑成功!' : '新增成功!'
                });
                // 重新加载角色列表
                this.getRoleList();
              } else {
                this.$message.error(res.msg || (this.roleForm.id ? '编辑失败' : '新增失败'));
              }
            })
            .catch(err => {
              console.error('提交角色数据错误:', err);
              this.$message.error('网络错误，请稍后重试');
            });
        }
      });
    },
    // 获取菜单列表
    getMenuList(auth_group_id) {
      return new Promise((resolve, reject) => {
        api.get('/Admin/Permission/permissionMenuList', { auth_group_id })
          .then(res => {
            if (res.result == 1) {
              // 确保数据格式符合el-tree要求
              // el-tree需要id, label, children等字段
              const formatData = (data) => {
                if (!data || !Array.isArray(data)) return [];

                // 1. 构建节点映射表，方便查找父节点
                const nodeMap = {};
                data.forEach(item => {
                  // 确保is_auth字段存在且类型正确
                  const isAuth = item.is_auth === 1 || item.is_auth === true;
                  nodeMap[item.id] = {
                    id: item.id,
                    label: item.name || item.label || item.title,
                    checked: isAuth,
                    children: []
                  };
                  // 打印节点信息，用于调试
                  console.log(`节点 ${item.id}: ${item.name}, is_auth: ${item.is_auth}, checked: ${isAuth}`);
                });

                // 2. 构建树形结构
                const treeData = [];
                data.forEach(item => {
                  const node = nodeMap[item.id];
                  // 判断是否是根节点，pid为0或者不存在pid
                  if (item.pid === 0 || !item.pid) {
                    // 根节点
                    treeData.push(node);
                  } else if (nodeMap[item.pid]) {
                    // 子节点，添加到父节点的children中
                    nodeMap[item.pid].children.push(node);
                  } else {
                    // 如果没有找到父节点，打印警告信息
                    console.warn(`找不到父节点 ${item.pid}，节点 ${item.id} 的父节点关系可能有问题`);
                  }
                });

                console.log(treeData);

                return treeData;
              };

              // 格式化菜单数据
              this.permissionTree = formatData(res.data);

              // 收集所有checked为true的节点id
              this.defaultCheckedKeys = [];
              const collectCheckedKeys = (tree) => {
                tree.forEach(node => {
                  if (node.checked) {
                    this.defaultCheckedKeys.push(node.id);
                  }
                  if (node.children && node.children.length > 0) {
                    collectCheckedKeys(node.children);
                  }
                });
              };
              collectCheckedKeys(this.permissionTree);

              console.log('默认选中的节点ID:', this.defaultCheckedKeys);
              resolve(this.permissionTree);
            } else {
              this.$message.error(res.msg);
              reject(new Error(res.msg));
            }
          })
          .catch(err => {
            console.error('获取菜单列表错误:', err);
            this.$message.error('网络错误，请稍后重试');
            reject(err);
          });
      });
    },
    handleAssignPermission(row) {
      this.currentRoleId = row.id;
      this.getMenuList(row.id).then(() => {
        // 在实际项目中，这里应该根据角色ID获取已分配的权限并设置选中状态
        this.permissionDialogVisible = true;
      });
    },
    handlePermissionSubmit() {
      // 获取选中的权限ID
      const selectedPermissionIds = this.$refs.permissionTree.getCheckedKeys();

      // 调用API保存角色的权限
      api.post('/Admin/Permission/visit', {
        id: this.currentRoleId,
        ids: selectedPermissionIds.join(',')
      })
        .then(res => {
          if (res.result == 1) {
            this.permissionDialogVisible = false;
            this.$message({
              type: 'success',
              message: res.msg
            });
          } else {
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.$message.error('网络错误，请稍后重试');
        });
    }
  }
}
</script>

<style lang="scss">
// 引入公共样式后，此处只保留页面特定样式
// 引入全局样式变量
@import '../../../assets/styles/variables.scss';

.list-page {
  .header-buttons {
    float: right;
    
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
  
  .btn-add {
    // 保持原有样式兼容性
  }

  // 表格列宽自适应
  .el-table .el-table__column--width-auto {
    flex: 1;
  }
}
</style>