<template>
  <div class="image-preview-component">
    <!-- 预览弹窗 -->
    <el-dialog :visible.sync="previewVisible" width="50%" :before-close="handleClosePreview" center title="图片预览"
      class="preview-dialog" :modal-append-to-body="false" :append-to-body="true">
      <!-- 操作提示 - 放在标题下面 -->
      <div v-if="previewImages.length > 1" class="title-tips">
        <span>← → 切换图片 | ESC 关闭</span>
      </div>
      <div class="preview-container">
        <el-carousel v-if="previewImages.length > 1" height="400px" :initial-index="previewIndex"
          indicator-position="outside" arrow="always" :autoplay="false" class="preview-carousel"
          @change="handleCarouselChange" ref="carousel">
          <el-carousel-item v-for="(img, index) in previewImages" :key="index">
            <div class="carousel-item">
              <img :src="img" alt="预览图" class="preview-image" />
            </div>
          </el-carousel-item>
        </el-carousel>

        <!-- 单张图片显示 -->
        <div v-else-if="previewImages.length === 1" class="single-preview">
          <img :src="previewImages[0]" alt="预览图" class="preview-image" />
        </div>

        <!-- 预览信息 -->
        <div class="preview-info">
          <span>{{ previewIndex + 1 }} / {{ previewImages.length }}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImagePreview',
  data() {
    return {
      previewVisible: false,
      previewImages: [],
      previewIndex: 0
    }
  },
  mounted() {
    // 添加键盘事件监听
    document.addEventListener('keydown', this.handleKeydown)
  },
  beforeDestroy() {
    // 移除键盘事件监听
    document.removeEventListener('keydown', this.handleKeydown)
  },
  methods: {
    /**
     * 打开预览
     * @param {Array} images - 预览图片数组
     * @param {Number} index - 初始索引
     */
    openPreview(images, index = 0) {
      this.previewImages = images
      this.previewIndex = index
      this.previewVisible = true
    },

    /**
     * 关闭预览
     */
    handleClosePreview() {
      this.previewVisible = false
      this.previewImages = []
      this.previewIndex = 0
    },

    /**
     * 键盘事件处理
     */
    handleKeydown(event) {
      if (!this.previewVisible || this.previewImages.length <= 1) return

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          this.previousImage()
          break
        case 'ArrowRight':
          event.preventDefault()
          this.nextImage()
          break
        case 'Escape':
          event.preventDefault()
          this.handleClosePreview()
          break
      }
    },

    /**
     * 上一张图片
     */
    previousImage() {
      if (this.previewIndex > 0) {
        this.previewIndex--
      } else {
        this.previewIndex = this.previewImages.length - 1
      }
      // 同步轮播组件的当前索引
      this.$nextTick(() => {
        if (this.$refs.carousel) {
          this.$refs.carousel.setActiveItem(this.previewIndex)
        }
      })
    },

    /**
     * 下一张图片
     */
    nextImage() {
      if (this.previewIndex < this.previewImages.length - 1) {
        this.previewIndex++
      } else {
        this.previewIndex = 0
      }
      // 同步轮播组件的当前索引
      this.$nextTick(() => {
        if (this.$refs.carousel) {
          this.$refs.carousel.setActiveItem(this.previewIndex)
        }
      })
    },

    /**
     * 轮播切换事件
     */
    handleCarouselChange(index) {
      this.previewIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
/* 预览弹窗样式 */
.preview-dialog {
  .el-dialog {
    margin: 0 auto !important;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 50vw;
    max-height: 50vh;

    .el-dialog__body {
      padding: 0;
      max-height: calc(50vh - 120px);
      overflow: hidden;
    }

    .el-dialog__header {
      padding: 15px 20px;
      border-bottom: 1px solid #e4e7ed;

      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}

/* 预览容器样式 */
.preview-container {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;

  .preview-info {
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    z-index: 10;
  }
}

.carousel-item, .single-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #000;

  .preview-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 4px;
  }
}

.title-tips {
  text-align: center;
  background: rgba(64, 158, 255, 0.1);
  color: #409eff;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 15px;
  border: 1px solid rgba(64, 158, 255, 0.2);
  animation: fadeInDown 0.3s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 轮播相关样式 */
.preview-carousel {
  width: 100%;
  position: relative;

  .el-carousel__container {
    height: 400px;
  }

  .el-carousel__arrow {
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    color: white;
    font-size: 18px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    &:hover {
      background-color: rgba(0, 0, 0, 0.8);
      transform: translateY(-50%) scale(1.1);
    }

    &--left {
      left: 20px;
    }

    &--right {
      right: 20px;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-dialog {
    .el-dialog {
      width: 90% !important;
      max-width: 90vw;
      max-height: 80vh;
    }
  }

  .preview-carousel, .single-preview {
    height: 300px;

    .preview-carousel .el-carousel__container {
      height: 300px;
    }
  }
}
</style>