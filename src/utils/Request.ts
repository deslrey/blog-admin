import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import qs from 'qs'; // 引入 qs 库用于处理 URL 编码的请求体
import message from './Message';

interface Results<T> {
    code: number;
    message: string;
    data: T;
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: '/deslre', // 这里是接口的基础路径
    timeout: 5000, // 设置超时
});

// 请求拦截器
service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {  // 强制转换为 InternalAxiosRequestConfig
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`; // 添加 token 到请求头
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log(response); // 打印响应数据

        const res = response.data;
        if (res.code !== 200) {
            // 错误提示可以扩展
            message.error(res.message || '请求失败');
            return Promise.reject(res);
        }
        return res;
    },
    (error) => {
        message.error(error.message || '网络错误，请稍后再试！'); // 错误提示
        return Promise.reject(error);
    }
);

// 通用的 POST 方法（支持 json 和 form-urlencoded）
const post = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    contentType: 'json' | 'form' = 'json' // 控制是否发送 x-www-form-urlencoded
): Promise<Results<T>> => {
    if (contentType === 'form') {
        return service.post(url, qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                ...config?.headers, // 保证其他 headers 不丢失
            },
            ...config,
        });
    }
    return service.post(url, data, config); // 默认发送 json 格式
};

// 通用的 GET 方法
const get = <T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<Results<T>> => {
    return service.get(url, { params, ...config });
};

// 封装请求的方法
const request = {
    get,
    post,
    instance: service,
};

export default request;
