/**
 * 解析MySQL表结构SQL语句
 * @param {string} sql - MySQL创建表的SQL语句
 * @returns {object} 解析结果，包含表名和字段信息
 */
export function parseMySqlTable(sql) {
  // 提取表名
  const tableNameMatch = sql.match(/CREATE TABLE\s+`([^`]+)`/i);
  if (!tableNameMatch) {
    throw new Error('无法提取表名，请检查SQL语句格式');
  }
  const tableName = tableNameMatch[1];

  // 提取表注释
  const tableCommentMatch = sql.match(/COMMENT\s*=\s*'([^']*)'/i);
  const tableComment = tableCommentMatch ? tableCommentMatch[1] : '';

  // 提取字段定义部分（大括号内的内容）
  const fieldsBlockMatch = sql.match(/\(([\s\S]*?)\)\s*ENGINE/i);
  if (!fieldsBlockMatch) {
    throw new Error('无法提取字段定义，请检查SQL语句格式');
  }
  const fieldsBlock = fieldsBlockMatch[1];

  // 按行拆分，过滤掉非字段定义行
  const fieldLines = fieldsBlock
    .split(/\n/)
    .map(line => line.trim())
    .filter(line => line && !/^PRIMARY KEY|^KEY|^UNIQUE|^CONSTRAINT/i.test(line));

  const fields = [];

  // 改进的字段正则
  const fieldRegex = /^`([^`]+)`\s+([^\s(]+(?:\(\d+(?:,\d+)?\))?)\s*(?:unsigned)?\s*(?:NOT NULL|NULL)?\s*(?:DEFAULT\s+(?:'.*?'|\d+|NULL|CURRENT_TIMESTAMP(?:\s+ON\s+UPDATE\s+CURRENT_TIMESTAMP)?))?\s*(?:AUTO_INCREMENT)?\s*(?:COMMENT\s+'([^']*)')?/i;

  for (const line of fieldLines) {
    const match = line.match(fieldRegex);
    if (match) {
      const fieldName = match[1];
      const fieldType = match[2].toLowerCase();
      const fieldComment = match[3] || '';
      const isPrimaryKey = sql.includes(`PRIMARY KEY (\`${fieldName}\`)`);
      const isAutoIncrement = /AUTO_INCREMENT/i.test(line);

      fields.push({
        name: fieldName,
        type: fieldType,
        comment: fieldComment,
        isPrimaryKey,
        isAutoIncrement
      });
    }
  }

  return {
    tableName,
    tableComment,
    fields
  };
}
