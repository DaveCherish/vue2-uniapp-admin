# Vue2 UniApp Admin

## 项目启动
```bash
# 安装依赖
npm install

# 启动前端服务
npm run serve

# 启动后端服务(可选，代码生成器中用于文件生成功能)
node server.js
```

## 项目介绍
这是一个基于 Vue 2 和 UniApp 框架开发的后台管理系统模板，提供了代码生成器、列表页、表单页等常用功能模块，帮助开发者快速构建管理类应用。

## 框架结构说明

```
├── .idea/                  # IDE配置文件
├── babel.config.js         # Babel配置
├── package-lock.json       # 依赖版本锁定
├── package.json            # 项目依赖
├── public/                 # 静态资源
│   └── index.html          # 入口HTML
├── server.js               # 后端服务，用于文件生成
├── src/                    # 源代码
│   ├── App.vue             # 应用入口
│   ├── assets/             # 静态资源
│   │   └── styles/         # 样式文件
│   ├── components/         # 公共组件
│   │   ├── CodeGenerator.vue    # 代码生成器
│   │   ├── ImagePreview.vue     # 图片预览
│   │   ├── Pagination.vue       # 分页组件
│   │   ├── SearchBar.vue        # 搜索栏
│   │   ├── SpecificationManager.vue  # 规格管理
│   │   └── UploadImages.vue     # 图片上传
│   ├── layout/             # 布局组件
│   │   ├── components/     # 布局子组件
│   │   └── index.vue       # 主布局
│   ├── main.js             # 入口文件
│   ├── mock/               # 模拟数据
│   │   └── index.js        # 模拟数据入口
│   ├── router/             # 路由配置
│   │   └── index.js        # 路由定义
│   ├── store/              # Vuex状态管理
│   │   └── index.js        # 状态管理入口
│   ├── utils/              # 工具函数
│   │   ├── codeGenerator.js    # 代码生成器核心逻辑
│   │   ├── codeTemplates.js    # 代码模板
│   │   └── testParser.js       # 测试解析器
│   └── views/              # 页面组件
│       ├── index/      # 仪表盘
│       ├── form/           # 表单页
│       ├── list/           # 列表页
│       ├── login/          # 登录页
│       └── system/         # 系统设置
├── test-parser.html        # 测试解析器页面
└── vue.config.js           # Vue配置
```

## 表单页使用方法

### 1. 输入框 (Input)
```html
<el-form-item label="用户名" prop="username">
  <el-input v-model="formData.username" placeholder="请输入用户名" clearable></el-input>
</el-form-item>
```

```javascript
// data中定义
formData: {
  username: ''
},
// 验证规则
rules: {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ]
}
```

### 2. 文本域 (Textarea)
```html
<el-form-item label="备注" prop="remark">
  <el-input
    type="textarea"
    v-model="formData.remark"
    placeholder="请输入备注"
    :rows="4"
  ></el-input>
</el-form-item>
```

```javascript
// data中定义
formData: {
  remark: ''
}
```

### 3. 下拉选择 (Select)
```html
<el-form-item label="性别" prop="gender">
  <el-select v-model="formData.gender" placeholder="请选择性别" filterable clearable>
    <el-option label="男" value="1"></el-option>
    <el-option label="女" value="2"></el-option>
    <el-option label="保密" value="0"></el-option>
  </el-select>
</el-form-item>
```

```javascript
// data中定义
formData: {
  gender: ''
},
// 验证规则
rules: {
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ]
}
```

### 4. 单选框 (Radio)
```html
<el-form-item label="状态" prop="status">
  <el-radio-group v-model="formData.status">
    <el-radio label="1" border>启用</el-radio>
    <el-radio label="0" border>禁用</el-radio>
  </el-radio-group>
</el-form-item>
```

```javascript
// data中定义
formData: {
  status: '1' // 默认启用
}
```

