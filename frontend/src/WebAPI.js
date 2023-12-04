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

// export const getMe = () => {
//     const token = getAuthToken() //使用引入的 token
//     return fetch(`${baseURL}/userData/user`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       .then(res => res.json())
//       .then(data => {
//         return data;
//     })
// };


// export const getMe = () => {

//     const token = getAuthToken();
//     return fetch(`${baseURL}/userData/user`, {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     })
//     .then(res => res.json())
//     .then(data => data)  // 直接返回 data，不再包裝成 { data }
//     .catch(error => {
//       console.error('發生錯誤:', error);
//       throw error;  // 如果發生錯誤，請往上拋出
//     });
// };

export const getMe = () => {
    const token = getAuthToken();    
    // 檢查token是否存在
    if (token) {
      return fetch(`${baseURL}/userData/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        return data;
      })
      .catch(error => {
        console.error('發生錯誤:', error);
        return { success: false, message: '伺服器錯誤' };
      });
    } else {
      // 若token不存在，返回一個表示未授權的錯誤
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
}

