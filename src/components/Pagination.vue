<template>
  <div class="pagination-container">
    <el-pagination
      :current-page="currentPage"
      :page-size="innerPageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    // 总条目数
    total: {
      type: Number,
      required: true,
      default: 0
    },
    // 当前页码
    page: {
      type: Number,
      default: 1
    },
    // 每页条数
    pageSize: {
      type: Number,
      default: 10
    },
    // 可选的每页条数
    pageSizes: {
      type: Array,
      default: () => [1, 2, 50, 100]
    },
    // 布局
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 是否自动触发查询
    autoFetch: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentPage: this.page,
      innerPageSize: this.pageSize
    }
  },
  watch: {
      // 监听props中的page变化，更新内部currentPage
      page: {
        immediate: true,
        handler(val) {
          this.currentPage = val
        }
      },
      // 监听props中的pageSize变化，更新内部innerPageSize
      pageSize: {
        immediate: true,
        handler(val) {
          // 确保只在val有值时更新
          if (val !== undefined) {
            this.innerPageSize = val
          }
        }
      }
  },
  methods: {
    handleSizeChange(val) {
      this.innerPageSize = val
      // 切换每页条数时，重置页码为第1页
      this.currentPage = 1
      
      // 通过.sync机制通知父组件更新
      this.$emit('update:page', 1)
      this.$emit('update:pageSize', val)
      
      if (this.autoFetch) {
        this.$emit('pagination', { page: 1, pageSize: val })
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      
      // 通过.sync机制通知父组件更新
      this.$emit('update:page', val)
      
      if (this.autoFetch) {
        // 确保使用当前组件内部的pageSize值，而不是props默认值
        this.$emit('pagination', { page: val, pageSize: this.innerPageSize })
      }
    }
  }
}
</script>

<style lang="scss">
// 分页组件样式 - 极致精美版
.pagination-container {
  margin-top: 24px;
  padding: 16px 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 6px 20px 0 rgba(0, 0, 0, 0.08);
  }

  .el-pagination {
    font-size: 14px;
    color: #606266;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    button, span:not([class*=suffix]) {
      height: 36px !important;
      line-height: 36px !important;
    }

    .el-pagination__total {
      margin-right: 0;
      font-weight: 500;
      color: #303133;
      padding: 0;
      height: 36px;
      line-height: 36px;
      display: flex;
      align-items: center;
    }

    .el-select .el-input {
      margin-right: 0;

      .el-input__inner {
        border-radius: 6px;
        border: 1px solid #e4e7ed;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        height: 36px;
        line-height: 36px;
        background-color: #fff;

        &:hover {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
        }

        &.focusing {
          border-color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
          outline: none;
        }
      }
    }

    .el-pagination__prev,
    .el-pagination__next {
      min-width: 36px;
      width: 36px;
      height: 36px;
      line-height: 36px;
      margin: 0;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      background-color: #fff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      text-align: center;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        transition: left 0.4s ease-in-out;
      }

      // 普通按钮 hover
      &:not(.disabled):hover {
        border-color: #409eff;
        background-color: #f0f7ff;
        color: #409eff;
        transform: translateY(-1px);
        box-shadow: 0 2px 10px rgba(64, 158, 255, 0.25);
        font-weight: 500;
      }

      &:not(.disabled):hover::before {
        left: 100%;
      }

      &:not(.disabled):active {
        transform: translateY(0);
        box-shadow: 0 1px 5px rgba(64, 158, 255, 0.2);
      }

      &.disabled {
        color: #c0c4cc;
        border-color: #ebeef5;
        background-color: #f5f7fa;
        cursor: not-allowed;

        &:hover {
          transform: none;
          box-shadow: none;
          font-weight: 400;
        }
      }
    }

    // ======== 页码按钮部分 ========
    .el-pager {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .el-pager li {
      min-width: 36px;
      height: 36px;
      line-height: 36px;
      margin: 0;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      background-color: #fff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      text-align: center;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        transition: left 0.4s ease-in-out;
      }

      // 普通页码 hover
      &:not(.disabled):not(.more):hover {
        border-color: #409eff;
        background-color: #f0f7ff;
        color: #409eff;
        transform: translateY(-1px);
        box-shadow: 0 2px 10px rgba(64, 158, 255, 0.25);
        font-weight: 500;
      }

      &:not(.disabled):not(.more):hover::before {
        left: 100%;
      }

      &:not(.disabled):not(.more):active {
        transform: translateY(0);
        box-shadow: 0 1px 5px rgba(64, 158, 255, 0.2);
      }

      &.active {
        background-color: #409eff;
        color: #fff;
        border-color: #409eff;
        font-weight: 600;
        transform: none;
        box-shadow: 0 2px 10px rgba(64, 158, 255, 0.35);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 120%;
          height: 120%;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:active::after {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          transition: all 0.15s;
        }

        &:hover {
          background-color: #66b1ff;
          box-shadow: 0 4px 14px rgba(64, 158, 255, 0.45);
        }
      }

      &.disabled {
        color: #c0c4cc;
        border-color: #ebeef5;
        background-color: #f5f7fa;
        cursor: not-allowed;

        &:hover {
          transform: none;
          box-shadow: none;
          font-weight: 400;
        }
      }

      // 省略号按钮
      &.more {
        cursor: pointer;
        min-width: 36px;
        width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: visible;
        z-index: 2;
        white-space: nowrap;
        border: 1px solid #e4e7ed;
        background-color: #fff;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '\2026' !important; 
          font-size: 16px;
          color: #606266;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          transition: color 0.3s;
        }
        
        &:hover {
          border-color: #409eff;
          background-color: #f0f7ff;
          color: #409eff;
          transform: translateY(-1px);
          box-shadow: 0 2px 10px rgba(64, 158, 255, 0.25);
        }
        
        &:hover::before {
          color: #409eff;
        }
        
        &:active {
          transform: translateY(0);
          box-shadow: 0 1px 5px rgba(64, 158, 255, 0.2);
        }
      }
    }
  }
}
</style>