### 5. 复选框 (Checkbox)
```html
<el-form-item label="爱好" prop="hobbies">
  <el-checkbox-group v-model="formData.hobbies">
    <el-checkbox label="1" border>读书</el-checkbox>
    <el-checkbox label="2" border>旅行</el-checkbox>
    <el-checkbox label="3" border>运动</el-checkbox>
    <el-checkbox label="4" border>摄影</el-checkbox>
  </el-checkbox-group>
</el-form-item>
```

```javascript
// data中定义
formData: {
  hobbies: []
}
```

### 6. 日期选择 (DatePicker)
```html
<el-form-item label="出生日期" prop="birthday">
  <el-date-picker
    v-model="formData.birthday"
    type="date"
    placeholder="请选择出生日期"
    clearable
  ></el-date-picker>
</el-form-item>
```

```javascript
// data中定义
formData: {
  birthday: ''
}
```

### 7. 单图上传 (Upload Single)
```html
<el-form-item label="头像">
  <el-upload class="upload-demo" action="/api/upload" :limit="1" :file-list="singleImageList" :on-remove="handleRemoveSingle"
    :on-success="handleSingleSuccess" list-type="picture-card" accept="image/*">
    <i class="el-icon-plus"></i>
  </el-upload>
</el-form-item>
```

```javascript
// data中定义
formData: {
  avatar: ''
},
singleImageList: [],

// 方法
handleRemoveSingle(file, fileList) {
  this.formData.avatar = '';
  this.singleImageList = fileList;
},

handleSingleSuccess(response, file, fileList) {
  this.formData.avatar = response.data.url;
  this.singleImageList = fileList;
}
```

### 8. 多图上传 (Upload Multiple)
```html
<el-form-item label="相册">
  <el-upload class="upload-demo" action="/api/upload" :limit="5" :file-list="multiImageList" :on-remove="handleRemoveMulti"
    :on-success="handleMultiSuccess" multiple list-type="picture-card" accept="image/*">
    <i class="el-icon-plus"></i>
  </el-upload>
</el-form-item>
```

```javascript
// data中定义
formData: {
  album: []
},
multiImageList: [],

// 方法
handleRemoveMulti(file, fileList) {
  this.multiImageList = fileList;
  this.formData.album = fileList.map(item => item.url);
},

handleMultiSuccess(response, file, fileList) {
  this.multiImageList = fileList;
  this.formData.album = fileList.map(item => item.url);
}
```

### 9. 开关 (Switch)
```html
<el-form-item label="是否激活" prop="active">
  <el-switch v-model="formData.active" :active-value="1" :inactive-value="0"></el-switch>
</el-form-item>
```

```javascript
// data中定义
formData: {
  active: 1 // 默认激活
}
```

### 10. 富文本 (Rich Text)
```html
<el-form-item label="内容" prop="content">
  <ckeditor :editor="editor" v-model="formData.content" :config="editorConfig"></ckeditor>
</el-form-item>
```

```javascript
// 引入
import CKEditor from '@ckeditor/ckeditor5-vue2'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

// components中注册
components: {
  ckeditor: CKEditor.component
},

// data中定义
formData: {
  content: ''
},
editor: ClassicEditor,
editorConfig: {
  // 配置项
  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
}
```


### 11. 排序功能 (SortableList)

本项目中的菜单排序功能已被封装成可复用的组件 `SortableList`，该组件基于 Element UI 的拖拽功能实现。

### 组件使用方式

在 `src/views/system/menu/index.vue` 中的使用示例：

```vue
  <!-- 使用排序组件 -->
  <SortableList
    :visible.sync="sortDialogVisible"
    title="一级菜单排序"
    width="600px"
    :data-source="firstLevelMenus"
    @confirm="handleSortConfirm"
  />
```
```javascript
import SortableList from '@/components/SortableList.vue'

export default {
  components: {
    SortableList
  },
  data() {
    return {
      sortDialogVisible: false,
      firstLevelMenus: []
      // ...其他数据
    }
  },
  methods: {
    // 打开排序对话框
    handleSort() {
      this.firstLevelMenus = this.menuList.filter(item => item.pid === 0);
      this.sortDialogVisible = true;
    },

    // 处理排序确认
    handleSortConfirm(sortedList) {
      // 调用排序接口
      api.post('/Admin/menu/sort', { list: sortedList })
        .then(res => {
          if (res.result === 1) {
            this.$message({ type: 'success', message: res.msg || '排序成功!' });
            // 刷新菜单列表
            this.fetchMenuList();
          } else {
            this.$message({ type: 'error', message: res.msg || '排序失败!' });
          }
        })
        .catch(error => {
          this.$message({ type: 'error', message: '排序出错，请重试' });
        });
    }
    // ...其他方法
  }
}
```

