import axios from 'axios'
import qs from 'qs'
// import store from 'store'
import { Loading, Message } from 'element-ui'
import router from '../router'
import { baseUrl } from '../config/index'
import store from '@/vuex/store'

const Axios = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  responseType: 'json',
  // withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
})

// debugger
let loading = null
Axios.interceptors.request.use(
  config => {
    // console.log(config)
    const token = sessionStorage.getItem('mp-token') || ''
    config.data = Object.assign(config.data || {}, {accessToken: token})
    config.url = config.url + `?accessToken=${token}`
    // if (config.token) {
    //   config.headers.Authorization = token
    // }
    if (config.method === 'post' && config.contentType !== 'application/json') {
      // 序列化
      config.data = qs.stringify(config.data || {})
    } else {
      config.data = config.data || {}
    }
    //设置自定义content-type
    if (config.contentType) {
      config.headers['Content-Type'] = config.contentType
    }
    // 是否显示加载动画 默认不显示
    if (config.loading && config.loading == true) {
      loading = Loading.service({
        fullscreen: true
      })
    }
    return config
  },
  error => {
    if (loading) {
      loading.close()
      loading = null
    }
    Message({
      showClose: true,
      message: '参数异常',
      type: 'error',
      center: true
    })
    return Promise.reject(error)
  }
)


// function clearVuex(store) {
//   store._mutations.resetState[0](store.state)
// }
// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    if (loading) {
      loading.close()
      loading = null
    }
    if (res.status === 200 && res.data.code !== 1) {
      
      if (res.data.code === -105 || res.data.code === -201) {
        // sessionStorage.removeItem('mp-token')
        // 清除vuex 
        if (store) {
          store.commit.resetState[0](store.state)
        }        
        sessionStorage.clear()
        router.push({
          path: '/login'
        })
      } else {
        Message({
          showClose: true,
          message: res.data.message,
          type: 'error',
          center: true
        })
      }
    }
    return res.data
  }, (error) => {
    if (loading) {
      loading.close()
      loading = null
    }
    Message({
      showClose: true,
      message: '接口异常',
      type: 'error',
      center: true
    })
    return Promise.reject(error)
  }
)

export default Axios
