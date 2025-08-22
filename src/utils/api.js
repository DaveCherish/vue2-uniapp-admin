import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: 'https://tp5-vue.lizaonet.com', // 设置基础URL
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 添加调试信息
console.log('API Base URL:', service.defaults.baseURL);

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 调试信息 - 检查请求URL
    console.log('Request URL:', config.baseURL + config.url);
    console.log('Config baseURL:', config.baseURL);
    
    // 可以在这里添加请求头，如token
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 调试信息 - 检查响应
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    // 可以在这里统一处理响应数据
    return response.data
  },
  error => {
    console.error('响应错误:', error);
    // 详细的错误信息
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误响应头:', error.response.headers);
      console.error('错误响应数据:', error.response.data);
      switch (error.response.status) {
        case 401:
          // 未授权处理
          break
        case 404:
          // 资源不存在处理
          break
        default:
          // 其他错误处理
      }
    } else if (error.request) {
      console.error('请求已发送但未收到响应:', error.request);
    } else {
      console.error('设置请求时发生错误:', error.message);
    }
    console.error('请求配置:', error.config);
    return Promise.reject(error)
  }
)

// 导出请求方法
export default {
  get: (url, params) => service.get(url, { params }),
  post: (url, data) => service.post(url, data),
  put: (url, data) => service.put(url, data),
  delete: (url, params) => service.delete(url, { params })
}

// 菜单相关API
// 获取菜单列表
export const getMenuList = () => {
  return service.get('/Admin/Menu/getList')
}

// 配置分组相关API
// 获取配置分组列表
export const getConfigGroupList = (params) => {
  return service.get('/Admin/ConfigGroup/getList', params)
}

// 新增或编辑配置分组
export const addOrEditConfigGroup = (data) => {
  return service.post('/Admin/configGroup/addOrEdit', data)
}

// 删除配置分组
export const deleteConfigGroup = (id) => {
  return service.delete(`/Admin/configGroup/delete?id=${id}`)
}