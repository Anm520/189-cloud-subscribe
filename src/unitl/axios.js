import _axios from 'axios'

// 创建一个 Axios 实例，并配置 `withCredentials` 为 `true`
const axios = _axios.create({
    withCredentials: true,
})

axios.interceptors.response.use(
    function (response) {
        // 对响应数据做点什么
        if (response.status === 200) {
            return response.data
        } else {
            console.log('1112313131 >>>>>:', response);
            return response
        }
    },
    function (error) {
        // console.log('请求失败error>>>>>>', error.response)
        return (error.response && error.response.data) || '请求失败'
    },
)
export default axios
