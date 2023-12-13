import React from 'react';
import styled from 'styled-components';
import {  useState, useEffect } from 'react';
//引入 Router
import { HashRouter as Router, Routes, Route } from "react-router-dom";
//引入每個 pages
import HomePage from '../../pages/HomePage/index';
import Header from '../Header/index';
import Footer from '../Footer/index';
import EventPage from '../../pages/EventPage/index';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage/index';
import { UserAreaPage, UserEdit, UserFavorite } from '../../pages/UserAreaPage/index';
import { ProductPage, SingleProductPage } from '../../pages/ProductPage/index';
import { CheckOutPage, ShippingAddress, Payment } from '../../pages/CheckOutPage/index';



//驗證 token
import { AuthContext } from '../../contexts';
import { getMe } from '../../WebAPI';
import { getAuthToken } from '../../constants/utils';

const Root = styled.div``

function App() {
  const [user, setUser] = useState(null); 


  useEffect(() => {
    const fetchData = async () => {
      
      const token = getAuthToken();
      if (token) {
        // 有 Token 時才調用 API
        try {          
          const response = await getMe();          
          if (response && response.success) {
            setUser(response.user);
            console.log(response.user)
          } else {
            setUser(null);
            // 在此處清空購物車的本地存儲數據
            localStorage.removeItem('cartItems');
            window.alert('驗證失敗，請重新登入');
          }
        } catch (error) {
          console.error('驗證期間發生錯誤:', error);
          setUser(null); // 在錯誤時也設置 user 為 null
          // 在此處清空購物車的本地存儲數據
          localStorage.removeItem('cartItems');
          window.alert('驗證期間發生錯誤，請重新登入');
        }
      }else {
        // 無 Token，表示用戶已登出或 token 失效
        // 在此處清空購物車的本地存儲數據
        localStorage.removeItem('cartItems');
        // 驗證時間超時，顯示提示彈窗
        window.alert('驗證已逾時，請重新登入');
      }
    };
  
    fetchData(); // 立即調用 fetchData
  }, [setUser]);
  
  
  return (
    <AuthContext.Provider value={{user, setUser }}> 
        <Root>
          <Router>
            <Header/>
            <Routes>
              <Route element={<HomePage />} path="/"/>
              <Route  element={<ProductPage />} path="/product"/>
              <Route  element={<SingleProductPage />} path="/product/:product_id"  />
              <Route  element={<EventPage />} path="/event"/>
              <Route  element={<LoginPage />} path="/login"/>
              <Route  element={<RegisterPage />} path="/register"/>
              <Route element={<UserAreaPage />} path="/userArea"/>
              <Route element={<UserEdit />} path="/userEdit"/>
              <Route element={<UserFavorite />} path="/userFavorite"/>
              <Route element={<CheckOutPage />} path="/checkOut"/>
              <Route element={<ShippingAddress />} path="/shippingAddress"/>
              <Route element={<Payment />} path="/payment"/>
            </Routes>
            <Footer/> 
          </Router>          
        </Root>
    </AuthContext.Provider>
  )
}

export default App;