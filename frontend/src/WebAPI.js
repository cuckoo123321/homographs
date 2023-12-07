import { getAuthToken, setAuthToken } from './constants/utils';//引入 token
import axios from 'axios';

const baseURL = 'http://localhost:5001/api'; // 設定後端埠口號

export const fetchCarouselData = async () => {
    try {
        const response = await fetch(`${baseURL}/data/carousel`, {
        method: 'GET',
        mode: 'cors',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchProductData = async () => {
    try {
        const response = await fetch(`${baseURL}/productData/product`, {
        method: 'GET',
        mode: 'cors',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const fetchEventData = async () => {
    try {
        const response = await fetch(`${baseURL}/eventData/event`, {
        method: 'GET',
        mode: 'cors',
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

// const fetLoginUser= async (username, password) => {
//     try {
//         const response = await fetch(`${baseURL}/userData/user`, {
//         method: 'POST',
//         mode: 'cors',
//         headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ username, password }),
//         });

//         const result = await response.json();
//         return result;
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

export const login = (user_name, user_password) => {
    return fetch(`${baseURL}/userData/userLogin`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_name,
            user_password
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
            const token = data.token;
            const user = data.user;  // 確保這裡有 user 數據
            setAuthToken(token);
            return { success: true, token, user };
          } else {
            return { success: false, message: data.message };
          }
    });
};

export const getMe = () => {
    const token = getAuthToken();
  
    // 檢查 token 是否存在
    if (token) {
      return fetch(`${baseURL}/userData/user`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('發生錯誤:', error);
        return { success: false, message: '伺服器錯誤' };
      });
    } else {
      // 若 token 不存在，返回一個表示未授權的錯誤
      return Promise.resolve({ success: false, message: '未授權' });
    }
  };
  
  

export const registerUser = async (userData) => {
    try {
      const response = await axios.post(`${baseURL}/userData/userRegister`, userData);
      return response.data;
    } catch (error) {
      console.error('註冊失敗:', error);
      throw error;
    }
};

export const updateUserData = async (data) => {
  const token = getAuthToken();

  if (token) {
    return fetch(`${baseURL}/userData/userUpdate/${data.user_id}`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .catch((error) => {
      console.error('發生錯誤:', error);
      return { success: false, message: '伺服器錯誤' };
    });
  } else {
    return Promise.resolve({ success: false, message: '未授權' });
  }
};

export const getProductById = async (product_id) => {
  try {
    const response = await fetch(`${baseURL}/productData/${product_id}`, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      console.error('Response not ok:', response.statusText);
      throw new Error('Failed to fetch product');
    }

    return response;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};


