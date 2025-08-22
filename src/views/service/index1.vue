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
        <el-form-item label="名称">
          <el-input v-model="searchForm.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="searchForm.status" placeholder="请输入状态" clearable></el-input>
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
        <el-table-column prop="type_id" label="所属分类"></el-table-column>
        <el-table-column prop="content" label="详情介绍"></el-table-column>
        <el-table-column prop="know" label="用户须知"></el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column prop="virtual_count" label="虚拟服务人数"></el-table-column>
        <el-table-column prop="count" label="真实服务人数"></el-table-column>
        <el-table-column prop="score" label="评分"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
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

    <!-- 表单弹框 -->
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false">
      <el-form ref="form" :model="formData" label-width="120px" :rules="formRules">
        
        <el-form-item label="订单号" prop="order_sn">
          <el-input v-model="formData.order_sn" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="描述内容" prop="desc">
          <ckeditor :editor="formData.editor" v-model="formData.desc" />
        </el-form-item>
        <el-form-item label="所属分类" prop="type_id">
          <el-select v-model="formData.type_id" placeholder="请选择所属分类" filterable clearable>
            <el-option label="选项1" value="1"></el-option><el-option label="选项2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详情介绍" prop="content">
          <el-input
            type="textarea"
            v-model="formData.content"
            placeholder="请输入详情介绍"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户须知" prop="know">
          <el-input
            type="textarea"
            v-model="formData.know"
            placeholder="请输入用户须知"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort" placeholder="请输入排序" clearable></el-input>
        </el-form-item>
        <el-form-item label="虚拟服务人数" prop="virtual_count">
          <el-input v-model="formData.virtual_count" placeholder="请输入虚拟服务人数" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实服务人数" prop="count">
          <el-input v-model="formData.count" placeholder="请输入真实服务人数" clearable></el-input>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <el-input v-model="formData.score" placeholder="请输入评分" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="formData.status" placeholder="请输入状态" clearable></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="update_time">
          <el-input v-model="formData.update_time" placeholder="请输入修改时间" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="formData.create_time" placeholder="请输入创建时间" clearable></el-input>
        </el-form-item>
      </el-form>
      
      
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'

import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  components: {
    Pagination, ckeditor: CKEditor.component
  },
  data() {
      return {
        
        searchForm: {
          order_sn: '', name: '', status: ''
        },
        list: [],
        listLoading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        // 表单相关数据
        dialogVisible: false,
        formTitle: '',
        isEdit: false,
        submitLoading: false,
        formData: {
          id: '',
          order_sn: "",
          name: "",
          desc: "",
          type_id: "",
          content: "",
          know: "",
          sort: "",
          virtual_count: "",
          count: "",
          score: "",
          status: "",
          update_time: "",
          create_time: ""
          ,
          editor: ClassicEditor
        },
        formRules: {
          
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
          order_sn: '', name: '', status: ''
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
      this.formTitle = '新增服务表';
      this.isEdit = false;
      this.resetForm();
      this.dialogVisible = true;
    },

    // 编辑
    handleEdit(row) {
      this.formTitle = '编辑服务表';
      this.isEdit = true;
      // 赋值表单数据
      this.formData = {
        order_sn: row.order_sn || '',
        name: row.name || '',
        desc: row.desc || '',
        type_id: row.type_id || '',
        content: row.content || '',
        know: row.know || '',
        sort: row.sort || '',
        virtual_count: row.virtual_count || '',
        count: row.count || '',
        score: row.score || '',
        status: row.status || '',
        update_time: row.update_time || '',
        create_time: row.create_time || ''
        ,
        editor: ClassicEditor
      };
      this.dialogVisible = true;
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
    },

    // 表单提交
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          
          
          
          // 模拟API调用
          setTimeout(() => {
            this.submitLoading = false;
            this.dialogVisible = false;
            this.$message({ type: 'success', message: this.isEdit ? '编辑成功' : '新增成功' });
            this.loadList();
          }, 500);
        }
      });
    },

    // 取消
    handleCancel() {
      this.dialogVisible = false;
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.formData = {
        id: '',
        order_sn: "",
        name: "",
        desc: "",
        type_id: "",
        content: "",
        know: "",
        sort: "",
        virtual_count: "",
        count: "",
        score: "",
        status: "",
        update_time: "",
        create_time: ""
        ,
        editor: ClassicEditor
      };
      
      
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    }



    

    
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/search-form.scss';
@import '@/assets/styles/table.scss';
</style>