import {requset} from "./request";

export function Login(username, password) {
  return requset({
    url: '/login',
    post: username, password
  })
}