import axios from 'axios'

const instance=axios.create({

})

instance.interceptors.request.use(
    (config) => {
        // 获取存储的 token
        const token = localStorage.getItem('authorization');
        
        // 如果 token 存在，设置到请求头
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // 返回修改后的配置
        return config;
    },
    (error) => {
        // 请求错误时处理
        return Promise.reject(error);
    }
);

// 将这个实例导出，或者在整个应用中使用它
export default instance;
