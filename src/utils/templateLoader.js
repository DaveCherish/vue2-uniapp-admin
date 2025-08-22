/**
 * 模板加载器 - 用于加载和管理页面模板
 */

// 导入模板文件
import listHtmlTemplate from '@/templates/list/list.html.tpl';
import listJsTemplate from '@/templates/list/list.js.tpl';
import listScssTemplate from '@/templates/list/list.scss.tpl';

import formHtmlTemplate from '@/templates/form/form.html.tpl';
import formJsTemplate from '@/templates/form/form.js.tpl';
import formScssTemplate from '@/templates/form/form.scss.tpl';

/**
 * 获取列表页模板
 * @returns {object} 包含HTML、JS和SCSS模板的对象
 */
export function getListTemplates() {
  return {
    html: listHtmlTemplate,
    js: listJsTemplate,
    scss: listScssTemplate
  };
}

/**
 * 获取表单页模板
 * @returns {object} 包含HTML、JS和SCSS模板的对象
 */
export function getFormTemplates() {
  return {
    html: formHtmlTemplate,
    js: formJsTemplate,
    scss: formScssTemplate
  };
}

/**
 * 渲染模板
 * @param {string} template - 模板字符串
 * @param {object} data - 模板数据
 * @returns {string} 渲染后的字符串
 */
export function renderTemplate(template, data) {
  // 使用简单的模板替换
  return template.replace(/\${([^{}]+)}/g, (match, key) => {
    // 处理嵌套属性
    const keys = key.trim().split('.');
    let value = data;
    for (const k of keys) {
      if (value === undefined || value === null) break;
      value = value[k];
    }
    return value !== undefined && value !== null ? String(value) : '';
  });
}

/**
 * 生成列表页搜索字段HTML
 * @param {array} searchFields - 搜索字段配置
 * @returns {string} 搜索字段HTML
 */
export function generateSearchFieldsHtml(searchFields) {
  return searchFields
    .map(config => {
      const { field, label, type, options, placeholder } = config;
      if (type === 'select') {
        const selectOptions = options
          ? options.split(',').map(item => {
              const [value, optLabel] = item.split(':');
              return `<el-option label="${optLabel}" value="${value}"></el-option>`;
            }).join('')
          : '<el-option label="选项1" value="1"></el-option><el-option label="选项2" value="2"></el-option>';

        return `
        <el-form-item label="${label}">
          <el-select v-model="searchParams.${field}" placeholder="${placeholder || `请选择${label}`}" filterable clearable>
            ${selectOptions}
          </el-select>
        </el-form-item>`;
      } else if (type === 'date') {
        return `
        <el-form-item label="${label}">
          <el-date-picker
            v-model="searchParams.${field}"
            type="date"
            placeholder="${placeholder || `请选择${label}`}"
            clearable
          ></el-date-picker>
        </el-form-item>`;
      } else if (type === 'datetime') {
        return `
        <el-form-item label="${label}">
          <el-date-picker
            v-model="searchParams.${field}"
            type="datetime"
            placeholder="${placeholder || `请选择${label}`}"
            clearable
          ></el-date-picker>
        </el-form-item>`;
      } else {
        return `
        <el-form-item label="${label}">
          <el-input v-model="searchParams.${field}" placeholder="${placeholder || `请输入${label}`}" clearable></el-input>
        </el-form-item>`;
      }
    })
    .join('');
}

/**
 * 生成列表页表格列HTML
 * @param {array} tableColumns - 表格列配置
 * @returns {string} 表格列HTML
 */
