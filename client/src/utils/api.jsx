import axios from 'axios';

// Tạo một instance của axios
const apiInstance = axios.create({
  baseURL: 'http://localhost:5555', // Thay thế với baseURL của bạn
  timeout: 10000, // Đặt timeout là 10 giây
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*"
  }
});

// Thêm một request interceptor
apiInstance.interceptors.request.use(function (config) {
    // Thực hiện các cấu hình trước khi request được gửi đi
    // Ví dụ: Thêm token vào header
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
}, function (error) {
    // Xử lý lỗi request
    return Promise.reject(error);
});

// Thêm một response interceptor
apiInstance.interceptors.response.use(function (response) {
    // Bất kỳ mã status nào trong khoảng 2xx đều gây ra việc này được trigger
    // Làm gì đó với dữ liệu response
    return response;
}, function (error) {
    // Xử lý lỗi response
    return Promise.reject(error);
});

export const Api = apiInstance;