## 使用说明

1. 导入并注册 `SortableList` 组件
2. 在模板中添加组件，并绑定相关属性和事件
3. 准备数据源（一级菜单列表）
4. 实现排序确认处理函数，调用API保存排序结果

## 注意事项

- 组件仅支持一级菜单排序
- 排序结果通过 `confirm` 事件返回
- 组件内部已处理数据深拷贝，避免直接修改原始数据
- 排序完成后需手动刷新菜单列表

### 12. 规格管理 (Specification Manager)
规格管理组件用于管理商品规格和规格值，并支持规格组合的生成。

```html
<el-form-item label="商品规格">
  <specification-manager v-model="form.specData"></specification-manager>
</el-form-item>
```

```javascript
// 引入组件
import SpecificationManager from '@/components/SpecificationManager.vue'

// components中注册
components: {
  SpecificationManager
},

// data中定义
form: {
  specData: {
    specs: [], // 规格列表
    combinations: [] // 规格组合列表
  }
}
```

#### 组件特性
1. 支持动态添加、编辑和删除规格
2. 支持为每个规格添加、编辑和删除规格值
3. 自动生成所有可能的规格组合
4. 支持数据双向绑定

#### 数据结构说明
```javascript
// 规格数据结构
specData: {
  specs: [
    {
      name: '颜色',
      values: ['红色', '蓝色', '绿色'],
      inputValue: ''
    },
    {
      name: '尺寸',
      values: ['S', 'M', 'L', 'XL'],
      inputValue: ''
    }
  ],
  combinations: [
    {
      '颜色': '红色',
      '尺寸': 'S',
      price: 99.99,
      stock: 100,
      image: ''
    },
    {
      '颜色': '红色',
      '尺寸': 'M',
      price: 109.99,
      stock: 150,
      image: ''
    },
    {
      '颜色': '红色',
      '尺寸': 'L',
      price: 119.99,
      stock: 200,
      image: ''
    },
    {
      '颜色': '红色',
      '尺寸': 'XL',
      price: 129.99,
      stock: 180,
      image: ''
    },
    {
      '颜色': '蓝色',
      '尺寸': 'S',
      price: 99.99,
      stock: 90,
      image: ''
    },
    {
      '颜色': '蓝色',
      '尺寸': 'M',
      price: 109.99,
      stock: 120,
      image: ''
    },
    {
      '颜色': '蓝色',
      '尺寸': 'L',
      price: 119.99,
      stock: 160,
      image: ''
    },
    {
      '颜色': '蓝色',
      '尺寸': 'XL',
      price: 129.99,
      stock: 140,
      image: ''
    },
    {
      '颜色': '绿色',
      '尺寸': 'S',
      price: 99.99,
      stock: 80,
      image: ''
    },
    {
      '颜色': '绿色',
      '尺寸': 'M',
      price: 109.99,
      stock: 110,
      image: ''
    },
    {
      '颜色': '绿色',
      '尺寸': 'L',
      price: 119.99,
      stock: 130,
      image: ''
    },
    {
      '颜色': '绿色',
      '尺寸': 'XL',
      price: 129.99,
      stock: 100,
      image: ''
    }
  ]
}
```

## 代码生成器使用
1. 启动项目: `npm run serve`
2. 启动后端服务: `node server.js`
3. 访问代码生成器页面
4. 输入MySQL表结构，点击解析
5. 配置生成选项和字段信息
6. 点击生成代码
7. 点击生成文件按钮，将代码写入到指定路径