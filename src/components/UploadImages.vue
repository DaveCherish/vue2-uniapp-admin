<template>
  <el-upload
    action="#"
    list-type="picture-card"
    :auto-upload="false"
    :on-remove="handleRemove"
    :on-preview="handlePreview"
  >
    <i class="el-icon-plus"></i>
  </el-upload>
</template>

<script>
export default {
  props: { value: Array },
  methods: {
    handleRemove(file, fileList) {
      this.$emit('input', fileList)
    },
    handlePreview(file) {
      this.$alert(`<img src="${file.url}" style="max-width:100%">`, '预览', { dangerouslyUseHTMLString: true })
    }
  }
}
</script>
