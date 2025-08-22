const { parseMySqlTable } = require('./codeGenerator');

// 测试用的pu_service表结构SQL
const testSql = `
CREATE TABLE \`pu_service\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  \`service_code\` varchar(50) NOT NULL COMMENT '服务编码',
  \`service_name\` varchar(100) NOT NULL COMMENT '服务名称',
  \`service_desc\` text COMMENT '服务描述',
  \`service_type\` tinyint(4) DEFAULT '1' COMMENT '服务类型：1-API服务，2-数据服务',
  \`status\` tinyint(4) DEFAULT '1' COMMENT '状态：1-启用，2-禁用',
  \`create_time\` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  \`update_time\` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务管理表';
`;

// 执行测试
try {
  // 导入parseMySqlTable函数
  const { parseMySqlTable } = require('./codeGenerator');
  
  // 使用导入的parseMySqlTable函数，并添加调试信息
function debugParseMySqlTable(sql) {
  try {
    console.log('调用parseMySqlTable函数...');
    const result = parseMySqlTable(sql);
    console.log('解析结果:', result);
    return result;
  } catch (error) {
    console.error('解析失败:', error.message);
    throw error;
  }
}
  
  // 使用调试版本的函数
  const result = debugParseMySqlTable(testSql);
  console.log('\n最终解析结果:');
  console.log('表名:', result.tableName);
  console.log('表注释:', result.tableComment);
  console.log('字段数量:', result.fields.length);
  console.log('所有字段:', result.fields.map(field => field.name).join(', '));
  // 输出详细字段信息
  result.fields.forEach(field => {
    console.log(`字段: ${field.name}, 类型: ${field.type}, 注释: ${field.comment}, 主键: ${field.isPrimaryKey}, 自增: ${field.isAutoIncrement}`);
  });
} catch (error) {
  console.error('解析失败:', error.message);
}