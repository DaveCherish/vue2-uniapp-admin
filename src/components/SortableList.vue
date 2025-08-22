<template>
  <el-dialog :title="title" :visible.sync="visible" :width="width" center>
    <div class="sort-container">
      <div class="sort-list">
        <draggable v-model="list" :options="dragOptions" @end="onDragEnd">
          <div v-for="(item, index) in list" :key="item[idField]" class="sort-item">
            <i class="el-icon-d-caret sort-icon"></i>
            <span class="sort-name">{{ item[nameField] }}</span>
          </div>
        </draggable>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认排序</el-button>
    </div>
  </el-dialog>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'SortableList',
  components: {
    draggable
  },
  props: {
    // 是否显示对话框
    visible: {
      type: Boolean,
      default: false
    },
    // 对话框标题
    title: {
      type: String,
      default: '排序'
    },
    // 对话框宽度
    width: {
      type: String,
      default: '600px'
    },
    // 数据源
    dataSource: {
      type: Array,
      required: true
    },
    // 唯一标识字段名
    idField: {
      type: String,
      default: 'id'
    },
    // 显示名称字段名
    nameField: {
      type: String,
      default: 'name'
    },
    // 排序字段名
    sortField: {
      type: String,
      default: 'sort'
    },
    // 拖拽配置
    dragOptions: {
      type: Object,
      default: () => ({
        animation: 200,
        group: 'sortable',
        ghostClass: 'dragging'
      })
    }
  },
  data() {
    return {
      // 用于拖拽的列表数据
      list: [],
      // 原始列表数据，用于取消操作
      originalList: []
    }
  },
  watch: {
    // 监听数据源变化，更新列表
    dataSource: {
      handler(newVal) {
        this.list = JSON.parse(JSON.stringify(newVal))
        this.originalList = JSON.parse(JSON.stringify(newVal))
      },
      deep: true,
      immediate: true
    },
    // 监听visible变化，如果关闭对话框且有变化，提示是否保存
    visible(newVal) {
      if (!newVal && this.hasChanged()) {
        // 这里可以添加提示是否保存的逻辑
      }
    }
  },
  methods: {
    // 拖拽结束事件
    onDragEnd() {
      // 可以在这里添加拖拽结束后的逻辑
    },
    // 处理取消操作
    handleCancel() {
      // 恢复原始数据
      this.list = JSON.parse(JSON.stringify(this.originalList))
      // 关闭对话框
      this.$emit('update:visible', false)
    },
    // 处理确认操作
    handleConfirm() {
      // 更新排序值
      const sortedList = this.list.map((item, index) => ({
        [this.idField]: item[this.idField],
        [this.sortField]: index + 1
      }))
      // 触发排序确认事件，传递排序后的数据
      this.$emit('confirm', sortedList)
      // 关闭对话框
      this.$emit('update:visible', false)
    },
    // 检查列表是否有变化
    hasChanged() {
      if (this.list.length !== this.originalList.length) {
        return true
      }
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i][this.idField] !== this.originalList[i][this.idField]) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style lang="scss">
.sort-list {
  background-color: white;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;

  .sort-item {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    margin-bottom: 10px;
    border-radius: 6px;
    border: 1px solid transparent;
    background-color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: move;

    &:hover {
      background-color: #f0f7ff;
      border-color: #e6f7ff;
      transform: translateX(3px);
    }

    &.dragging {
      background-color: #e6f7ff;
      border: 1px dashed #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
      opacity: 0.9;
    }

    .sort-icon {
      color: #1890ff;
      margin-right: 15px;
      font-size: 18px;
    }

    .sort-name {
      font-size: 16px;
      font-weight: 500;
      flex: 1;
    }
  }
}
</style>