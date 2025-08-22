const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 写入文件接口
app.post('/api/write-file', (req, res) => {
  try {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
      return res.status(400).json({ success: false, message: '文件路径和内容不能为空' });
    }

    // 获取文件目录
    const dirPath = path.dirname(filePath);

    // 确保目录存在
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 写入文件
    fs.writeFileSync(filePath, content, 'utf8');

    res.json({ success: true, message: `文件已成功写入: ${filePath}` });
  } catch (error) {
    res.status(500).json({ success: false, message: `写入文件失败: ${error.message}` });
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`后端服务运行在 http://localhost:${PORT}`);
});