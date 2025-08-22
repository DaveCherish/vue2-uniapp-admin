<template>
  <div class="code-generator-container">
    <el-card class="code-generator-card">
      <div slot="header" class="clearfix">
        <span>代码自动生成器</span>
      </div>
      
      <el-form ref="form" :model="formData" label-width="120px">
        <!-- 表结构输入 -->
        <el-form-item label="MySQL表结构">
          <el-input
            type="textarea"
            v-model="formData.tableStructure"
            placeholder="请输入MySQL表结构"
            :rows="10"
          ></el-input>
          <div class="tip-text">示例: CREATE TABLE `pu_service` (...) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务表';</div>
        </el-form-item>

        <!-- 生成选项 -->
        <el-form-item>
          <el-button type="primary" @click="parseTableStructure" style="margin-bottom: 20px;">解析表结构</el-button>
        </el-form-item>

        <!-- 生成选项 -->
        <el-form-item label="生成选项">
          <el-checkbox-group v-model="formData.generateOptions">
            <el-checkbox label="list" border>生成列表页</el-checkbox>
            <el-checkbox label="form" border>启用表单功能（在列表页弹框中）</el-checkbox>
            <!-- <el-checkbox label="controller" border>生成控制器</el-checkbox> -->
          </el-checkbox-group>
          <div class="tip-text">注意：勾选"启用表单功能"将在列表页中生成新增/编辑弹框，不再生成独立的表单页面文件</div>
        </el-form-item>

        <!-- 字段名称统一配置 -->
        <el-collapse v-if="tableFields.length > 0">
          <el-collapse-item title="字段名称配置">
            <el-form-item label="">
              <el-table :data="formData.fieldLabels" border>
                <el-table-column prop="field" label="字段名"></el-table-column>
                <el-table-column prop="label" label="显示名称">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.label" placeholder="请输入显示名称"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="type" label="控件类型">
                    <template slot-scope="scope">
                      <el-select v-model="scope.row.type" @change="handleControlTypeChange(scope.row)">
                        <el-option label="输入框" value="input"></el-option>
                        <el-option label="文本域" value="textarea"></el-option>
                        <el-option label="下拉选择" value="select"></el-option>
                        <el-option label="单选框" value="radio"></el-option>
                        <el-option label="复选框" value="checkbox"></el-option>
                        <el-option label="日期选择" value="date"></el-option>
                        <el-option label="单图上传" value="upload-single"></el-option>
                        <el-option label="多图上传" value="upload-multi"></el-option>
                        <el-option label="开关" value="switch"></el-option>
                        <el-option label="富文本" value="rich-text"></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column prop="options" label="选项配置">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.options" placeholder="例如: 1:显示,2:隐藏" v-if="['switch', 'select', 'radio', 'checkbox'].includes(scope.row.type)"></el-input>
                      <span v-else>-</span>
                    </template>
                  </el-table-column>
              </el-table>
              <el-button type="primary" size="small" style="margin-top: 10px" @click="syncFieldLabels">同步到所有配置</el-button>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <!-- 列表页配置 -->
        <el-collapse v-if="formData.generateOptions.includes('list')">
          <el-collapse-item title="列表页配置">
            <el-form-item label="页面名称">
              <el-input v-model="formData.listConfig.pageName" placeholder="例如: service"></el-input>
            </el-form-item>
            <el-form-item label="页面路径">
              <el-input v-model="formData.listConfig.pagePath" placeholder="例如: src/views/service/index.vue"></el-input>
              <div class="tip-text">默认: src/views/去前缀后的表名/index.vue</div>
            </el-form-item>
            <el-form-item label="显示字段">
              <el-checkbox-group v-model="formData.listConfig.displayFields"
                v-if="tableFields.length > 0">
                <el-checkbox v-for="field in tableFields" :key="field.name" :label="field.name" border>
                  {{ getFieldLabel(field.name) }} ({{ field.name }})
                </el-checkbox>
              </el-checkbox-group>
              <div v-else class="no-data-tip">请先输入表结构</div>
            </el-form-item>
            <el-form-item label="搜索字段">
              <el-checkbox-group v-model="formData.listConfig.searchFields"
                v-if="tableFields.length > 0">
                <el-checkbox v-for="field in tableFields" :key="field.name" :label="field.name" border>
                  {{ getFieldLabel(field.name) }} ({{ field.name }})
                </el-checkbox>
              </el-checkbox-group>
              <div v-else class="no-data-tip">请先输入表结构</div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <!-- 表单功能配置 -->
        <el-collapse v-if="formData.generateOptions.includes('form')">
          <el-collapse-item title="表单功能配置（列表页弹框）">
            <el-form-item label="页面名称">
              <el-input v-model="formData.formConfig.pageName" placeholder="例如: service"></el-input>
            </el-form-item>
            <div class="tip-text">注意：表单功能将集成在列表页的新增/编辑弹框中，不会生成独立的form.vue文件</div>
            <el-form-item label="表单字段">
              <div v-if="tableFields.length > 0">
                <el-table :data="formData.formConfig.fieldsConfig" border>
                  <el-table-column prop="field" label="字段名"></el-table-column>
                  <el-table-column prop="label" label="显示名称"></el-table-column>
                  <el-table-column prop="required" label="是否必填">
                    <template slot-scope="scope">
                      <el-switch v-model="scope.row.required"></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column prop="placeholder" label="占位提示">
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.placeholder"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template slot-scope="scope">
                      <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDeleteField(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-else class="no-data-tip">请先输入表结构</div>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="success" @click="generateCode" :loading="loading">生成代码</el-button>
      </div>

      <!-- 代码预览 -->
      <el-collapse v-if="generatedFiles.length > 0">
        <el-collapse-item v-for="(file, index) in generatedFiles" :key="index" :title="file.name">
          <el-button type="text" @click="copyCode(file.content)">复制代码</el-button>
          <el-button type="primary" size="small" @click="generateFile(file.name, file.content)">生成文件</el-button>
          <pre><code :class="'language-' + file.language">{{ file.content }}</code></pre>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { parseMySqlTable } from '@/utils/codeGenerator';
import { generateListPage, generateFormPage } from '@/utils/codeTemplates';

export default {
  name: 'CodeGenerator',
  data() {
    return {
      formData: {
        tableStructure: '',
        generateOptions: ['list', 'form'],
        listConfig: {
          pageName: '',
          pagePath: '',
          displayFields: [],
          searchFields: []
        },
        formConfig: {
          pageName: '',
          pagePath: '',
          fieldsConfig: []
        },
        fieldLabels: []
      },
      tableFields: [],
      generatedFiles: [],
      loading: false
    };
  },
  methods: {
    // 解析表结构
    parseTableStructure() {
      if (!this.formData.tableStructure.trim()) {
        this.$message.error('请输入表结构');
        return;
      }

      try {
        const result = parseMySqlTable(this.formData.tableStructure);
        this.tableFields = result.fields;

        // 自动填充页面名称和路径
        if (result.tableName) {
          // 设置页面名称（优先使用表注释，不存在则使用表名）
          const pageName = result.tableComment || result.tableName;
          this.formData.listConfig.pageName = pageName;
          this.formData.formConfig.pageName = pageName;

          // 去除表名前缀（如pu_）
          const withoutPrefixTableName = result.tableName.replace(/^[a-z]+_/, '');

          // 设置默认页面路径
          this.formData.listConfig.pagePath = `src/views/${withoutPrefixTableName}/index.vue`;
        }

        console.log(result.fields)
        // 初始化字段标签配置
        this.initFieldLabels();
        console.log(this.formData.fieldLabels)

        // 初始化表单字段配置，排除id字段
        this.formData.formConfig.fieldsConfig = result.fields
          .filter(field => field.name !== 'id') // 排除id字段
          .map(field => ({
            field: field.name,
            label: field.comment || field.name,
            type: 'input',
            required: false,
            placeholder: `请输入${field.comment || field.name}`
          }));

        // 自动选择所有字段作为显示和搜索字段
        this.formData.listConfig.displayFields = result.fields.map(field => field.name);
        this.formData.listConfig.searchFields = result.fields
          .filter(field => ['varchar', 'int', 'tinyint'].includes(field.type))
          .map(field => field.name);

        this.$message.success('表结构解析成功');
      } catch (error) {
        this.$message.error(`解析失败: ${error.message}`);
      }
    },

    // 获取字段显示名称
    getFieldLabel(fieldName) {
      const field = this.formData.fieldLabels.find(item => item.field === fieldName);
      return field ? field.label : fieldName;
    },

    // 同步字段标签和控件类型到所有配置
    syncFieldLabels() {
      // 同步到表单配置
      this.formData.formConfig.fieldsConfig.forEach(config => {
        const fieldLabel = this.formData.fieldLabels.find(item => item.field === config.field);
        if (fieldLabel) {
          config.label = fieldLabel.label;
          // 处理上传类型
          if (fieldLabel.type === 'upload-single') {
            config.type = 'upload';
            config.uploadType = 'single';
          } else if (fieldLabel.type === 'upload-multi') {
            config.type = 'upload';
            config.uploadType = 'multi';
          } else {
            config.type = fieldLabel.type || config.type;
          }
          config.placeholder = `请输入${fieldLabel.label}`;
        }
      });

      this.$message.success('字段名称和控件类型已同步到所有配置');
    },

    // 初始化字段标签配置，添加控件类型
    initFieldLabels() {
      this.formData.fieldLabels = this.tableFields
        .filter(field => field.name !== 'id') // 排除id字段
        .map(field => ({
          field: field.name,
          label: field.comment || field.name,
          type: 'input',
          options: ''
        }));
    },

    // 处理控件类型变化
    handleControlTypeChange(row) {
      // 如果切换到开关、下拉选择、单选框或复选框类型，尝试从字段注释中提取选项
      if (['switch', 'select', 'radio', 'checkbox'].includes(row.type)) {
        const fieldInfo = this.tableFields.find(f => f.name === row.field);
        if (fieldInfo && fieldInfo.comment) {
          // 检查注释中是否包含选项格式（如：1：显示,2：隐藏）
          if (fieldInfo.comment.includes('：') && fieldInfo.comment.includes('，')) {
            // 将注释格式转换为选项格式：1:显示,2:隐藏
            row.options = fieldInfo.comment.split('，')
              .map(item => {
                const [value, label] = item.split('：');
                return `${value}:${label}`;
              })
              .join(',');
          }
        }
      } else {
        // 其他类型清空选项
        row.options = '';
      }
    },

    // 删除表单字段
    handleDeleteField(index) {
      // 从表单配置中删除字段
      this.formData.formConfig.fieldsConfig.splice(index, 1);
      this.$message.success('字段删除成功');
    },


    // 生成代码
    generateCode() {
      if (this.tableFields.length === 0) {
        this.$message.error('请先解析表结构');
        return;
      }

      this.loading = true;
      this.generatedFiles = [];

      try {
        // 生成列表页
        if (this.formData.generateOptions.includes('list')) {
          // 提取页面模块名（从路径中获取）
          const moduleName = this.formData.listConfig.pagePath.split('/')[2];
          
          // 使用字段标签配置中的控件类型信息，并处理上传类型
          const mergedFieldsConfig = this.formData.fieldLabels.map(label => {
            if (label.type === 'upload-single') {
              return { ...label, type: 'upload', uploadType: 'single' };
            } else if (label.type === 'upload-multi') {
              return { ...label, type: 'upload', uploadType: 'multi' };
            } else {
              return label;
            }
          });

          // 用于表单功能的字段配置
          const formFieldsConfig = this.formData.generateOptions.includes('form') 
            ? this.formData.formConfig.fieldsConfig 
            : [];

          const listCode = generateListPage({
            pageName: this.formData.listConfig.pageName,
            moduleName: moduleName,
            tableFields: this.tableFields,
            displayFields: this.formData.listConfig.displayFields,
            searchFields: this.formData.listConfig.searchFields,
            fieldsConfig: mergedFieldsConfig,
            formFieldsConfig: formFieldsConfig,
            enableFormFeature: this.formData.generateOptions.includes('form')
          });
          this.generatedFiles.push({
            name: this.formData.listConfig.pagePath,
            content: listCode,
            language: 'vue'
          });
        }

        // 不再生成独立的表单页文件
        // 表单功能已集成在列表页中

        this.$message.success('代码生成成功');
      } catch (error) {
        this.$message.error(`生成失败: ${error.message}`);
      } finally {
        this.loading = false;
      }
    },

    // 复制代码
    copyCode(content) {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.$message.success('代码已复制到剪贴板');
    },

    // 生成文件
    generateFile(filePath, content) {
      try {
        // 检查文件路径是否有效
        if (!filePath || typeof filePath !== 'string') {
          throw new Error('无效的文件路径');
        }

        this.loading = true;

        // 调用后端服务写入文件
        fetch('http://localhost:3000/api/write-file', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filePath: filePath,
            content: content
          })
        })
        .then(response => response.json())
        .then(data => {
          this.loading = false;
          if (data.success) {
            this.$message.success(data.message);
          } else {
            this.$message.error(data.message);
          }
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(`生成文件失败: ${error.message}`);
        });
      } catch (error) {
        this.loading = false;
        this.$message.error(`生成文件失败: ${error.message}`);
      }
    }
  }
};
</script>

<style lang="scss">
.code-generator-container {
  padding: 20px;
}

.code-generator-card {
  width: 100%;
}

.tip-text {
  color: #909399;
  font-size: 12px;
  margin-top: 5px;
}

.no-data-tip {
  color: #909399;
  padding: 10px;
  text-align: center;
}

.action-buttons {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

pre {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.5;
}
</style>