<template>
  <div class="list-page">
    <el-card>
      <!-- 使用排序组件 -->
      <SortableList :visible.sync="sortDialogVisible" title="数据字典排序" width="600px" :data-source="dictionaryList"
        @confirm="handleSortConfirm" />

      <div slot="header" class="clearfix">
        <span>数据字典</span>
        <div class="header-buttons">
          <el-button 
            type="danger" 
            size="small" 
            icon="el-icon-delete" 
            @click="handleBatchDelete"
            :disabled="selectedDictionaries.length === 0"
            class="btn-batch-delete"
          >
            批量删除 ({{ selectedDictionaries.length }})
          </el-button>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" class="btn-add">
            新增
          </el-button>
          <el-button type="default" size="small" icon="el-icon-sort" @click="handleSort">
            排序
          </el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table 
          :data="dictionaryList" 
          class="list-page-table" 
          border 
          stripe 
          highlight-current-row 
          fit
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="字典ID" min-width="80"></el-table-column>
          <el-table-column prop="name" label="字典名称" min-width="180"></el-table-column>
          <el-table-column prop="desc" label="字典描述" width="auto" min-width="200"></el-table-column>
          <el-table-column prop="sort" label="排序" min-width="80"></el-table-column>
          <el-table-column prop="dictItem" label="字典项数量" min-width="120">
            <template slot-scope="scope">{{ (scope.row.dictItem && scope.row.dictItem.length) || 0 }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="220" fixed="right">
            <template slot-scope="scope">
              <el-button type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="handleViewItems(scope.row)">查看项</el-button>
              <el-button type="success" size="small" @click="handleAddItem(scope.row)">新增项</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 新增/编辑字典名称弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="dictionaryForm" :rules="dictionaryRules" ref="dictionaryForm" label-width="100px">
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="dictionaryForm.name" placeholder="请输入字典名称"></el-input>
        </el-form-item>
        <el-form-item label="字典描述" prop="desc">
          <el-input v-model="dictionaryForm.desc" type="textarea" placeholder="请输入字典描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 字典项管理弹窗 -->
    <el-dialog :title="itemDialogTitle" :visible.sync="itemDialogVisible" width="650px">
      <div v-if="currentDictionary">
        <el-table :data="currentDictionary.dictItem" border stripe highlight-current-row fit>
          <el-table-column prop="key" label="键名" min-width="150"></el-table-column>
          <el-table-column prop="value" label="键值" min-width="150"></el-table-column>
          <el-table-column prop="status" label="状态" min-width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                @change="handleItemStatusChange(scope.row, $event)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="180" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEditItem(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteItem(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemDialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 新增/编辑字典项弹窗 -->
    <el-dialog :title="itemFormTitle" :visible.sync="itemFormVisible" width="500px">
      <el-form :model="itemForm" :rules="itemRules" ref="itemForm" label-width="100px">
        <el-form-item label="键名" prop="key">
          <el-input v-model="itemForm.key" placeholder="请输入键名"></el-input>
        </el-form-item>
        <el-form-item label="键值" prop="value">
          <el-input v-model="itemForm.value" placeholder="请输入键值"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="itemFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleItemSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/utils/api'
import SortableList from '@/components/SortableList.vue'

export default {
  components: {
    SortableList
  },
  data() {
    return {
      selectedDictionaries: [], // 存储选中的字典
      sortDialogVisible: false,
      dictionaryList: [],
      dialogVisible: false,
      dialogTitle: '新增字典名称',
      dictionaryForm: {
        id: '',
        name: '',
        desc: ''
      },
      dictionaryRules: {
        name: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ]
      },
      itemDialogVisible: false,
      itemDialogTitle: '字典项管理',
      currentDictionary: null,
      itemFormVisible: false,
      itemFormTitle: '新增字典项',
      itemForm: {
        id: '',
        dict_id: '',
        key: '',
        value: ''
      },
      itemRules: {
        key: [
          { required: true, message: '请输入键名', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入键值', trigger: 'blur' }
        ]
      },
      editingItem: null
    }
  },
  mounted() {
    this.getDictionaryList();
  },
  methods: {
    // 处理选择变化
    handleSelectionChange(selection) {
      this.selectedDictionaries = selection;
    },

    // 批量删除
    handleBatchDelete() {
      if (this.selectedDictionaries.length === 0) {
        this.$message.warning('请选择要删除的数据字典');
        return;
      }

      const dictNames = this.selectedDictionaries.map(dict => dict.name).join('、');
      this.$confirm(
        `确定要删除以下数据字典吗？\n${dictNames}`,
        '批量删除确认',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }
      ).then(() => {
        const dictIds = this.selectedDictionaries.map(dict => dict.id);
        
        api.post('/Admin/Dict/batchDelete', { ids: dictIds })
          .then(res => {
            if (res.result === 1) {
              this.$message({
                type: 'success',
                message: `成功删除 ${this.selectedDictionaries.length} 个数据字典`
              });
              // 重新获取列表
              this.getDictionaryList();
              // 清空选择
              this.selectedDictionaries = [];
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

    // 处理排序确认
    handleSortConfirm(sortedList) {
      // 调用排序接口
      api.post('/Admin/Dict/sort', { list: sortedList })
        .then(res => {
          if (res.result === 1) {
            this.$message({ type: 'success', message: res.msg });
            // 刷新字典列表
            this.getDictionaryList();
          } else {
            this.$message({ type: 'error', message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);
          this.$message({ type: 'error', message: '排序出错，请重试' });
        });
    },

    // 打开排序对话框
    handleSort() {
      this.sortDialogVisible = true;
    },

    // 获取字典列表
    getDictionaryList() {
      api.get('/Admin/Dict/getList')
        .then(res => {
          this.dictionaryList = res.data || [];
        })
        .catch(err => {
          console.error('获取字典列表失败:', err);
          this.$message({
            type: 'error',
            message: '获取字典列表失败'
          });
        });
    },

    // 新增字典名称
    handleAdd() {
      this.dialogTitle = '新增字典名称';
      this.dictionaryForm = {
        id: '',
        name: '',
        desc: ''
      };
      this.dialogVisible = true;
    },

    // 编辑字典名称
    handleEdit(row) {
      this.dialogTitle = '编辑字典名称';
      this.dictionaryForm = { ...row };
      this.dialogVisible = true;
    },

    // 删除字典名称
    handleDelete(row) {
      this.$confirm('确定要删除字典名称 ' + row.name + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delete(`/Admin/Dict/delete?id=${row.id}`)
          .then(res => {
            console.log(res.result, typeof res.result);

            // 检查res.result是否为成功状态，兼容不同类型的返回值
            // 检查res.result是否为成功状态，兼容不同类型的返回值
            if (res.result === 1) {
              this.dictionaryList = this.dictionaryList.filter(item => item.id !== row.id);
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
          })
          .catch(err => {
            console.error('删除字典名称失败:', err);
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

    // 提交字典名称表单
    handleSubmit() {
      this.$refs.dictionaryForm.validate((valid) => {
        if (valid) {
          api.post('/Admin/Dict/addOrEdit', this.dictionaryForm)
            .then(res => {
              // 检查res.result是否为成功状态，兼容不同类型的返回值
              if (res.result === 1) {
                this.dialogVisible = false;
                this.$message({
                  type: 'success',
                  message: res.msg
                });
                this.getDictionaryList();
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                });
              }
            })
            .catch(err => {
              console.error('提交字典名称失败:', err);
              this.$message({
                type: 'error',
                message: '操作失败，请重试'
              });
            });
        }
      });
    },

    // 查看字典项
    handleViewItems(row) {
      this.currentDictionary = row;
      this.itemDialogTitle = `字典项管理 - ${row.name}`;
      this.itemDialogVisible = true;
    },

    // 新增字典项
    handleAddItem(row) {
      this.currentDictionary = row;
      this.itemFormTitle = '新增字典项';
      this.itemForm = {
        id: '',
        dict_id: row.id,
        key: '',
        value: ''
      };
      this.editingItem = null;
      this.itemFormVisible = true;
    },

    // 编辑字典项
    handleEditItem(item) {
      this.editingItem = item;
      this.itemFormTitle = '编辑字典项';
      this.itemForm = { ...item };
      this.itemFormVisible = true;
    },

    // 修改字典项状态
    handleItemStatusChange(item, value) {
      // 先更新本地状态，提高用户体验
      const oldStatus = item.status;

      api.post('/Admin/DictItem/doStatus', {
        id: item.id,
        status: value
      })
        .then(res => {
          // 检查res.result是否为成功状态，兼容不同类型的返回值
          if (res.result === 1) {
            this.$message({
              type: 'success',
              message: res.msg
            });
          } else {
            item.status = oldStatus;
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
        .catch(err => {
          // 恢复原始状态
          item.status = oldStatus;
          console.error(`修改字典项状态失败:`, err);
          this.$message({
            type: 'error',
            message: '操作失败，请重试'
          });
        });
    },

    // 删除字典项
    handleDeleteItem(item) {
      this.$confirm('确定要删除字典项 ' + item.key + ' 吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.delete(`/Admin/DictItem/delete?id=${item.id}`)
          .then(res => {
            console.log(res.result, typeof res.result);

            // 检查res.result是否为成功状态，兼容不同类型的返回值
            if (res.result === 1) {
              // 从当前字典项列表中移除
              const index = this.currentDictionary.dictItem.findIndex(i => i.id === item.id);
              if (index !== -1) {
                this.currentDictionary.dictItem.splice(index, 1);
              }
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getDictionaryList();
            } else {
              this.$message({
                type: 'error',
                message: res.msg
              });
            }
          })
          .catch(err => {
            console.error('删除字典项失败:', err);
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

    // 提交字典项表单
    handleItemSubmit() {
      this.$refs.itemForm.validate((valid) => {
        if (valid) {
          api.post('/Admin/DictItem/addOrEdit', this.itemForm)
            .then(res => {
              if (res.result === 1) {
                this.itemFormVisible = false;
                this.$message({
                  type: 'success',
                  message: res.msg || '操作成功!'
                });

                // 如果是编辑状态，使用 Vue.set 更新字典项
                if (this.editingItem) {
                  // 找到要更新的字典项
                  const index = this.currentDictionary.dictItem.findIndex(item => item.id === this.editingItem.id);
                  if (index !== -1) {
                    // 使用 Vue.set 来确保响应式更新
                    this.$set(this.currentDictionary.dictItem, index, { ...this.itemForm });
                  }
                } else {
                  // 如果是新增项，直接添加到字典项中
                  this.currentDictionary.dictItem.push({ ...this.itemForm });
                }

                // 重新更新字典列表，确保字典项更新后的显示
                this.dictionaryList = [...this.dictionaryList];  // 通过重新赋值触发 re-render
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg || '操作失败'
                });
              }
            })
            .catch(err => {
              console.error('提交字典项失败:', err);
              this.$message({
                type: 'error',
                message: '操作失败，请重试'
              });
            });
        }
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