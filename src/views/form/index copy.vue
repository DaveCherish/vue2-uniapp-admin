<template>
  <div class="form-page">
    <h2 class="form-title">新增用户</h2>
    <el-form ref="form" :model="form" label-width="120px" class="form-container" :rules="rules">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="单图上传">
        <el-upload class="upload-demo" action="" :limit="1" :file-list="singleImageList" :on-remove="handleRemoveSingle"
          :on-change="handleSingleChange" :on-preview="(file) => handlePreview(file, 'single')" list-type="picture-card"
          :auto-upload="false" accept="image/*">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="多图上传">
        <el-upload class="upload-demo" action="" list-type="picture-card" :file-list="multiImageList"
          :on-remove="handleRemoveMulti" :on-change="handleMultiChange"
          :on-preview="(file) => handlePreview(file, 'multi')" multiple :auto-upload="false" accept="image/*">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="单选">
        <el-radio-group v-model="form.radio">
          <el-radio label="选项A">选项A</el-radio>
          <el-radio label="选项B">选项B</el-radio>
          <el-radio label="选项C">选项C</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="多选">
        <el-checkbox-group v-model="form.checkbox">
          <el-checkbox label="苹果"></el-checkbox>
          <el-checkbox label="香蕉"></el-checkbox>
          <el-checkbox label="橙子"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="下拉选择">
        <el-select v-model="form.select" placeholder="请选择" filterable clearable>
          <el-option label="选项1" value="1" />
          <el-option label="选项2" value="2" />
          <el-option label="选项3" value="3" />
        </el-select>
      </el-form-item>

      <el-form-item prop="required" label="是否必填">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item>

      <el-form-item label="日期选择">
        <el-date-picker v-model="form.date" type="date" placeholder="选择日期" clearable />
      </el-form-item>

      <el-form-item label="日期时间选择">
        <el-date-picker v-model="form.dateTime" type="datetime" placeholder="选择日期时间" clearable />
      </el-form-item>

      <!-- 使用规格管理组件 -->
      <el-form-item label="商品规格">
        <specification-manager v-model="form.specData" />
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark" rows="4" placeholder="请输入备注" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>



      <!-- 图片预览组件 -->
      <image-preview ref="imagePreview"></image-preview>
    </el-form>
  </div>
</template>

<script>
// 引入样式文件
import SpecificationManager from '@/components/SpecificationManager.vue'
import ImagePreview from '@/components/ImagePreview.vue'
export default {
  components: { SpecificationManager, ImagePreview },
  data() {
    return {
      form: {
        title: '',
        singleImage: null,
        multiImages: [],
        richText: '',
        radio: '',
        checkbox: [],
        select: '',
        status: '',
        date: '',
        dateTime: '',
        remark: '',
        // 使用规格管理组件的数据结构 - 模拟数据用于测试回显
        specData: {
          specs: [
            {
              name: '颜色',
              values: ['红色', '蓝色', '绿色'],
              inputValue: ''
            },
            {
              name: '尺寸',
              values: ['S', 'M', 'L', 'XL'],
              inputValue: ''
            }
          ],
          combinations: [
            {
              '颜色': '红色',
              '尺寸': 'S',
              price: 99.99,
              stock: 100,
              image: ''
            },
            {
              '颜色': '红色',
              '尺寸': 'M',
              price: 109.99,
              stock: 150,
              image: ''
            },
            {
              '颜色': '红色',
              '尺寸': 'L',
              price: 119.99,
              stock: 200,
              image: ''
            },
            {
              '颜色': '红色',
              '尺寸': 'XL',
              price: 129.99,
              stock: 180,
              image: ''
            },
            {
              '颜色': '蓝色',
              '尺寸': 'S',
              price: 99.99,
              stock: 90,
              image: ''
            },
            {
              '颜色': '蓝色',
              '尺寸': 'M',
              price: 109.99,
              stock: 120,
              image: ''
            },
            {
              '颜色': '蓝色',
              '尺寸': 'L',
              price: 119.99,
              stock: 160,
              image: ''
            },
            {
              '颜色': '蓝色',
              '尺寸': 'XL',
              price: 129.99,
              stock: 140,
              image: ''
            },
            {
              '颜色': '绿色',
              '尺寸': 'S',
              price: 99.99,
              stock: 80,
              image: ''
            },
            {
              '颜色': '绿色',
              '尺寸': 'M',
              price: 109.99,
              stock: 110,
              image: ''
            },
            {
              '颜色': '绿色',
              '尺寸': 'L',
              price: 119.99,
              stock: 130,
              image: ''
            },
            {
              '颜色': '绿色',
              '尺寸': 'XL',
              price: 129.99,
              stock: 100,
              image: ''
            }
          ]
        }
      },
      singleImageList: [],
      multiImageList: [],
      editorOption: {
        placeholder: '请输入内容...'
      },


      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$message.success('提交成功！')
          console.log('表单数据', this.form)
        } else {
          this.$message.error('请完善表单信息')
        }
      })
    },
    resetForm() {
      this.$refs.form.resetFields()
      this.singleImageList = []
      this.multiImageList = []
    },

    handlePreview(file, type) {
      // 获取当前文件在列表中的索引
      let currentIndex = 0
      let allImages = []

      // 根据类型加载对应图片列表
      if (type === 'single') {
        allImages = this.singleImageList
        currentIndex = allImages.findIndex(f => f.uid === file.uid)
      } else if (type === 'multi') {
        allImages = this.multiImageList
        currentIndex = allImages.findIndex(f => f.uid === file.uid)
      }

      // 调用预览组件
      const imageUrls = allImages.map(f => f.url || URL.createObjectURL(f.raw))
      this.$refs.imagePreview.openPreview(imageUrls, currentIndex)
    },

    handleSingleChange(file, fileList) {
      fileList.forEach(file => {
        if (!file.url && file.raw) {
          file.url = URL.createObjectURL(file.raw)
        }
      })
      this.singleImageList = fileList.slice(-1)
    },
    handleRemoveSingle(file, fileList) {
      this.singleImageList = fileList
    },
    handleMultiChange(file, fileList) {
      fileList.forEach(file => {
        if (!file.url && file.raw) {
          file.url = URL.createObjectURL(file.raw)
        }
      })
      this.multiImageList = fileList
    },
    handleRemoveMulti(file, fileList) {
      this.multiImageList = fileList
    },


  }
}
</script>

<style lang="scss">
/* 引入外部样式文件 */
@import '@/assets/styles/form.scss';
</style>
