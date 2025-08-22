/**
 * 生成列表页代码
 * @param {object} options - 配置选项
 * @param {string} options.pageName - 页面名称
 * @param {string} options.moduleName - 页面模块名称，用于控制路径，默认去除表名前缀
 * @param {array} options.tableFields - 表字段信息
 * @param {array} options.displayFields - 要显示的字段
 * @param {array} options.searchFields - 搜索字段
 * @returns {string} 生成的列表页代码
 */
export function generateListPage(options) {
  const { pageName, moduleName = pageName.replace(/^[a-z]+_/, ''), tableFields, displayFields, searchFields, fieldsConfig } = options;

  // 首字母大写
  const capitalizedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // 找出主键字段
  const primaryKeyField = tableFields.find(field => field.isPrimaryKey) || tableFields[0];

  return `<template>
  <div class="list-page">
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>${pageName}列表</span>
        <el-button
          style="float: right;"
          type="primary"
          @click="handleAdd"
        >
          新增
        </el-button>
      </div>

      ${searchFields.length > 0 ? `
      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        ${searchFields.map(field => {
    // 查找字段配置信息
    const fieldConfig = fieldsConfig.find(f => f.field === field) || {};
    const label = fieldConfig.label || field;
    // 查找原始字段信息用于特殊处理
    const originalFieldInfo = tableFields.find(f => f.name === field) || {};

    // 根据字段类型生成不同的搜索控件
    const fieldType = fieldConfig.type || '';

    if (fieldType === 'switch' || fieldType === 'select' || fieldType === 'radio' || fieldType === 'checkbox') {
      // 处理开关、下拉选择、单选框、复选框类型的搜索字段，生成下拉选择框
      const options = (fieldConfig.options || '1：选项1,2：选项2')
        .split(/,|，/)
        .map(item => {
          const [value, optionLabel] = item.split(/:|：/);
          return { value: value && value.trim(), label: optionLabel && optionLabel.trim() };
        })
        .filter(opt => opt.value && opt.label);
      return `
        <el-form-item label="${label}">
          <el-select v-model="searchForm.${field}" placeholder="请选择${label}" clearable>
            <el-option v-for="item in [${options.map(opt => `{ value: '${opt.value}', label: '${opt.label}' }`).join(', ')}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>`;
    } else if (fieldType === 'date') {
      return `
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
          ></el-date-picker>
        </el-form-item>`;
    } else {
      return `
        <el-form-item label="${label}">
          <el-input v-model="searchForm.${field}" placeholder="请输入${label}" clearable></el-input>
        </el-form-item>`;
    }
  }).join('')}
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      ` : ''}

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
        ${displayFields.map(field => {
    // 查找字段配置信息
    const fieldConfig = fieldsConfig.find(f => f.field === field) || {};
    const label = fieldConfig.label || field;
    const type = fieldConfig.type || 'input';

    // 查找原始字段信息用于特殊处理
    const originalFieldInfo = tableFields.find(f => f.name === field);

          console.log('------>', fieldsConfig);
          

    // 富文本字段不显示在列表中
    if (type === 'rich-text') {
      return '';
    }

    // 优先根据控件类型处理
    if (type === 'switch') {
      return `
        <el-table-column prop="${field}" label="${label}" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.${field}" :active-value="1" :inactive-value="0" disabled></el-switch>
          </template>
        </el-table-column>`;
    } else if (type === 'image' || type === 'upload-single' || type === 'upload-multi') {
      return `
        <el-table-column prop="${field}" label="${label}" width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.${field}">
              <img v-if="!Array.isArray(scope.row.${field})" :src="scope.row.${field}" alt="${label}" class="list-image">
              <div v-else class="image-grid">
                <img v-for="(img, index) in scope.row.${field}" :key="index" :src="img" alt="${label} ${index + 1}" class="list-image">
              </div>
            </div>
            <span v-else>无图片</span>
          </template>
        </el-table-column>`;
    } else {
      return `
        <el-table-column prop="${field}" label="${label}"></el-table-column>`;
    }
  }).join('')}
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row.${primaryKeyField.name})")>删除</el-button>
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
        ${fieldsConfig.map(config => {
          const { field, label, type, required, placeholder, options } = config;
          const fieldInfo = tableFields.find(f => f.name === field);
          const isPrimary = fieldInfo && fieldInfo.isPrimaryKey;

          if (isPrimary) {
            return `
        <el-form-item prop="${field}" style="display: none;">
          <el-input v-model="formData.${field}"></el-input>
        </el-form-item>`;
          } else if (type === 'input') {
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-input v-model="formData.${field}" placeholder="${placeholder || `请输入${label}`}" clearable></el-input>
        </el-form-item>`;
          } else if (type === 'textarea') {
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-input
            type="textarea"
            v-model="formData.${field}"
            placeholder="${placeholder || `请输入${label}`}"
            :rows="4"
          ></el-input>
        </el-form-item>`;
          } else if (type === 'select') {
            // 解析选项配置字符串为数组
            let selectOptions = [];
            if (options && typeof options === 'string') {
              selectOptions = options.split(',').map(item => {
                const [value, label] = item.split(':');
                return { value, label };
              });
            } else {
              selectOptions = options || [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }];
            }
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-select v-model="formData.${field}" placeholder="${placeholder || `请选择${label}`}" filterable clearable>
            ${selectOptions.map(opt => `<el-option label="${opt.label}" value="${opt.value}"></el-option>`).join('')}
          </el-select>
        </el-form-item>`;
          } else if (type === 'radio') {
            // 解析选项配置字符串为数组
            let radioOptions = [];
            if (options && typeof options === 'string') {
              radioOptions = options.split(',').map(item => {
                const [value, label] = item.split(':');
                return { value, label };
              });
            } else {
              radioOptions = options || [{ label: '是', value: '1' }, { label: '否', value: '0' }];
            }
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-radio-group v-model="formData.${field}">
            ${radioOptions.map(opt => `<el-radio label="${opt.value}" border>${opt.label}</el-radio>`).join('')}
          </el-radio-group>
        </el-form-item>`;
          } else if (type === 'checkbox') {
            // 解析选项配置字符串为数组
            let checkboxOptions = [];
            if (options && typeof options === 'string') {
              checkboxOptions = options.split(',').map(item => {
                const [value, label] = item.split(':');
                return { value, label };
              });
            } else {
              checkboxOptions = options || [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }];
            }
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-checkbox-group v-model="formData.${field}">
            ${checkboxOptions.map(opt => `<el-checkbox label="${opt.value}" border>${opt.label}</el-checkbox>`).join('')}
          </el-checkbox-group>
        </el-form-item>`;
          } else if (type === 'date') {
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-date-picker
            v-model="formData.${field}"
            type="date"
            placeholder="${placeholder || `请选择${label}`}"
            clearable
          ></el-date-picker>
        </el-form-item>`;
          } else if (type === 'datetime') {
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-date-picker
            v-model="formData.${field}"
            type="datetime"
            placeholder="${placeholder || `请选择${label}`}"
            clearable
          ></el-date-picker>
        </el-form-item>`;
          } else if (type === 'switch') {
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-switch v-model="formData.${field}" ${required ? ':active-value="1" :inactive-value="0"' : ''}></el-switch>
        </el-form-item>`;
          } else if (type === 'upload') {
            const uploadType = config.uploadType || 'single';
            return `
        <el-form-item label="${label}">
          <el-upload class="upload-demo" action="" :limit="${uploadType === 'single' ? '1' : '10'}" :file-list="${uploadType === 'single' ? 'singleImageList' : 'multiImageList'}" :on-remove="handleRemove${uploadType === 'single' ? 'Single' : 'Multi'}"
            :on-change="handle${uploadType === 'single' ? 'Single' : 'Multi'}Change" :on-preview="(file) => handlePreview(file, '${uploadType}')" ${uploadType === 'single' ? '' : 'multiple'} list-type="picture-card"
            :auto-upload="false" accept="image/*">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>`;
          } else if (type === 'rich-text') {
            return `
        <el-form-item label="${label}" prop="${field}">
          <ckeditor :editor="formData.editor" v-model="formData.${field}" />
        </el-form-item>`;
          } else {
            return `
        <el-form-item label="${label}" prop="${field}">
          <el-input v-model="formData.${field}" placeholder="${placeholder || `请输入${label}`}" clearable></el-input>
        </el-form-item>`;
          }
        }).join('')}
      </el-form>
      
      ${fieldsConfig.some(config => config.type === 'upload') ? '<!-- 图片预览组件 -->\n      <image-preview ref="imagePreview"></image-preview>' : ''}
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
${fieldsConfig.some(config => config.type === 'upload') ? "import ImagePreview from '@/components/ImagePreview.vue'" : ''}
${fieldsConfig.some(config => config.type === 'rich-text') ? "import CKEditor from '@ckeditor/ckeditor5-vue2'\nimport ClassicEditor from '@ckeditor/ckeditor5-build-classic'" : ''}

export default {
  components: {
    Pagination${fieldsConfig.some(config => config.type === 'upload') ? ', ImagePreview' : ''}${fieldsConfig.some(config => config.type === 'rich-text') ? ', ckeditor: CKEditor.component' : ''}
  },
  data() {
      return {
        ${searchFields.length > 0 ? `
        searchForm: {
          ${searchFields.map(field => `${field}: ''`).join(', ')}
        },` : ''}
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
          ${primaryKeyField.name}: '',
          ${fieldsConfig.map(config => {
            const fieldInfo = tableFields.find(f => f.name === config.field);
            const defaultValue = fieldInfo && fieldInfo.isPrimaryKey ? '' :
              fieldInfo && fieldInfo.type.includes('int') ? '' :
                fieldInfo && fieldInfo.type.includes('tinyint') ? '' :
                  config.type === 'checkbox' ? [] :
                    config.type === 'switch' ? false : '';
            return `${config.field}: ${JSON.stringify(defaultValue)}`;
          }).join(',\n          ')}
          ${fieldsConfig.some(config => config.type === 'rich-text') ? ',\n          editor: ClassicEditor' : ''}
        },
        formRules: {
          ${fieldsConfig
            .filter(config => config.required)
            .map(config => `${config.field}: [
            { required: true, message: '请输入${config.label}', trigger: 'blur' }
          ]`)
            .join(',\n          ')}
        }
        ${fieldsConfig.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single') ? ',\n        singleImageList: []' : ''}
        ${fieldsConfig.some(config => config.type === 'upload' && config.uploadType === 'multi') ? ',\n        multiImageList: []' : ''}
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
          ${searchFields.length > 0 ? `...this.searchForm` : ''}
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

      ${searchFields.length > 0 ? `// 搜索
      handleSearch() {
        this.pagination.currentPage = 1;
        this.loadList();
      },

      // 重置搜索
      resetSearch() {
        this.searchForm = {
          ${searchFields.map(field => `${field}: ''`).join(', ')}
        };
        this.pagination.currentPage = 1;
        this.loadList();
      },` : ''}

    // 分页处理
    handlePagination(data) {
      this.pagination.currentPage = data.page;
      this.pagination.pageSize = data.limit;
      this.loadList();
    },

    // 新增
    handleAdd() {
      this.formTitle = '新增${pageName}';
      this.isEdit = false;
      this.resetForm();
      this.dialogVisible = true;
    },

    // 编辑
    handleEdit(row) {
      this.formTitle = '编辑${pageName}';
      this.isEdit = true;
      // 赋值表单数据
      this.formData = {
        ${fieldsConfig.map(config => {
          const fieldInfo = tableFields.find(f => f.name === config.field);
          if (fieldInfo && fieldInfo.isPrimaryKey) {
            return `${config.field}: row.${config.field}`;
          } else {
            return `${config.field}: row.${config.field} || ${config.type === 'checkbox' ? '[]' : config.type === 'switch' ? 'false' : "''"}`;
          }
        }).join(',\n        ')}
        ${fieldsConfig.some(config => config.type === 'rich-text') ? ',\n        editor: ClassicEditor' : ''}
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
          
          ${fieldsConfig.some(config => config.type === 'upload') ? `
          // 处理上传文件
          ${fieldsConfig.filter(config => config.type === 'upload').map(config => {
            const uploadType = config.uploadType || 'single';
            return `
          if (this.${uploadType}ImageList.length > 0) {
            this.formData.${config.field} = ${uploadType === 'single' ? 'this.singleImageList[0].url' : 'this.multiImageList.map(file => file.url)'};
          }`;
          }).join('')}
          ` : ''}
          
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
        ${primaryKeyField.name}: '',
        ${fieldsConfig.map(config => {
          const fieldInfo = tableFields.find(f => f.name === config.field);
          const defaultValue = fieldInfo && fieldInfo.isPrimaryKey ? '' :
            fieldInfo && fieldInfo.type.includes('int') ? '' :
              fieldInfo && fieldInfo.type.includes('tinyint') ? '' :
                config.type === 'checkbox' ? [] :
                  config.type === 'switch' ? false : '';
          return `${config.field}: ${JSON.stringify(defaultValue)}`;
        }).join(',\n        ')}
        ${fieldsConfig.some(config => config.type === 'rich-text') ? ',\n        editor: ClassicEditor' : ''}
      };
      ${fieldsConfig.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single') ? 'this.singleImageList = [];' : ''}
      ${fieldsConfig.some(config => config.type === 'upload' && config.uploadType === 'multi') ? 'this.multiImageList = [];' : ''}
      // 清除验证
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate();
        }
      });
    }

${fieldsConfig.some(config => config.type === 'upload') ? `    // 预览图片
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
    },` : ''}

    ${fieldsConfig.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single') ? `
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
    ` : ''}

    ${fieldsConfig.some(config => config.type === 'upload' && config.uploadType === 'multi') ? `
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
    ` : ''}
  }
};
</script>

<style lang="scss">
@import '@/assets/styles/search-form.scss';
@import '@/assets/styles/table.scss';
</style>`;
}

