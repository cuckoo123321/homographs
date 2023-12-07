import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { getProductById } from '../../WebAPI';

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 150px;
`;

const Container = styled.div`
  padding: 20px;
  border-radius: 8px;  
  display: flex;
  max-width: 1000px; /* 設定最大寬度，以防止內容過寬 */
`;

const ProductImgContainer = styled.div`
  max-width: 500px;
  height: auto;
  border-radius: 8px;
  border: 0.5px solid rgb(47, 150, 169,0.2);
  box-shadow: 0px 5px 5px rgb(47, 150, 169, 0.5);
`;

const ProductImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
`;

const ProductDetails = styled.div`
  flex: 1; /* 佔據剩餘空間 */
  margin-left: 50px;
`;

const ProductTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  color:rgb(31 100 113);
`;

const ItemGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Label = styled.span`
  color: rgb(31 100 113);
  font-size: 18px;
  margin-right: 10px;
  flex-shrink: 0; /* 防止 Label 被壓縮 */
`;

const Price = styled.span`
  color: rgb(60 60 60);
  font-size: 18px;
  text-decoration: line-through;
  &::before {
    content: "NT ";
    }
  &::after {
    content: " 元";
    }
`;

const Discount = styled.span` 
  color: rgb(173 62 74);
  font-size: 18px;
  &::before {
    content: "NT ";
    }
  &::after {
    content: " 元";
    }
`;

const ProductDescription = styled.div`
    height: 160px;
    overflow-y: auto;
    color: rgb(60 60 60);
    font-size: 18px;
    margin-top: 10px;
    flex-grow: 1; /* 使 ProductDescription 佔據剩餘空間 */
`;

const Category = styled.span`
  color: rgb(31 100 113);
  font-size: 18px;
  font-weight: bold;
  &::before {
    content: "#";
    }
`;

const Stock = styled.span`
  rgb(60 60 60);
  font-size: 18px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(47, 150, 169);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-right: 10px;
  margin-top:30px;
  cursor: pointer;
  flex: 1; /* 讓按鈕佔據彈性空間的一半 */

  svg {
    margin-right: 5px;
  }
  &:hover {
    background: rgb(35 112 128);
  }
`;

const ButtonLabel = styled.span`
  font-size: 16px;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  font-size: 16px;
  margin: 0 10px;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: rgb(47, 150, 169);
  color: white;
  font-weight: 900;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: rgb(35 112 128);
  }
`;

export default function SingleProductPage ({ setCartItems }){
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // 根據 productId 從 API 中取得商品詳細資訊
    // 這裡僅為範例，實際上需要調用相應的 API 函數
    const fetchProduct = async () => {
        try {
          const response = await getProductById(product_id);      
          if (!response.ok) {
            console.error('Response not ok:', response.statusText);
            throw new Error('Failed to fetch product');
          }
      
          const data = await response.json();
          setProduct(data); // 設定商品詳細資訊到 state
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

    fetchProduct();
  }, [product_id]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.product_stock) {
        setQuantity(quantity + 1);
      }
  };


// 使用 localStorage 處理收藏功能
const handleFavorite = (product_id) => {
    try {
      // 從 localStorage 中獲取目前的收藏清單
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  
      // 檢查商品是否已在收藏清單中
      const isFavorite = favorites.includes(product_id);
  
      if (isFavorite) {
        // 如果已經在收藏清單中，彈出提示
        alert('該商品已經在收藏清單中');
      } else {
        // 否則加入收藏
        const updatedFavorites = [...favorites, product_id];
  
        // 將更新後的收藏清單存回 localStorage
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  
        // 更新前端的收藏狀態，可選擇重新載入收藏清單或使用其他方式
        // updateFavorites();
        alert('成功收藏該商品，請至會員專區查看收藏清單');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

    const handleAddToCart = (productId, productTitle, productDiscount, selectedQuantity) => {
        try {
            // 從 localStorage 中獲取購物車清單
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
            // 檢查商品是否已在購物車中
            const existingItem = cartItems.find((item) => item.product_id === productId);
    
            if (existingItem) {
                // 如果已經在購物車中，更新購買數量
                existingItem.quantity += selectedQuantity;
            } else {
                // 否則加入購物車
                const newItem = {
                    product_id: productId,
                    quantity: selectedQuantity,
                    product_title: productTitle,
                    product_discount: productDiscount
                };
                cartItems.push(newItem);
            }
    
            // 將更新後的購物車清單存回 localStorage
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            // 提示成功加入購物車
            alert('成功加入購物車');
            // 更新 Header.js 中的 cartItems 狀態
            setCartItems(cartItems);
    
            
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

  return (
    <Root>    
    <Container>
        {product ? (
            <>
        <ProductImgContainer>
            <ProductImg src={`http://localhost:5001/uploads/${product.product_path}`} alt={`Product ${product.product_id}`} />
        </ProductImgContainer>
        <ProductDetails>
          <ProductTitle>{product.product_title}</ProductTitle>
            <ItemGroup>
                <Label>定價：</Label>
                <Price>{product.product_price}</Price>
            </ItemGroup>
            <ItemGroup>
                <Label>特價：</Label>
                <Discount>{product.product_discount}</Discount>
            </ItemGroup>
            <ItemGroup>
                <Label>簡介：</Label>
                <ProductDescription>{product.product_description}</ProductDescription>
            </ItemGroup>
            <ItemGroup>
                <Label>分類：</Label>
                <Category>{product.product_category}</Category>
            </ItemGroup>
            <ItemGroup>
                <Label>庫存： </Label>
                {product.product_stock > 10 ? (
                    <Stock>庫存大於 10</Stock>
                ) : product.product_stock === 0 ? (
                    <Stock style={{color:"rgb(173 62 74)"}}>已售完，無法購買</Stock>
                ) : (
                    <Stock style={{color:"rgb(173 62 74)"}}>{`剩餘數量 ${product.product_stock}`}</Stock>
                )}
            </ItemGroup>

            <ItemGroup style={{marginTop:"20px"}}>
                <Label>數量：</Label>
                <QuantitySelector>
                    <QuantityButton onClick={handleDecrease}>－</QuantityButton>
                    <QuantityInput type="text" value={quantity} readOnly />
                    <QuantityButton onClick={handleIncrease}>＋</QuantityButton>
                </QuantitySelector>
            </ItemGroup>
            <ItemGroup>
                <Label>提醒：</Label>
                <ProductDescription>本平台僅支援信用卡付款，並提供配送至您指定的地址。若您相同此交易方式再進行購買，我們將提供快捷的信用卡結帳和郵寄服務，感謝您的惠顧。</ProductDescription>

            </ItemGroup>
            
          <ButtonGroup>
            <Button disabled={product.product_stock === 0}>
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white', fontSize: '24px' }} />
                <ButtonLabel onClick={() =>             handleAddToCart(
                    product.product_id, 
                    product.product_title,
                    product.product_discount, 
                    quantity)}
                    >加入購物車
                </ButtonLabel>                   
            </Button>
            <Button>
                <FontAwesomeIcon icon={faHeart} style={{ color: 'white', fontSize: '24px' }} />
                <ButtonLabel onClick={() => handleFavorite(product.product_id)}>收藏商品</ButtonLabel>    
            </Button>
          </ButtonGroup>
        </ProductDetails>
        </>
        ) : (
            <p>Loading...</p>
        )}
      </Container>
    </Root>
  );
};