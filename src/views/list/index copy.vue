<template>
  <div class="list-page">
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="名称">
        <el-input v-model="searchForm.name" placeholder="请输入名称" clearable />
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
          <el-option label="启用" value="enabled" />
          <el-option label="禁用" value="disabled" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          unlink-panels
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="isSearching" @click="handleSearch">
          <i class="el-icon-search" v-if="!isSearching"></i>
          搜索
        </el-button>
        <el-button @click="handleReset">
          <i class="el-icon-refresh"></i> 重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格，带左右滚动和固定操作栏 -->
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        class="list-page-table"
        border
        height="550"
        :default-expand-all="false"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" min-width="80" />
        <el-table-column prop="name" label="名称" width="150" min-width="150" />
        <el-table-column prop="email" label="邮箱" width="180" min-width="180" />
        <el-table-column prop="phone" label="电话" width="150" min-width="150" />
        <el-table-column prop="address" label="地址" width="200" min-width="200" />
        <el-table-column prop="status" label="状态" width="120" min-width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="switchStatus[scope.row.id]"
              active-color="#13ce66"
              inactive-color="#909399"
              @change="handleStatusChange(scope.row, $event)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" width="auto" />
        <el-table-column prop="created_at" label="创建时间" width="180" min-width="180" />

        <!-- 固定操作栏 -->
        <el-table-column label="操作" fixed="right" min-width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <Pagination
        :total="pagination.total"
        :page="pagination.currentPage"
        :limit="pagination.pageSize"
        @pagination="handlePagination"
      />
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      isSearching: false,
      searchForm: {
        name: '',
        status: '',
        dateRange: []
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      // 存储开关状态
      switchStatus: {}
    }
  },
  mounted() {
    this.fetchData()
  },
  watch: {
    // 监听表格数据变化，重新初始化开关状态
    tableData: {
      handler() {
        this.initSwitchStatus()
      },
      immediate: true
    }
  },
  methods: {
    // 初始化开关状态
    initSwitchStatus() {
      this.tableData.forEach(item => {
        this.$set(this.switchStatus, item.id, item.status === '启用')
      })
    },
    // 状态切换处理
    handleStatusChange(row, value) {
      const newStatus = value ? '启用' : '禁用'
      this.$confirm(`确认将 ${row.name} 的状态修改为 ${newStatus} 吗？`, '提示').then(() => {
        // TODO：调用接口更新状态
        row.status = newStatus
        this.$message.success('状态更新成功')
      }).catch(() => {
        // 取消操作，重置开关状态
        this.$set(this.switchStatus, row.id, row.status === '启用')
      })
    },
    fetchData() {
      // 这里用假数据模拟，实际用接口请求
      // 模拟分页数据
      const totalRecords = 3350;
      this.pagination.total = totalRecords;
      
      // 生成当前页数据
      this.tableData = Array.from({
        length: Math.min(this.pagination.pageSize, totalRecords - (this.pagination.currentPage - 1) * this.pagination.pageSize)
      }, (_, index) => {
        const id = (this.pagination.currentPage - 1) * this.pagination.pageSize + index + 1;
        return {
          id: id,
          name: `用户${id}`,
          status: id % 2 === 0 ? '禁用' : '启用',
          email: `user${id}@example.com`,
          phone: `13800138${id.toString().padStart(4, '0')}`,
          address: `测试地址${id}`,
          created_at: '2025-01-01',
          remark: '无'
        }
      })
    },
    handlePagination({ page, limit }) {
      this.pagination.currentPage = page;
      this.pagination.pageSize = limit;
      this.fetchData();
    },
    handleSearch() {
      console.log('搜索条件：', this.searchForm)
      this.isSearching = true
      // 模拟搜索加载
      setTimeout(() => {
        // TODO：发接口请求数据，根据 this.searchForm 过滤
        this.fetchData()
        this.isSearching = false
      }, 500)
    },
    handleReset() {
      this.searchForm = { name: '', status: '', dateRange: [] }
      this.fetchData()
    },
    handleEdit(row) {
      this.$message(`编辑：${row.name}`)
      // 跳转编辑页面或弹出编辑表单
    },
    handleDelete(row) {
      this.$confirm(`确认删除 ${row.name} 吗？`, '提示').then(() => {
        this.$message.success('删除成功')
        // TODO：调用接口删除数据
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/search-form.scss';
@import '@/assets/styles/table.scss';
.list-page {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.status-normal {
  color: #409eff;
}

.status-hidden {
  color: #909399;
}
</style>