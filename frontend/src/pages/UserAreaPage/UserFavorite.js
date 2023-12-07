import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import {  useLocation } from "react-router-dom";
import UserNav from './UserNav';
import { fetchProductData } from '../../WebAPI';
import { Link } from 'react-router-dom';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

const UserFavoriteContainer = styled.div`
  width: 700px;
  height: 100%;
  padding: 80px 20px;
  border: 1px solid #ddd; 
  border-radius: 8px; /* 圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const UserFavoriteTitle = styled.h1`
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
    margin-bottom: 30px;
`;

const Alert = styled.div`
  color: rgb(60, 60, 60);
  margin-top:50px;
  font-size: 20px;
`;

const InfoContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const Index = styled.div`
    color: rgb(47, 150, 169);
    font-size: 18px;
    font-weight: 500;
`;

const ProductTitle = styled.div`
    width:300px;
    font-size: 18px;
    font-weight: 400;
    text-align: left;
    margin: 0 0 0 10px;
`;

const ProductDiscount = styled.div`
    font-size: 18px;
    font-weight: 400;
    text-align: left;
    margin-right: 10px;
`;

const FavoriteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-radius: 4px;
  &:hover{
    background: rgb(47, 150, 169, 0.1);
  }
`;

const ButtonContainer = styled.div`

`;

const Button = styled.button`
    background-color: rgb(47, 150, 169);
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 4px;

    &:hover {
    background-color: rgb(35 112 128);
    }
    &:first-child {
        margin-right: 20px;
    }
    &:last-child{
        background-color: rgb(47, 150, 169, 0.7);
        &:hover {
            background-color: rgb(35 112 128);
            }
    }
`;

export default function UserFavoritePage () {
    const location = useLocation();
    const [favorites, setFavorites] = useState([]);
    const [productData, setProductData] = useState([]);


    useEffect(() => {
        // 從 localStorage 中獲取目前的收藏清單
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
          try {
            // 獲取所有收藏商品的商品數據
            const products = await fetchProductData();
    
            // 根據收藏的ID篩選商品
            const favoriteProducts = products.filter((product) =>
              favorites.includes(product.product_id)
            );
    
            // 用獲取到的商品數據更新狀態
            setProductData(favoriteProducts);
          } catch (error) {
            console.error('獲取商品數據時出錯:', error);
          }
        };
    
        // 在收藏清單改變時獲取數據
        fetchData();
      }, [favorites]);
    
      const handleRemoveFavorite = (productId) => {
            // 使用 window.confirm 彈出確認框
            const userConfirmed = window.confirm('確定取消收藏？');
        
            // 如果使用者確認，則執行取消收藏的操作
            if (userConfirmed) {
                // 移除收藏
                const updatedFavorites = favorites.filter((id) => id !== productId);
                setFavorites(updatedFavorites);
        
                // 將更新後的收藏清單存回 localStorage
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            }
        };

      const handleAddToCart = (productId, productTitle, productDiscount) => {
        try {
            // 從 localStorage 中獲取購物車清單
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
            // 檢查商品是否已在購物車中
            const existingItem = cartItems.find((item) => item.product_id === productId);
    
            if (existingItem) {
                // 如果已經在購物車中，更新購買數量
                existingItem.quantity += 1;
            } else {
                // 否則加入購物車，預設商品數量為1
                const newItem = {
                    product_id: productId,
                    quantity: 1,
                    product_title: productTitle,
                    product_discount: productDiscount
                };
                cartItems.push(newItem);
            }
    
            // 將更新後的購物車清單存回 localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
            // 提示成功加入購物車
            alert('成功加入購物車');
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    return (
        <Root>
            <UserNav location={location} />
           
            <UserFavoriteContainer>
                <UserFavoriteTitle>收藏商品清單</UserFavoriteTitle>
                {favorites.length === 0 ? (
                    <Alert>您尚未收藏任何商品</Alert>
                ) : (
                    favorites.map((productId, index) => {
                    // 查找當前收藏的商品數據
                    const product = productData.find((p) => p.product_id === productId);

                    return (
                        <FavoriteItem key={productId}>
                        <Index>{`#${index + 1}`}</Index>
                        {product && (
                            <>
                            <Link to={`/product/${product.product_id}`} style={{textDecoration: "none", color: "rgb(60, 60, 60)"}}>
                            <InfoContainer >
                                <ProductTitle>{product.product_title}</ProductTitle>
                                <ProductDiscount>NT{product.product_discount}元</ProductDiscount>
                            </InfoContainer>
                            </Link>
                            </>
                        )}
                        <ButtonContainer>
                        <Button onClick={() => handleAddToCart(product.product_id, product.product_title, product.product_discount)}>加入購物車</Button>
                            <Button onClick={() => handleRemoveFavorite(productId)}>取消收藏</Button>
                        </ButtonContainer>
                        
                        </FavoriteItem>
                    );
                    })
                )}
            </UserFavoriteContainer>
      </Root>
    );
  };