import Mock from 'mockjs'

Mock.mock('/api/list', 'get', (options) => {
  const data = Mock.mock({
    'list|10': [
      {
        'id|+1': 1,
        name: '@cname',
        date: '@date("yyyy-MM-dd")'
      }
    ]
  })
  return data
})
