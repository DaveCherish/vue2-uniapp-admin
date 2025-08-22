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

    <!-- 表单弹框 -->
    <el-dialog :title="formTitle" :visible.sync="dialogVisible" width="81vh" :close-on-click-modal="false" custom-class="form-dialog">
      <el-form ref="form" :model="formData" label-width="120px" :rules="formRules" class="form-container">
        
        <el-form-item label="订单号" prop="order_sn">
          <el-input v-model="formData.order_sn" placeholder="请输入订单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            type="textarea"
            v-model="formData.name"
            placeholder="请输入名称"
            :rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述内容" prop="desc">
          <el-select v-model="formData.desc" placeholder="请输入描述内容" filterable clearable>
            <el-option label="选项1" value="1"></el-option><el-option label="选项2" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分类" prop="type_id">
          <el-radio-group v-model="formData.type_id">
            <el-radio label="1" border>是</el-radio><el-radio label="0" border>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="详情介绍" prop="content">
          <el-checkbox-group v-model="formData.content">
            <el-checkbox label="1" border>选项1</el-checkbox><el-checkbox label="2" border>选项2</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="用户须知" prop="know">
          <el-date-picker
            v-model="formData.know"
            type="date"
            placeholder="请输入用户须知"
            clearable
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="排序，数值越小排序越靠前">
          <el-upload class="upload-demo" action="" :limit="1" :file-list="singleImageList" :on-remove="handleRemoveSingle"
            :on-change="handleSingleChange" :on-preview="(file) => handlePreview(file, 'single')"  list-type="picture-card"
            :auto-upload="false" accept="image/*">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="虚拟服务人数">
          <el-upload class="upload-demo" action="" :limit="10" :file-list="multiImageList" :on-remove="handleRemoveMulti"
            :on-change="handleMultiChange" :on-preview="(file) => handlePreview(file, 'multi')" multiple list-type="picture-card"
            :auto-upload="false" accept="image/*">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="真实服务人数" prop="count">
          <el-switch v-model="formData.count" ></el-switch>
        </el-form-item>
        <el-form-item label="评分" prop="score">
          <ckeditor :editor="formData.editor" v-model="formData.score" :config="editorConfig" class="rich-text-editor" />
        </el-form-item>
        <el-form-item label="1：显示，2：隐藏" prop="status">
          <el-input v-model="formData.status" placeholder="请输入1：显示，2：隐藏" clearable></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="update_time">
          <el-input v-model="formData.update_time" placeholder="请输入修改时间" clearable></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_time">
          <el-input v-model="formData.create_time" placeholder="请输入创建时间" clearable></el-input>
        </el-form-item>
      </el-form>
      
      <!-- 图片预览组件 -->
      <image-preview ref="imagePreview"></image-preview>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
import ImagePreview from '@/components/ImagePreview.vue'
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  components: {
    Pagination, ImagePreview, ckeditor: CKEditor.component
  },
  data() {
      return {
        
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
          content: [],
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
          
        },
        // 富文本编辑器配置
        editorConfig: {
          height: 300
        }
        ,
        singleImageList: []
        ,
        multiImageList: []
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
        content: row.content || [],
        know: row.know || '',
        sort: row.sort || '',
        virtual_count: row.virtual_count || '',
        count: row.count || false,
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
          
          
          // 处理上传文件
          
          if (this.singleImageList.length > 0) {
            this.formData.sort = this.singleImageList[0].url;
          }
          if (this.multiImageList.length > 0) {
            this.formData.virtual_count = this.multiImageList.map(file => file.url);
          }
          
          
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
        content: [],
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
      this.singleImageList = [];
      this.multiImageList = [];
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    },

    // 预览图片
    handlePreview(file, type) {
      // 获取当前文件在列表中的索引
      let currentIndex = 0;
      let allImages = [];

      // 根据类型加载对应图片列表
      if (type === 'single') {
        allImages = this.singleImageList;
        currentIndex = allImages.findIndex(f => f.uid === file.uid);
      } else if (type === 'multi') {
        allImages = this.multiImageList;
        currentIndex = allImages.findIndex(f => f.uid === file.uid);
      }

      // 调用预览组件
      const imageUrls = allImages.map(f => f.url || URL.createObjectURL(f.raw));
      this.$refs.imagePreview.openPreview(imageUrls, currentIndex);
    },

    // 单图上传变化处理
    handleSingleChange(file, fileList) {
      fileList.forEach(file => {
        if (!file.url && file.raw) {
          file.url = URL.createObjectURL(file.raw);
        }
      });
      this.singleImageList = fileList.slice(-1);
    },

    // 单图删除处理
    handleRemoveSingle(file, fileList) {
      this.singleImageList = fileList;
    },

    // 多图上传变化处理
    handleMultiChange(file, fileList) {
      fileList.forEach(file => {
        if (!file.url && file.raw) {
          file.url = URL.createObjectURL(file.raw);
        }
      });
      this.multiImageList = fileList;
    },

    // 多图删除处理
    handleRemoveMulti(file, fileList) {
      this.multiImageList = fileList;
    },
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/search-form.scss';
@import '@/assets/styles/table.scss';

// 弹框表单样式
.form-dialog {
  margin-top: 7vh !important;
  
  .el-dialog__body {
    max-height: 650px;
    overflow-y: auto;
    padding: 20px 25px;
  }
  
  .form-container {
    max-height: 100%;
  }
}


</style>