import axios from 'axios';
import { message } from 'antd';
import { getToken } from './auth';

const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const request = axios.create({
  baseURL: apiBaseURL,
  timeout: 10000,
});

// 请求拦截
request.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRedirecting = false;

function redirectToLogin() {
  if (isRedirecting) return;

  const isLoginPage = window.location.pathname === '/login';
  if (isLoginPage) return;

  isRedirecting = true;

  localStorage.removeItem('token');

  const currentPath = window.location.href;
  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
}

// 响应拦截
request.interceptors.response.use(
  (response) => {
    const res = response.data;

    // 业务错误
    if (res.code !== 200) {
      message.error(res.message || '请求失败');
      return Promise.reject(new Error(res.message));
    }

    return res;
  },
  (error) => {
    const res = error.response?.data;

    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录');
      redirectToLogin();
      return Promise.reject(error);
    }

    if (res?.message) {
      message.error(res.message);
    } else {
      message.error('服务器异常');
    }

    return Promise.reject(error);
  }
);

export default request;
