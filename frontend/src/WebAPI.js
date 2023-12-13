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

//加入收藏
export const addToFavorites = async (favoriteData) => {
  try {
    const response = await axios.post(`${baseURL}/favoriteData/favoriteAdd`, favoriteData);
    return response.data;
  } catch (error) {
    console.error('添加到收藏清單失敗:', error);
    throw error;
  }
};

//顯示收藏清單
export const getFavoriteList = async (user_id, token) => {
  try {
    const response = await axios.get(`${baseURL}/favoriteData/favoriteList/${user_id}`, {
      method: 'GET',
      mode: 'cors',
    });
    return response.data;
  } catch (error) {
    console.error('獲取收藏清單失敗:', error);
    throw error;
  }
};


//移除收藏
export const removeFromFavorites = async (favorite_id) => {
  try {
    const response = await axios.delete(`${baseURL}/favoriteData/favoriteRemove/${favorite_id}`);     
    return response.data;
  } catch (error) {
    console.error('移除收藏失敗:', error);
    throw error;
  }
};

export const addToCart = async (user_id, product_id, quantity, token) => {
  try {
    const response = await axios.post(
      `${baseURL}/cartData/addToCart`,
      { user_id, product_id, quantity },
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    return response.data; // 後端正確回傳 success 和 error 字段
  } catch (error) {
    console.error('添加到購物車失敗:', error);
    throw error;
  }
};

//顯示購物車商品
export const getCart = async (user_id, token) => {
  try {
    const response = await axios.get(
      `${baseURL}/cartData/cartList/${user_id}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('獲取購物車失敗:', error);
    throw error;
  }
};

//更新購物車商品數量
export const updateCartQuantity = async (user_id, product_id, quantity, token) => {
  try {
    const response = await axios.put(
      `${baseURL}/cartData/updateQuantity/${user_id}/${product_id}`,
      { quantity },
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }
    );
   
    return response.data;
  } catch (error) {
    console.error('更新購物車數量失敗:', error);
    throw error;
  }
};

//刪除購物車中商品
export const deleteCartItem = async (user_id, product_id) => {
  try {
    const response = await axios.delete(`${baseURL}/cartData/deleteCartItem/${user_id}/${product_id}`);
    return response.data;
  } catch (error) {
    console.error('刪除購物車商品失敗:', error);
    throw error;
  }
};