import { Api } from "../utils/api";

// Lấy dữ liệu
export const fetchData = async (url, config = {}) => {
  const response = await Api.get(url, config);
  return response
}

// Gửi dữ liệu (POST)
export const postData = async (url, data, config = {}) => {
  const response = await Api.post(url, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*"
    },
    ...config
  });
  return response
}

// Cập nhật dữ liệu (PUT)
export const updateData = async (url, data, config = {}) => {
  const response = await Api.put(url, data, config);
  return response
}

// Xóa dữ liệu
export const deleteData = async (url, config = {}) => {
  const response = await Api.delete(url, config);
  return response
}