export function generateTableColumnsHtml(tableColumns) {
  return tableColumns
    .map(config => {
      const { field, label, width, fixed, type } = config;
      const widthAttr = width ? `width="${width}"` : '';
      const fixedAttr = fixed ? `fixed="${fixed}"` : '';

      if (type === 'image') {
        return `
        <el-table-column prop="${field}" label="${label}" ${widthAttr} ${fixedAttr}>
          <template slot-scope="scope">
            <el-image :src="scope.row.${field}" style="width: 40px; height: 40px" :preview-src-list="[scope.row.${field}]" />
          </template>
        </el-table-column>`;
      } else if (type === 'datetime') {
        return `
        <el-table-column prop="${field}" label="${label}" ${widthAttr} ${fixedAttr}>
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.${field}) }}</span>
          </template>
        </el-table-column>`;
      } else if (type === 'switch') {
        return `
        <el-table-column prop="${field}" label="${label}" ${widthAttr} ${fixedAttr}>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.${field}" :active-value="1" :inactive-value="0" disabled></el-switch>
          </template>
        </el-table-column>`;
      } else if (type === 'enum') {
        const { options } = config;
        const optionsMap = {};
        if (options) {
          options.split(',').forEach(item => {
            const [value, optLabel] = item.split(':');
            optionsMap[value] = optLabel;
          });
        }

        return `
        <el-table-column prop="${field}" label="${label}" ${widthAttr} ${fixedAttr}>
          <template slot-scope="scope">
            <span>{{ ${JSON.stringify(optionsMap)}[scope.row.${field}] || scope.row.${field} }}</span>
          </template>
        </el-table-column>`;
      } else {
        return `
        <el-table-column prop="${field}" label="${label}" ${widthAttr} ${fixedAttr}></el-table-column>`;
      }
    })
    .join('');
}

/**
 * 生成表单字段HTML
 * @param {array} formFields - 表单字段配置
 * @returns {string} 表单字段HTML
 */
