import React from 'react';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { getCart, updateCartQuantity, deleteCartItem } from '../../WebAPI';
import { AuthContext } from '../../contexts'; //存儲和共享身份驗證相關資訊的上下文
import { MEDIA_QUERY_MOBILE } from '../../constants/style';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  z-index: 1000; 
`;

const CloseMark = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  font-size: 28px;
  color: rgb(173 62 74); 
  text-align: center;
  z-index: 1001; 

  &:hover{
    background-color: rgba(255, 255, 255, 0.7);
  }
`;

const PopoverContainer = styled.div`
  width: 780px;
  max-height: 100%; /* 設定最大高度 */
  overflow-y: auto; /* 超過高度時顯示垂直卷軸 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  cursor: auto;
  z-index: 1001; /*蓋在overlay之上*/

  ${MEDIA_QUERY_MOBILE} {
    width: 300px;
  }
`;

const Title = styled.div`
    color: rgba(47, 150, 169);
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  ${MEDIA_QUERY_MOBILE} {
    font-size: 12px;
  }
`;

const TableHead = styled.tr`
  border-bottom: 1px solid #ddd;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  ${MEDIA_QUERY_MOBILE} {
    font-size: 14px;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 10px;
  color: rgb(60, 60, 60);

`;

const QuantityCell = styled(TableCell)`
  display: flex;
  align-items: center;
`;

const QuantityButton = styled.button`
    border: none;
    border-radius: 3px;
    background: rgba(47, 150, 169, 0.3);
    text-align: center;
    cursor: pointer;
    font-size: 18px;
    ${MEDIA_QUERY_MOBILE} {
      display: none;
    }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  border: 1px solid rgba(47, 150, 169);
  border-radius: 3px;
  margin: 0 8px;
  ${MEDIA_QUERY_MOBILE} {
    width: 30px;
  }
`;

const RemoveButton = styled.button`
  background-color: #fff;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
`;

const PriceButtonContainer = styled.div`
  width: 720px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${MEDIA_QUERY_MOBILE} {
    width: 250px;
    flex-direction: column;
    justify-content: start;
  }
`;

const TotalPrice = styled.div`
    color: rgb(173 62 74);
    font-size: 20px;
`;

const Alert = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const CheckoutButton = styled.button`
  background-color: rgba(47, 150, 169);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  width: 200px;
  margin-top:20px;
  letter-spacing: 1rem;
  &:hover{
    background: rgb(35 112 128);
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 100px;
    height:30px;
    font-size: 20px;
    text-align: center;
    padding: 0 0 0 8px;;
  }
`;