/**
 * 生成表单页代码
 * @param {object} options - 配置选项
 * @param {string} options.pageName - 页面名称
 * @param {string} options.moduleName - 页面模块名称，用于控制路径，默认去除表名前缀
 * @param {array} options.tableFields - 表字段信息
 * @param {array} options.fieldsConfig - 字段配置信息
 * @returns {string} 生成的表单页代码
 */
export function generateFormPage(options) {
  const { pageName, moduleName = pageName.replace(/^[a-z]+_/, ''), tableFields, fieldsConfig } = options;

  // 首字母大写
  const capitalizedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // 找出主键字段
  const primaryKeyField = tableFields.find(field => field.isPrimaryKey) || tableFields[0];

  return `<template>
  <div class="form-page">
    <h2 class="form-title">{{ isEdit ? '编辑${pageName}' : '新增${pageName}' }}</h2>
    <el-form ref="form" :model="formData" label-width="120px" class="form-container" :rules="rules">
        ${fieldsConfig.map(config => {
    const { field, label, type, required, placeholder, options } = config;
    const fieldInfo = tableFields.find(f => f.name === field);
    const isPrimary = fieldInfo && fieldInfo.isPrimaryKey;


    if (isPrimary) {
      return `
        <el-form-item prop="${field}" style="display: none;">
          <el-input v-model="formData.${field}"></el-input>
        </el-form-item>`;
    } else if (type === 'input') {
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-input v-model="formData.${field}" placeholder="${placeholder || `请输入${label}`}" clearable></el-input>
        </el-form-item>`;
    } else if (type === 'textarea') {
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-input
            type="textarea"
            v-model="formData.${field}"
            placeholder="${placeholder || `请输入${label}`}"
            :rows="4"
          ></el-input>
        </el-form-item>`;
    } else if (type === 'select') {
      // 解析选项配置字符串为数组
      let selectOptions = [];
      if (options && typeof options === 'string') {
        selectOptions = options.split(',').map(item => {
          const [value, label] = item.split(':');
          return { value, label };
        });
      } else {
        selectOptions = options || [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }];
      }
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-select v-model="formData.${field}" placeholder="${placeholder || `请选择${label}`}" filterable clearable>
            ${selectOptions.map(opt => `<el-option label="${opt.label}" value="${opt.value}"></el-option>`).join('')}
          </el-select>
        </el-form-item>`;
    } else if (type === 'radio') {
      // 解析选项配置字符串为数组
      let radioOptions = [];
      if (options && typeof options === 'string') {
        radioOptions = options.split(',').map(item => {
          const [value, label] = item.split(':');
          return { value, label };
        });
      } else {
        radioOptions = options || [{ label: '是', value: '1' }, { label: '否', value: '0' }];
      }
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-radio-group v-model="formData.${field}">
            ${radioOptions.map(opt => `<el-radio label="${opt.value}" border>${opt.label}</el-radio>`).join('')}
          </el-radio-group>
        </el-form-item>`;
    } else if (type === 'checkbox') {
      // 解析选项配置字符串为数组
      let checkboxOptions = [];
      if (options && typeof options === 'string') {
        checkboxOptions = options.split(',').map(item => {
          const [value, label] = item.split(':');
          return { value, label };
        });
      } else {
        checkboxOptions = options || [{ label: '选项1', value: '1' }, { label: '选项2', value: '2' }];
      }
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-checkbox-group v-model="formData.${field}">
            ${checkboxOptions.map(opt => `<el-checkbox label="${opt.value}" border>${opt.label}</el-checkbox>`).join('')}
          </el-checkbox-group>
        </el-form-item>`;
    } else if (type === 'date') {
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-date-picker
            v-model="formData.${field}"
            type="date"
            placeholder="${placeholder || `请选择${label}`}"
            clearable
          ></el-date-picker>
        </el-form-item>`;
    } else if (type === 'datetime') {
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-date-picker
            v-model="formData.${field}"
            type="datetime"
            placeholder="${placeholder || `请选择${label}`}"
            clearable
          ></el-date-picker>
        </el-form-item>`;
    } else if (type === 'upload') {
      const uploadType = config.uploadType || 'single'; // single or multi
      return `
        <el-form-item label="${label}">
          <el-upload class="upload-demo" action="" :limit="${uploadType === 'single' ? '1' : '10'}" :file-list="${uploadType === 'single' ? 'singleImageList' : 'multiImageList'}" :on-remove="handleRemove${uploadType === 'single' ? 'Single' : 'Multi'}"
            :on-change="handle${uploadType === 'single' ? 'Single' : 'Multi'}Change" :on-preview="(file) => handlePreview(file, '${uploadType}')" ${uploadType === 'single' ? '' : 'multiple'} list-type="picture-card"
            :auto-upload="false" accept="image/*">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>`;
    } else if (type === 'switch') {
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-switch v-model="formData.${field}" ${required ? ':active-value="1" :inactive-value="0"' : ''}></el-switch>
        </el-form-item>`;
    } else if (type === 'rich-text') {
      return `
        <el-form-item label="${label}" prop="${field}">
          <ckeditor :editor="formData.editor" v-model="formData.${field}" />
        </el-form-item>`;
    } else {
      return `
        <el-form-item label="${label}" prop="${field}">
          <el-input v-model="formData.${field}" placeholder="${placeholder || `请输入${label}`}" clearable></el-input>
        </el-form-item>`;
    }
  }).join('')}

        <el-form-item label="ID" prop="id" v-show="false">
          <el-input v-model="formData.id" clearable></el-input>
        </el-form-item>

        ${fieldsConfig.some(config => config.type === 'upload') ? '<!-- 图片预览组件 -->\n        <image-preview ref="imagePreview"></image-preview>' : ''}

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
${fieldsConfig.some(config => config.type === 'upload') ? "import ImagePreview from '@/components/ImagePreview.vue'" : ''}
${fieldsConfig.some(config => config.type === 'rich-text') ? "import CKEditor from '@ckeditor/ckeditor5-vue2'\nimport ClassicEditor from '@ckeditor/ckeditor5-build-classic'" : ''}

export default {  
  components: { ${fieldsConfig.some(config => config.type === 'upload') ? 'ImagePreview' : ''}${fieldsConfig.some(config => config.type === 'upload') && fieldsConfig.some(config => config.type === 'rich-text') ? ', ' : ''}${fieldsConfig.some(config => config.type === 'rich-text') ? 'ckeditor: CKEditor.component' : ''} },
  data() {
    return {
      formData: {
        id: 0,
        ${fieldsConfig.map((config, index) => {
    const fieldInfo = tableFields.find(f => f.name === config.field);
    const defaultValue = fieldInfo && fieldInfo.isPrimaryKey ? '' :
      fieldInfo && fieldInfo.type.includes('int') ? '' :
        fieldInfo && fieldInfo.type.includes('tinyint') ? '' :
          config.type === 'checkbox' ? [] :
            config.type === 'switch' ? false : '';
    const isLast = index === fieldsConfig.length - 1;
    return `${config.field}: ${JSON.stringify(defaultValue)}${isLast ? ',' : ',\n        '}`;
  }).join('')}
        ${fieldsConfig.some(config => config.type === 'rich-text') ? 'editor: ClassicEditor' : ''}
      },
      ${fieldsConfig.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single') ? 'singleImageList: [],' : ''}
      ${fieldsConfig.some(config => config.type === 'upload' && config.uploadType === 'multi') ? 'multiImageList: [],' : ''}

      rules: {
        ${fieldsConfig
      .filter(config => config.required)
      .map(config => ` ${config.field}: [
          { required: true, message: '请输入${config.label}', trigger: 'blur' }
        ]`)
      .join(',\n        ')}
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
      // 模拟API调用
      setTimeout(() => {
        // 这里应该是实际的API请求，获取数据后赋值给formData
        // this.formData = response.data;
      }, 1000);
    },

    // 提交表单
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 处理上传文件
          ${fieldsConfig.some(config => config.type === 'upload') ? `
          // 处理上传文件字段
          const uploadFields = fieldsConfig.filter(config => config.type === 'upload');
          uploadFields.forEach(config => {
            const field = config.field;
            const uploadType = config.uploadType || 'single';
            if (uploadType === 'single') {
              this.formData[field] = this.singleImageList.length > 0 ? this.singleImageList[0].url : '';
            } else {
              this.formData[field] = this.multiImageList.map(file => file.url);
            }
          });
          ` : ''}

          // 模拟API调用
          setTimeout(() => {
            this.$message({ type: 'success', message: this.isEdit ? '编辑成功' : '新增成功' });
            this.$router.go(-1);
          }, 500);
        } else {
          return false;
        }
      });
    },

    // 重置表单
    resetForm() {
      this.$refs.form.resetFields();
      ${fieldsConfig.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single') ? 'this.singleImageList = [];' : ''}
      ${fieldsConfig.some(config => config.type === 'upload' && config.uploadType === 'multi') ? 'this.multiImageList = [];' : ''}
    },

${fieldsConfig.some(config => config.type === 'upload') ? '    // 预览图片\n    handlePreview(file, type) {\n      // 获取当前文件在列表中的索引\n      let currentIndex = 0;\n      let allImages = [];\n\n      // 根据类型加载对应图片列表\n      if (type === \'single\') {\n        allImages = this.singleImageList;\n        currentIndex = allImages.findIndex(f => f.uid === file.uid);\n      } else if (type === \'multi\') {\n        allImages = this.multiImageList;\n        currentIndex = allImages.findIndex(f => f.uid === file.uid);\n      }\n\n      // 调用预览组件\n      const imageUrls = allImages.map(f => f.url || URL.createObjectURL(f.raw));\n      this.$refs.imagePreview.openPreview(imageUrls, currentIndex);\n    },' : ''}

    ${fieldsConfig.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single') ? `
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
    ` : ''}

    ${fieldsConfig.some(config => config.type === 'upload' && config.uploadType === 'multi') ? `
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
    ` : ''}
  }
};
</script>

<style lang="scss">
/* 引入外部样式文件 */
@import '@/assets/styles/form.scss';
</style>`;
}