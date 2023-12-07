import React from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1000; 
`;

const PopoverContainer = styled.div`
  width: 750px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  z-index: 1001; /*蓋在overlay之上*/
`;

const Title = styled.div`
    color: rgba(47, 150, 169);
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`;

const ProductItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: rgb(60, 60, 60);
`;
 
const ProductTitle = styled.div`
    width:300px;
`;

const ProductDiscount = styled.div`
    
`;
const ProductPrice = styled.div`
    color: rgb(173 62 74);
    &:before{
        color: rgb(60, 60, 60);
        content: '小計 '
    }
    &:after{
        color: rgb(60, 60, 60);
        content: ' 元'
    }
`;

const RemoveButton = styled.button`
  background-color: #fff;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
`;

const TotalPrice = styled.div`
    color: rgb(173 62 74);
    font-size: 20px;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-right: 20px; 
`;

const QuantityButton = styled.div`
    width:20px;
    border: none;
    border-radius: 3px;
    background: rgba(47, 150, 169, 0.3);
    text-align: center;
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid rgba(47, 150, 169);
  border-radius: 3px;
  margin: 0 8px;
`;

const Alert = styled.div`
  margin-top: -25px;
`;

const CheckoutButton = styled.button`
  background-color: rgba(47, 150, 169);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  width: 100%;
  margin-top:20px;
  letter-spacing: 1rem;
  &:hover{
    background: rgb(35 112 128);
  }
`;

export default function ShoppingCartPopover ({ cartItems, setCartItems, onRemove, onCheckout }) {

    //防止一按到頁面就關閉
    const stopPropagation = (e) => {
        e.stopPropagation();
      };

    // 計算購物車總價
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const itemPrice = item.product_discount * item.quantity;
            return total + itemPrice;
        }, 0);
    };

    useEffect(() => {
        // 在 cartItems 更新後觸發
        // 在這裡執行可能需要即時更新的邏輯
      }, [cartItems]);

      const handleQuantityChange = (productId, newQuantity) => {
        // 限制數量不小於 1
        newQuantity = Math.max(1, newQuantity);
        const updatedCartItems = cartItems.map((item) => {
          if (item.product_id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
    
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      };

    return (
        
        <Overlay>   
            <div onClick={stopPropagation}>         
             <PopoverContainer>
                    <Title>購物車清單</Title>
                {cartItems.map((item) => (                    
                    <ProductItem key={item.product_id}>
                        <ProductTitle>{item.product_title}</ProductTitle>
                        
                        {/* 增減商品數量 */}
                        <QuantityContainer>
                            <QuantityButton
                                onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                            >
                                -
                            </QuantityButton>
                            <QuantityInput
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                handleQuantityChange(item.product_id, parseInt(e.target.value, 10))
                                }
                            />
                            <QuantityButton onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}>
                                +
                            </QuantityButton>
                        </QuantityContainer>

                        <ProductDiscount>單價 {item.product_discount} 元</ProductDiscount>  
                        <ProductPrice>{item.product_discount * item.quantity}</ProductPrice>                       
                        <RemoveButton onClick={() => {
                            onRemove(item.product_id);
                            // 更新 Header.js 中的 cartItems 狀態
                            setCartItems(updatedCartItems => updatedCartItems.filter(updatedItem => updatedItem.product_id !== item.product_id));
                        }}>
                        <FontAwesomeIcon icon={faTrashCan} style={{ color: 'rgb(202, 74, 88,0.9)', fontSize: '24px' }} />
                    </RemoveButton>
                    </ProductItem>
                ))}
                {cartItems.length === 0 ? (
                    <Alert>購物車是空的</Alert>
                ) : (
                    <>
                        <TotalPrice>總價 NT {calculateTotalPrice()} 元</TotalPrice>
                        <CheckoutButton onClick={onCheckout}>結帳</CheckoutButton>
                    </>
                )}
                </PopoverContainer> 
            </div>                  
        </Overlay>
       
        
    );
  };
  