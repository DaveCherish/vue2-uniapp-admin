# 项目运行指南

## 项目概述
这是一个基于Vue 2和uni-app开发的管理后台系统，包含了常见的管理后台功能如表单、列表、登录等。

## 技术栈
- **框架**：Vue 2.6.14
- **UI库**：Element UI 2.15.14
- **构建工具**：Vue CLI 4.5.19
- **路由**：Vue Router 3.5.4
- **状态管理**：Vuex 3.6.2
- **HTTP客户端**：Axios 0.27.2
- **编辑器**：CKEditor 5、Quill
- **图表**：ECharts 4.9.0
- **拖拽**：vuedraggable 2.24.3

## 运行环境要求
- **Node.js**：建议使用LTS版本（项目在Node.js v24.4.1上测试通过）
- **npm**：通常随Node.js一起安装
- **操作系统**：Windows、macOS或Linux

## 项目依赖
### 生产依赖
- `@ckeditor/ckeditor5-build-classic`: ^41.4.2
- `@ckeditor/ckeditor5-vue2`: ^3.0.1
- `axios`: ^0.27.2
- `body-parser`: ^2.2.0
- `cors`: ^2.8.5
- `echarts`: ^4.9.0
- `element-ui`: ^2.15.14
- `express`: ^5.1.0
- `quill`: ^1.3.7
- `vue`: ^2.6.14
- `vue-echarts`: ^4.1.0
- `vue-quill-editor`: ^3.0.6
- `vue-router`: ^3.5.4
- `vuedraggable`: ^2.24.3
- `vuex`: ^3.6.2

### 开发依赖
- `@vue/cli-service`: ~4.5.19
- `babel-plugin-component`: ^1.1.1
- `sass`: ^1.32.8
- `sass-loader`: ^8.0.2
- `vue-template-compiler`: ^2.6.14

## 在新电脑上运行项目

### 1. 安装Node.js和npm
1. 访问 [Node.js官网](https://nodejs.org/) 下载并安装LTS版本
2. 验证安装：
   ```bash
   node -v
   npm -v
   ```

### 2. 克隆项目
```bash
# 假设使用Git管理
git clone <项目仓库地址>
cd vue2-uniapp-admin
```

### 3. 安装依赖
```bash
# 使用npm安装依赖
npm install --legacy-peer-deps

# 如果遇到fsevents相关错误（特别是在macOS上），可以尝试以下命令
npm install --legacy-peer-deps --ignore-scripts
```

### 4. 启动开发服务器
```bash
npm run serve
```
成功启动后，会显示以下信息：
```
App running at:
- Local:   http://localhost:8080/
- Network: http://xxx.xxx.xxx.xxx:8080/
```
在浏览器中访问上述地址即可查看项目。

### 5. 构建生产版本
```bash
npm run build
```
构建完成后，会在`dist`目录下生成生产环境的文件。

## 可能遇到的问题和解决方案

### 1. fsevents.watch is not a function
这是由于fsevents包版本与Node.js版本不兼容导致的。
**解决方案**：
```bash
# 清除npm缓存
npm cache clean --force

# 删除node_modules和package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install --legacy-peer-deps
```

### 2. Sass @import rules are deprecated
这是由于Sass版本更新导致的警告，但不影响项目运行。
**解决方案**：可以忽略此警告，或者升级项目中的Sass使用方式。

### 3. 其他依赖冲突
**解决方案**：使用`--legacy-peer-deps`标志安装依赖，这会忽略peer依赖的冲突。

## 项目配置
### vue.config.js
项目的主要配置文件：
```javascript
module.exports = {
  transpileDependencies: [],
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
}
```

## 脚本说明
- `npm run serve`: 启动开发服务器
- `npm run build`: 构建生产版本

希望这份指南能帮助你在新电脑上顺利运行项目！如有其他问题，请随时咨询。