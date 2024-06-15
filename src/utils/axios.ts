import axios from 'axios';
import { MessagePlugin } from "tdesign-vue-next";
import Cookies from "js-cookie";

export const baseURL = import.meta.env.DEV ? 'http://127.0.0.1:7001' : 'http://127.0.0.1:7001';

export const xsrfCookieName = 'csrfToken';
export const xsrfHeaderName = 'x-csrf-token';

const instance = axios.create({
  baseURL,
  timeout: 60000,
  withCredentials: true,
  xsrfCookieName,
  xsrfHeaderName
});

instance.interceptors.request.use(request => {
  (request.headers as any).Authorization = window.localStorage.getItem('jwt');
  (request.headers as any)[xsrfHeaderName] = Cookies.get(xsrfCookieName);
  return request
})

instance.interceptors.response.use(response => {
  return response
}, error => {
  MessagePlugin.error(error.response.data.error)
  return Promise.reject(error)
})

export default instance