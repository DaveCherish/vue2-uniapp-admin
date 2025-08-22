<template>
  <div class="list-page">
    <el-card>
      <div slot="header" class="header-container">
        <div class="header-title">
          <span>变量配置</span>
        </div>
        <div class="header-actions">
          <el-select v-model="currentGroupId" placeholder="全部分组" size="small" class="group-select">
            <el-option value="">全部分组</el-option>
            <el-option v-for="group in configGroupList" :key="group.id" :label="group.name"
              :value="group.id"></el-option>
          </el-select>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">
            新增
          </el-button>
        </div>
      </div>
      <div class="group-container">
        <el-collapse v-model="activeGroups">
          <el-collapse-item v-for="group in filteredGroups" :key="group"
            :title="`${group} (${(groupedVariables[group] && groupedVariables[group].length) || 0})`" :name="group">
            <el-table :data="groupedVariables[group] || []" class="group-table" border stripe highlight-current-row fit>
              <el-table-column prop="id" label="变量ID" min-width="80"></el-table-column>
              <el-table-column prop="title" label="变量名称" min-width="180"></el-table-column>
              <el-table-column prop="name" label="变量标识" min-width="180"></el-table-column>
              <el-table-column prop="value" label="变量值" width="auto" min-width="150"></el-table-column>
              <el-table-column prop="remark" label="变量描述" width="auto" min-width="200"></el-table-column>
              <el-table-column label="操作" min-width="90" fixed="right">
                <template slot-scope="scope">
                  <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
                  <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
        <div v-if="filteredGroups.length === 0" class="empty-tip">
          暂无变量数据
        </div>
      </div>
    </el-card>

    <!-- 新增/编辑变量弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form ref="variableForm" :model="variableForm" :rules="variableRules" label-width="100px">
        <el-form-item label="变量名称" prop="title">
          <el-input v-model="variableForm.title"></el-input>
        </el-form-item>
        <el-form-item label="变量标识" prop="name">
          <el-input v-model="variableForm.name"></el-input>
        </el-form-item>
        <el-form-item label="变量值" prop="value">
          <el-input v-model="variableForm.value"></el-input>
        </el-form-item>
        <el-form-item label="变量分组" prop="group_id">
          <el-select v-model="variableForm.group_id" placeholder="请选择变量分组">
            <el-option v-for="group in configGroupList" :key="group.id" :label="group.name"
              :value="group.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="变量描述">
          <el-input v-model="variableForm.remark" type="textarea" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  data() {
    return {
      configList: [],
      configGroupList: [], // 存储配置分组数据
      dialogVisible: false,
      dialogTitle: '新增变量',
      variableForm: {
        id: '',
        name: '',
        title: '',
        value: '',
        remark: '',
        group_id: '' // 使用groupId关联配置分组
      },
      variableRules: {
        title: [{ required: true, message: '请输入变量名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入变量标识', trigger: 'blur' }],
        value: [{ required: true, message: '请输入变量值', trigger: 'blur' }],
        group_id: [{ required: true, message: '请选择变量分组', trigger: 'blur' }]
      },
      activeGroups: [], // 显式定义展开的分组
      currentGroupId: '' // 默认显示所有分组
    }
  },
  mounted() {
    this.getConfigGroups();
    this.getVariableList();
  },
  methods: {
    // 获取配置分组列表
    getConfigGroups() {
      api.get('/Admin/ConfigGroup/getList')
        .then(res => {
          // 获取配置分组数据并按名称排序
          this.configGroupList = (res.data || []).sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        })
        .catch(err => {
          console.error('获取配置分组失败:', err);
          this.$message({
            type: 'error',
            message: '获取配置分组失败'
          });
        });
    },

    // 获取变量列表
    getVariableList() {
      api.get('/Admin/Config/getList')
        .then(res => {
          this.configList = res.data || [];

          // 为每个变量添加groupName属性，用于分组显示
          this.configList.forEach(variable => {
            const group = this.configGroupList.find(g => g.id === variable.group_id);
            variable.groupName = group ? group.name : '未分组';
          });

          // 延迟初始化activeGroups，确保filteredGroups已正确计算
          this.$nextTick(() => {
            // 默认展开所有分组
            this.activeGroups = [...this.filteredGroups];
          });
        })
        .catch(err => {
          console.error('获取变量列表失败:', err);
          this.$message({
            type: 'error',
            message: '获取变量列表失败'
          });
        });
    },

    handleAdd() {
      this.dialogTitle = '新增变量';
      this.variableForm = {
        id: '',
        title: '',
        name: '',
        value: '',
        remark: '',
        group_id: ''
      };
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogTitle = '编辑变量';
      this.variableForm = {
        id: row.id,
        title: row.title,
        name: row.name,
        value: row.value,
        remark: row.remark,
        group_id: row.group_id
      };
      this.dialogVisible = true;
    },
    handleDelete(row) {
      this.$confirm('确定要删除变量 ' + row.name + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除接口
        api.delete(`/Admin/Config/delete?id=${row.id}`)
          .then(res => {
            // 删除成功后，从前端列表中移除
            this.configList = this.configList.filter(item => item.id !== row.id);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .catch(err => {
            console.error('删除变量失败:', err);
            this.$message({
              type: 'error',
              message: '删除失败，请重试'
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
      this.$refs['variableForm'].validate((valid) => {
        if (valid) {
          // 调用新增/编辑接口
          api.post('/Admin/Config/addOrEdit', this.variableForm)
            .then(res => {
              if (res.result === 1) {
                this.dialogVisible = false;
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                // 重新获取变量列表
                this.getVariableList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
            .catch(err => {
              console.error('操作失败:', err);
              this.$message({
                type: 'error',
                message: '操作失败，请重试'
              });
            });
        }
      });
    }
  },
  computed: {
    // 按分组组织变量数据
    groupedVariables() {
      return this.configList.reduce((groups, variable) => {
        const groupName = variable.groupName || '未分组';
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(variable);
        return groups;
      }, {});
    },
    // 根据当前选择的分组筛选分组列表，并保持与configGroupList相同的排序
    filteredGroups() {
      if (this.currentGroupId === '') {
        // 获取所有不重复的分组名称，并按配置分组列表的顺序排序
        const groupNames = [...new Set(this.configList.map(variable => variable.groupName))];
        return groupNames.sort((a, b) => {
          // 找到分组在configGroupList中的索引进行排序
          const indexA = this.configGroupList.findIndex(group => group.name === a);
          const indexB = this.configGroupList.findIndex(group => group.name === b);
          // 未分组的放在最后
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      } else {
        // 根据groupId查找对应的分组名称
        const group = this.configGroupList.find(g => g.id === this.currentGroupId);
        if (group) {
          // 检查该分组是否有变量
          const hasVariables = this.configList.some(variable => variable.group_id === this.currentGroupId);
          return hasVariables ? [group.name] : [];
        }
        return [];
      }
    }
  },

}
</script>

<style lang="scss">
// 引入全局样式变量
@import '../../../assets/styles/variables.scss';

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .header-title {
    font-size: 16px;
    font-weight: bold;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.group-select {
  width: 160px;
}

.group-container {
  padding: 15px;
}

.group-table {
  margin-top: 10px;
}

.empty-tip {
  text-align: center;
  padding: 30px 0;
  color: #909399;
}

// 自定义折叠面板样式
.list-page .el-collapse-item__header {
  font-size: 14px;
  font-weight: 500;
  background-color: #f5f7fa;
  border-left: 3px solid #1890ff;
  padding-left: 15px;
  /* 添加左边距 */
}

.list-page .el-collapse-item__content {
  padding: 10px 0;
}

// 表格列宽自适应
.list-page .el-table .el-table__column--width-auto {
  flex: 1;
}
</style>