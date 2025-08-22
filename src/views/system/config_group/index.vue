<template>
  <div class="list-page">
    <el-card>
      <!-- 使用排序组件 -->
      <SortableList :visible.sync="sortDialogVisible" title="配置分组排序" width="600px" :data-source="configGroupList"
        @confirm="handleSortConfirm" />

      <div slot="header" class="clearfix">
        <span>配置分组管理</span>
        <div class="header-buttons">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd" class="btn-add">
            新增
          </el-button>
          <el-button type="default" size="small" icon="el-icon-sort" @click="handleSort">
            排序
          </el-button>
        </div>
      </div>
      <el-table v-loading="listLoading" :data="configGroupList" border fit highlight-current-row>
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="name" label="分组名称"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑配置分组对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px" :close-on-click-modal="false">
      <el-form :model="configGroupForm" :rules="configGroupRules" ref="configGroupForm" label-width="100px">
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="configGroupForm.name" placeholder="请输入分组名称"></el-input>
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
import SortableList from '@/components/SortableList.vue'

export default {
  components: {
    SortableList
  },
  data() {
    return {
      sortDialogVisible: false,
      configGroupList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      dialogTitle: '新增分组',
      configGroupForm: {
        id: '',
        name: '',
        sort: ''
      },
      configGroupRules: {
        name: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSort() {
      this.sortDialogVisible = true;
    },
    // 处理排序确认
    handleSortConfirm(sortedList) {
      // 调用排序接口
      api.post('/Admin/ConfigGroup/sort', { list: sortedList })
        .then(res => {
          if (res.result === 1) {
            this.$message({ type: 'success', message: res.msg });
            // 刷新菜单列表
            this.getList();
          } else {
            this.$message({ type: 'error', message: res.msg });
          }
        })
        .catch(error => {
          console.log(error);

          this.$message({ type: 'error', message: '排序出错，请重试' });
        });
    },

    getList() {
      this.listLoading = true
      api.get('/Admin/ConfigGroup/getList', { params: this.listQuery })
        .then(res => {
          this.configGroupList = res.data
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleAdd() {
      this.dialogTitle = '新增分组'
      this.configGroupForm = {
        id: '',
        name: '',
        sort: ''
      }
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.configGroupForm.resetFields()
      })
    },
    handleEdit(row) {
      this.dialogTitle = '编辑分组'
      this.configGroupForm = {
        id: row.id,
        name: row.name,
        sort: row.sort
      }
      this.dialogVisible = true
    },
    handleSubmit() {
      this.$refs.configGroupForm.validate(valid => {
        if (valid) {
          api.post('/Admin/ConfigGroup/addOrEdit', this.configGroupForm)
            .then(res => {
              if (res.result === 1) {
                this.$message({
                  message: res.msg,
                  type: 'success'
                })
                this.dialogVisible = false
                this.getList()
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error'
                })
              }
            })
            .catch(() => {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            })
        }
      })
    },
    handleDelete(id) {
      this.$confirm('确定要删除该分组吗？', '提示', {
        type: 'warning'
      }).then(() => {
        api.delete(`/Admin/ConfigGroup/delete?id=${id}`)
          .then(res => {
            if (res.result === 1) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          })
      })
        .catch(() => {
          this.$message({
            message: '已取消删除',
            type: 'info'
          })
        })
    }
  }
}
</script>

<style scoped>
.config-group-management {
  padding: 20px;
}

.pagination-container {
  margin-top: 16px;
  text-align: right;
}

.fr {
  float: right;
}
</style>