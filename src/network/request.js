import axios from "axios";

export function requset(config) {
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 10000
  })

  // instance.interceptors.request.use(config => {
  //   config.headers.Authorzation = window.sessionStorage.getItem('token')
  //   return config
  // })

  return instance(config)
}