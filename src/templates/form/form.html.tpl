<template>
  <div class="form-container">
    <el-card>
      <template slot="header">
        <div class="card-header">
          <span>{{ isEdit ? '编辑' : '新增' }}{{ moduleName }}</span>
        </div>
      </template>

      <el-form ref="form" :model="formData" :rules="rules" label-width="120px">
        {{ formFieldsHtml }}

        <el-form-item label="ID" prop="id" v-show="false">
          <el-input v-model="formData.id" clearable></el-input>
        </el-form-item>

        {{ hasUploadFields ? '<!-- 图片预览组件 -->\n        <image-preview ref="imagePreview"></image-preview>' : '' }}

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>