export function generateFormFieldsHtml(formFields) {
  return formFields
    .map(config => {
      const { field, label, type, options, placeholder, required } = config;

      if (type === 'textarea') {
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
        const selectOptions = options
          ? options.split(',').map(item => {
              const [value, optLabel] = item.split(':');
              return `<el-option label="${optLabel}" value="${value}"></el-option>`;
            }).join('')
          : '<el-option label="选项1" value="1"></el-option><el-option label="选项2" value="2"></el-option>';

        return `
        <el-form-item label="${label}" prop="${field}">
          <el-select v-model="formData.${field}" placeholder="${placeholder || `请选择${label}`}" filterable clearable>
            ${selectOptions}
          </el-select>
        </el-form-item>`;
      } else if (type === 'radio') {
        const radioOptions = options
          ? options.split(',').map(item => {
              const [value, optLabel] = item.split(':');
              return `<el-radio label="${value}" border>${optLabel}</el-radio>`;
            }).join('')
          : '<el-radio label="1" border>是</el-radio><el-radio label="0" border>否</el-radio>';

        return `
        <el-form-item label="${label}" prop="${field}">
          <el-radio-group v-model="formData.${field}">
            ${radioOptions}
          </el-radio-group>
        </el-form-item>`;
      } else if (type === 'checkbox') {
        const checkboxOptions = options
          ? options.split(',').map(item => {
              const [value, optLabel] = item.split(':');
              return `<el-checkbox label="${value}" border>${optLabel}</el-checkbox>`;
            }).join('')
          : '<el-checkbox label="1" border>选项1</el-checkbox><el-checkbox label="2" border>选项2</el-checkbox>';

        return `
        <el-form-item label="${label}" prop="${field}">
          <el-checkbox-group v-model="formData.${field}">
            ${checkboxOptions}
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
    })
    .join('');
}

/**
 * 生成表单字段初始化代码
 * @param {array} formFields - 表单字段配置
 * @param {array} tableFields - 表字段信息
 * @returns {string} 表单字段初始化代码
 */
export function generateFormFieldsInit(formFields, tableFields) {
  return formFields
    .map((config, index) => {
      const fieldInfo = tableFields.find(f => f.name === config.field);
      const defaultValue = fieldInfo && fieldInfo.isPrimaryKey ? '' :
        fieldInfo && fieldInfo.type.includes('int') ? '' :
          fieldInfo && fieldInfo.type.includes('tinyint') ? '' :
            config.type === 'checkbox' ? '[]' :
              config.type === 'switch' ? 'false' : "''";
      const isLast = index === formFields.length - 1;
      return `${config.field}: ${defaultValue}${isLast ? '' : ',\n        '}`;
    })
    .join('');
}

/**
 * 生成表单验证规则代码
 * @param {array} formFields - 表单字段配置
 * @returns {string} 表单验证规则代码
 */
export function generateFormRules(formFields) {
  return formFields
    .filter(config => config.required)
    .map((config, index) => {
      const isLast = index === formFields.filter(config => config.required).length - 1;
      return ` ${config.field}: [
          { required: true, message: '请输入${config.label}', trigger: 'blur' }
        ]${isLast ? '' : ',\n        '}`;
    })
    .join('');
}

/**
 * 生成搜索参数初始化代码
 * @param {array} searchFields - 搜索字段配置
 * @returns {string} 搜索参数初始化代码
 */
export function generateSearchParamsInit(searchFields) {
  return searchFields
    .map((config, index) => {
      const isLast = index === searchFields.length - 1;
      return `${config.field}: ''${isLast ? '' : ',\n        '}`;
    })
    .join('');
}

/**
 * 生成处理上传字段的脚本
 * @param {array} formFields - 表单字段配置
 * @returns {string} 处理上传字段的脚本
 */
export function generateHandleUploadFieldsScript(formFields) {
  return `
          // 处理上传文件字段
          const uploadFields = formFields.filter(config => config.type === 'upload');
          uploadFields.forEach(config => {
            const field = config.field;
            const uploadType = config.uploadType || 'single';
            if (uploadType === 'single') {
              this.formData[field] = this.singleImageList.length > 0 ? this.singleImageList[0].url : '';
            } else {
              this.formData[field] = this.multiImageList.map(file => file.url);
            }
          });`;
}

/**
 * 生成初始化上传字段的脚本
 * @param {array} formFields - 表单字段配置
 * @returns {string} 初始化上传字段的脚本
 */
export function generateInitUploadFieldsScript(formFields) {
  const singleUploadFields = formFields.filter(config => config.type === 'upload' && (config.uploadType || 'single') === 'single');
  const multiUploadFields = formFields.filter(config => config.type === 'upload' && config.uploadType === 'multi');

  let script = '';

  if (singleUploadFields.length > 0) {
    script += `
          // 初始化单图上传字段
          ${singleUploadFields.map(config => {
      return `if (this.formData.${config.field}) {
            this.singleImageList = [{
              url: this.formData.${config.field},
              uid: Date.now()
            }];
          }`;
    }).join('\n          ')}`;
  }

  if (multiUploadFields.length > 0) {
    script += `
          // 初始化多图上传字段
          ${multiUploadFields.map(config => {
      return `if (this.formData.${config.field} && Array.isArray(this.formData.${config.field})) {
            this.multiImageList = this.formData.${config.field}.map((url, index) => ({
              url,
              uid: Date.now() + index
            }));
          }`;
    }).join('\n          ')}`;
  }

  return script;
}

/**
 * 检查是否有上传字段
 * @param {array} formFields - 表单字段配置
 * @returns {boolean} 是否有上传字段
 */
export function hasUploadFields(formFields) {
  return formFields.some(config => config.type === 'upload');
}

/**
 * 检查是否有富文本字段
 * @param {array} formFields - 表单字段配置
 * @returns {boolean} 是否有富文本字段
 */
export function hasRichTextFields(formFields) {
  return formFields.some(config => config.type === 'rich-text');
}

/**
 * 检查是否有单图上传字段
 * @param {array} formFields - 表单字段配置
 * @returns {boolean} 是否有单图上传字段
 */
export function hasSingleUploadField(formFields) {
  return formFields.some(config => config.type === 'upload' && (config.uploadType || 'single') === 'single');
}

/**
 * 检查是否有多图上传字段
 * @param {array} formFields - 表单字段配置
 * @returns {boolean} 是否有多图上传字段
 */
export function hasMultiUploadField(formFields) {
  return formFields.some(config => config.type === 'upload' && config.uploadType === 'multi');
}