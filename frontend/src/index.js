import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { ThemeProvider } from "styled-components";

const root = ReactDOM.createRoot(document.getElementById('root'));
// 定義一個基本的主題
const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
  },
  // 其他樣式屬性...
};

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);