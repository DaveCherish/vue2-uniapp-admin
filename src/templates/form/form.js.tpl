<script>
${hasUploadFields ? "import ImagePreview from '@/components/ImagePreview.vue'" : ''}
${hasRichTextFields ? "import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'" : ''}
import { ${apiName} } from '@/utils/api';

export default {
  components: { ${hasUploadFields ? 'ImagePreview' : ''}${hasUploadFields && hasRichTextFields ? ', ' : ''}${hasRichTextFields ? 'ckeditor: CKEditor.component' : ''} },
  data() {
    return {
      moduleName: '${moduleName}',
      formData: {
        id: 0,
        ${formFieldsInit}
        ${hasRichTextFields ? 'editor: ClassicEditor' : ''}
      },
      ${hasSingleUploadField ? 'singleImageList: [],' : ''}
      ${hasMultiUploadField ? 'multiImageList: [],' : ''}

      rules: {
        ${formRules}
      },
      isEdit: false
    };
  },
  created() {
    const id = this.$route.query.id;
    if (id) {
      this.isEdit = true;
      this.loadFormData(id);
    }
  },
  methods: {
    // 加载表单数据
    loadFormData(id) {
      this.$loading.show();
      ${apiName}.getDetail(id)
        .then(response => {
          this.formData = response.data;
          ${hasUploadFields ? this.initUploadFieldsScript : ''}
          this.$loading.hide();
        })
        .catch(error => {
          console.error('获取${moduleName}详情失败:', error);
          this.$message({ type: 'error', message: '获取数据失败' });
          this.$loading.hide();
        });
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          ${hasUploadFields ? this.handleUploadFieldsScript : ''}

          this.$loading.show();
          const promise = this.isEdit
            ? ${apiName}.update(this.formData.id, this.formData)
            : ${apiName}.create(this.formData);

          promise
            .then(() => {
              this.$message({ type: 'success', message: this.isEdit ? '编辑成功' : '新增成功' });
              this.$router.go(-1);
              this.$loading.hide();
            })
            .catch(error => {
              console.error(this.isEdit ? '编辑${moduleName}失败:' : '新增${moduleName}失败:', error);
              this.$message({ type: 'error', message: this.isEdit ? '编辑失败' : '新增失败' });
              this.$loading.hide();
            });
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
      ${hasSingleUploadField ? 'this.singleImageList = [];' : ''}
      ${hasMultiUploadField ? 'this.multiImageList = [];' : ''}
    },

${hasUploadFields ? '    // 预览图片
    handlePreview(file, type) {
      // 获取当前文件在列表中的索引
      let currentIndex = 0;
      let allImages = [];

      // 根据类型加载对应图片列表
      if (type === \'single\') {
        allImages = this.singleImageList;
        currentIndex = allImages.findIndex(f => f.uid === file.uid);
      } else if (type === \'multi\') {
        allImages = this.multiImageList;
        currentIndex = allImages.findIndex(f => f.uid === file.uid);
      }

      // 调用预览组件
      const imageUrls = allImages.map(f => f.url || URL.createObjectURL(f.raw));
      this.$refs.imagePreview.openPreview(imageUrls, currentIndex);
    },' : ''}

${hasSingleUploadField ? `
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
    },` : ''}

${hasMultiUploadField ? `
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
    },` : ''}
  }
};
</script>