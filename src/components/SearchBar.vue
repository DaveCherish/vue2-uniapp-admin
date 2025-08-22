<template>
  <div style="margin-bottom: 20px;">
    <el-input
      placeholder="请输入关键字"
      v-model="keyword"
      style="width: 200px; margin-right: 10px;"
    />
    <el-button type="primary" @click="$emit('search', keyword)">搜索</el-button>
  </div>
</template>

<script>
export default {
  data() { return { keyword: '' } }
}
</script>