export default function ShoppingCartPopover () {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const { user } = useContext(AuthContext);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [ cartItemsCount, setCartItemsCount] = useState(0);

    //防止一按到頁面就關閉
    const stopPropagation = (e) => {
        e.stopPropagation();
      };

    useEffect(() => {
      // 確保 user 存在
      if (user) {
        getCart(user.user_id, user.token)
          .then((response) => {
            // 檢查 response 中的 success，確保成功取得資料
            if (response.success) {
              // 將購物車內容設定為 response.data
              setCartItems(response.data);
              // 計算總價
              const total = response.data.reduce((acc, item) => acc + item.product_discount * item.quantity, 0);
              setTotalCartPrice(total);
            } else {
              console.error('Failed to get cart items:', response.error);
            }
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
      }
    }, [user]);

    //改變數量
    const handleQuantityChange = async (productId, newQuantity) => {
      try {

        // 判斷新數量是否合法
        if (newQuantity < 1) {
          alert('數量不能小於1');
          return;
        }
    
        // 判斷新數量是否超過庫存
        const product = cartItems.find((item) => item.product_id === productId);
        if (newQuantity > product.product_stock) {
          alert('購買數量超過庫存');
          return;
        }
    
        // 使用 API 更新購物車中商品的數量
        const response = await updateCartQuantity(user.user_id, productId, newQuantity, user.token);
    
        if (response.success) {
          // 更新本地購物車數據
          const updatedCartItems = cartItems.map((item) =>
            item.product_id === productId ? { ...item, quantity: newQuantity } : item
          );
          setCartItems(updatedCartItems);

          // 計算新的總金額
          const newTotalCartPrice = updatedCartItems.reduce((total, item) => {
            return total + item.product_discount * item.quantity;
          }, 0);
          setTotalCartPrice(newTotalCartPrice);
        } else {
          console.error('Failed to update cart quantity:', response.error);
          alert('更新購物車數量失敗');
        }
      } catch (error) {
        console.error('Error handling quantity change:', error);
      }
    };
    
    // 從購物車移除商品
    const handleRemoveItems = async ({ product_id, product_discount, quantity }) => {
      try {
        // 判斷是否有使用者登入
        if (!user) {
          alert('請先登入會員');
          navigate("/login");
          return;
        }

        // 確認是否移除商品
        const confirmRemove = window.confirm('確定將該商品購物車中移除？');
        if (!confirmRemove) {
          return;
        }

        // 使用 deleteCartItem API 刪除購物車商品
        const response = await deleteCartItem(user.user_id, product_id);

        // 判斷 deleteCartItem API 的回傳是否成功
        if (response.success) {
          // 更新本地購物車數據，刪除對應商品
          const updatedCartItems = cartItems.filter((item) => item.product_id !== product_id);
          setCartItems(updatedCartItems);

          // 計算新的總金額
          const newTotalCartPrice = updatedCartItems.reduce((total, item) => {
            return total + item.product_discount * item.quantity;
          }, 0);
          setTotalCartPrice(newTotalCartPrice);

          // 更新購物車數量
          setCartItemsCount((prevCount) => prevCount - 1);
        } else {
          console.error('移除購物車商品失敗:', response.error);
          alert('移除購物車商品失敗');
        }
      } catch (error) {
        console.error('Error handling remove items:', error);
      }
    };
  
    const handleCheckoutClick = (e) => {

      // 提示警告
    const isConfirmed = window.confirm('確定結帳？請關閉購物車，進入結帳頁面');
      // 如果用戶確定，導向結帳頁面
      if (isConfirmed) {
        navigate("/checkOut");
      } else {
        // 如果用戶取消，防止事件冒泡
        e.stopPropagation();
      }
    };
    
    return (
      <Overlay>
        <CloseMark>✕</CloseMark>
        <div onClick={stopPropagation}>
          <PopoverContainer>
            <Title>購物車清單</Title>
            
              {cartItems.length === 0 ? (
                <Alert>購物車是空的</Alert>
              ) : (
                <>
                <Table>
                  <thead>
                    <TableHead>
                      <TableCell>商品</TableCell>
                      <TableCell>數量</TableCell>
                      <TableCell>單價</TableCell>
                      <TableCell>小計</TableCell>
                      <TableCell>移除</TableCell>
                    </TableHead>
                  </thead>
                  <tbody>
                    {cartItems.map((product) => (
                      <TableRow key={product.product_id}>
                        <TableCell>{product.product_title}</TableCell>
                        <QuantityCell>
                          <QuantityButton
                            onClick={() => handleQuantityChange(product.product_id, product.quantity - 1)}
                            disabled={product.quantity <= 1}
                          >
                            －
                          </QuantityButton>
                          <QuantityInput
                            type="text"
                            value={product.quantity}
                            readOnly
                          />

                          <QuantityButton
                            onClick={() => handleQuantityChange(product.product_id, product.quantity + 1)}
                            disabled={product.quantity >= product.product_stock}
                          >
                            ＋
                          </QuantityButton>
                        </QuantityCell>
                        <TableCell>{`NT${product.product_discount.toLocaleString()}元`}</TableCell>
                        <TableCell style={{ color: "rgb(173 62 74)" }}>{`NT${(product.product_discount * product.quantity).toLocaleString()}元`}</TableCell>
                        <TableCell>
                          <RemoveButton onClick={() => handleRemoveItems(product)}>
                            <FontAwesomeIcon icon={faTrashCan} style={{ color: 'rgb(202, 74, 88,0.9)', fontSize: '24px' }} />
                          </RemoveButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
                  <PriceButtonContainer>
                    <TotalPrice>總價 NT{totalCartPrice.toLocaleString()} 元</TotalPrice>
                    <CheckoutButton onClick={handleCheckoutClick}>結帳</CheckoutButton>
                  </PriceButtonContainer>
                </>
              )}   
          </PopoverContainer>
        </div>
      </Overlay>
    );
  };
  