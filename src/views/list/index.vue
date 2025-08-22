
<template>
  <div class="list-page">
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>服务表列表</span>
        <el-button
          style="float: right;"
          type="primary"
          @click="handleAdd"
        >
          新增
        </el-button>
      </div>

      
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        
        <el-form-item label="订单号">
          <el-input v-model="searchForm.order_sn" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述内容">
          <el-select v-model="searchForm.desc" placeholder="请选择描述内容" clearable>
            <el-option v-for="item in [{ value: '1', label: '选项1' }, { value: '2', label: '选项2' }]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属分类">
          <el-select v-model="searchForm.type_id" placeholder="请选择所属分类" clearable>
            <el-option v-for="item in [{ value: '1', label: '选项1' }, { value: '2', label: '选项2' }]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详情介绍">
          <el-select v-model="searchForm.content" placeholder="请选择详情介绍" clearable>
            <el-option v-for="item in [{ value: '1', label: '选项1' }, { value: '2', label: '选项2' }]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="排序，数值越小排序越靠前">
          <el-input v-model="searchForm.sort" placeholder="请输入排序，数值越小排序越靠前" clearable></el-input>
        </el-form-item>
        <el-form-item label="虚拟服务人数">
          <el-input v-model="searchForm.virtual_count" placeholder="请输入虚拟服务人数" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实服务人数">
          <el-select v-model="searchForm.count" placeholder="请选择真实服务人数" clearable>
            <el-option v-for="item in [{ value: '1', label: '选项1' }, { value: '2', label: '选项2' }]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="searchForm.score" placeholder="请输入评分" clearable></el-input>
        </el-form-item>
        <el-form-item label="1：显示，2：隐藏">
          <el-input v-model="searchForm.status" placeholder="请输入1：显示，2：隐藏" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      

      <!-- 表格区域 -->
      <div class="table-container">
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
        
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="order_sn" label="订单号"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="desc" label="描述内容"></el-table-column>
        <el-table-column prop="type_id" label="所属分类"></el-table-column>
        <el-table-column prop="content" label="详情介绍"></el-table-column>
        <el-table-column prop="know" label="用户须知"></el-table-column>
        <el-table-column prop="sort" label="排序，数值越小排序越靠前"></el-table-column>
        <el-table-column prop="virtual_count" label="虚拟服务人数"></el-table-column>
        <el-table-column prop="count" label="真实服务人数" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.count" :active-value="1" :inactive-value="0" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="1：显示，2：隐藏"></el-table-column>
        <el-table-column prop="update_time" label="修改时间"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)")>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </div>

      <!-- 分页组件 -->
      <template v-if="list && list.length > 0">
        <Pagination :total="pagination.total" :page="pagination.currentPage" :limit="pagination.pageSize"
          @pagination="handlePagination" />
      </template>
    </el-card>
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
        
        searchForm: {
          order_sn: '', desc: '', name: '', type_id: '', content: '', know: '', sort: '', virtual_count: '', count: '', score: '', status: ''
        },
        list: [],
        listLoading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        }
      };
    },
    filters: {
      formatDate(time) {
        if (!time) return '';
        const date = new Date(time * 1000);
        return date.toLocaleString();
      }
    },
    created() {
      this.loadList();
    },
    methods: {
      // 加载数据列表
      loadList() {
        this.listLoading = true;
        // 构建请求参数
        const params = {
          page: this.pagination.currentPage,
          pageSize: this.pagination.pageSize,
          ...this.searchForm
        };
        // 模拟API调用
        setTimeout(() => {
          // 这里应该是实际的API请求
          // 使用params参数发送请求
          this.list = []; // 实际数据
          this.total = 0; // 实际总数
          this.listLoading = false;
        }, 1000);
      },

      // 搜索
      handleSearch() {
        this.pagination.currentPage = 1;
        this.loadList();
      },

      // 重置搜索
      resetSearch() {
        this.searchForm = {
          order_sn: '', desc: '', name: '', type_id: '', content: '', know: '', sort: '', virtual_count: '', count: '', score: '', status: ''
        };
        this.pagination.currentPage = 1;
        this.loadList();
      },

    // 分页处理
    handlePagination(data) {
      this.pagination.currentPage = data.page;
      this.pagination.pageSize = data.limit;
      this.loadList();
    },

    // 新增
    handleAdd() {
      this.$router.push({ path: '/service/form' });
    },

    // 编辑
    handleEdit(row) {
      this.$router.push({ path: '/service/form', query: { id: row.id } });
    },

    // 删除
    handleDelete(id) {
      this.$confirm('确定要删除这条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟删除API调用
        setTimeout(() => {
          this.$message({ type: 'success', message: '删除成功' });
          this.loadList();
        }, 500);
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消删除' });
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/search-form.scss';
@import '@/assets/styles/table.scss';
</style>