import React from 'react';
import styled from 'styled-components';
import {  useState, useEffect } from 'react';
//引入 Router
import { HashRouter as Router, Routes, Route } from "react-router-dom";
//引入每個 pages
import HomePage from '../../pages/HomePage/index';
import Header from '../Header/index';
import ProductPage from '../../pages/ProductPage/index';
import EventPage from '../../pages/EventPage/index';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage/index';
import { AuthContext } from '../../contexts';
import { getMe } from '../../WebAPI';
import { getAuthToken } from '../../constants/utils';

const Root = styled.div``

function App() {
  const [user, setUser] = useState(null);  

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // 有 Token 時才調用 API
      getMe()
        .then((response) => {
          console.log('Response from getMe:', response);
          if (response && response.ok) {
            setUser(response.data);
          }else{
            setUser(null);
          }
        })
        .catch((error) => {
          console.error('驗證期間發生錯誤:', error);
        });
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{user, setUser}}>
    <Root>
      <Router>
        <Header/>
        <Routes>
          <Route element={<HomePage />} path="/"/>
          <Route  element={<ProductPage />} path="/product"/>
          <Route  element={<EventPage />} path="/event"/>
          <Route  element={<LoginPage />} path="/login"/>
          <Route  element={<RegisterPage />} path="/register"/>
          
        </Routes>
      </Router>      
    </Root>
    </AuthContext.Provider>
  )
}

export default App;