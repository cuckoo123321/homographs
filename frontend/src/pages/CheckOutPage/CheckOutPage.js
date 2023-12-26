import React from 'react';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import CheckOutNav from './CheckOutNav';
import { getCart, updateCartQuantity, deleteCartItem, createOrder, updateProductStock, getProductById } from '../../WebAPI';
import { AuthContext } from '../../contexts'; //存儲和共享身份驗證相關資訊的上下文
import { MEDIA_QUERY_MOBILE } from '../../constants/style';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

const CheckOutContainer = styled.div`
  width: 780px;
  max-height: 600px; /* 設定最大高度 */
  overflow-y: auto; /* 超過高度時顯示垂直卷軸 */
  margin-top: 30px;
  margin-bottom: 200px;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #ddd; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${MEDIA_QUERY_MOBILE} {
    width: 400px;
  }
`;

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;
const ProductTableRow = styled.tr`
  border-bottom: 1px solid #ddd;
`;

const ProductTableHeader = styled.th`
    padding: 10px;
    color: rgb(60, 60, 60);
    font-size: 20px;
`;

const ProductTableCell = styled.td`
    padding: 10px;
    color: rgb(60, 60, 60);
`;

const RemoveButton = styled.button`
  background-color: #fff;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuantityButton = styled.div`
    width:20px;
    border: none;
    border-radius: 3px;
    background: rgba(47, 150, 169, 0.3);
    text-align: center;
    cursor: pointer;
`;

const QuantityInput = styled.input`
  width: 40px;
  text-align: center;
  border: 1px solid rgba(47, 150, 169);
  border-radius: 3px;
  margin: 0 8px;
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
const TotalPrice = styled.div`
    color: rgb(173 62 74);
    font-size: 22px;
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
  &:hover{
    background: rgb(35 112 128);
  }
`;

export default function CheckOutPage () {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [totalCartPrice, setTotalCartPrice] = useState(0);
    const [ cartItemsCount, setCartItemsCount] = useState(0);
    

    useEffect(() => {
      // 確保 user 存在
      if (user) {
        getCart(user.user_id, user.token)
          .then((response) => {
            // 檢查 response 中的 success，確保成功取得資料
            if (response.success) {
              // 將內容設定為 response.data
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
    
        // 使用 API 更新商品的數量
        const response = await updateCartQuantity(user.user_id, productId, newQuantity, user.token);
    
        if (response.success) {
          // 更新本地數據
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
          alert('更新數量失敗');
        }
      } catch (error) {
        console.error('Error handling quantity change:', error);
      }
    };
    
    // 移除商品
    const handleRemoveItems = async ({ product_id, product_discount, quantity }) => {
      try {
        // 判斷是否有使用者登入
        if (!user) {
          alert('請先登入會員');
          navigate("/login");
          return;
        }

        // 確認是否移除商品
        const confirmRemove = window.confirm('確定移除該商品？');
        if (!confirmRemove) {
          return;
        }

        // 使用 deleteCartItem API 刪除商品
        const response = await deleteCartItem(user.user_id, product_id);

        // 判斷 deleteCartItem API 的回傳是否成功
        if (response.success) {
          // 更新本地數據，刪除對應商品
          const updatedCartItems = cartItems.filter((item) => item.product_id !== product_id);
          setCartItems(updatedCartItems);

          // 計算新的總金額
          const newTotalCartPrice = updatedCartItems.reduce((total, item) => {
            return total + item.product_discount * item.quantity;
          }, 0);
          setTotalCartPrice(newTotalCartPrice);

          // 更新數量
          setCartItemsCount((prevCount) => prevCount - 1);
        } else {
          console.error('移除商品失敗:', response.error);
          alert('移除商品失敗');
        }
      } catch (error) {
        console.error('Error handling remove items:', error);
      }
    };


    const handleCreateOrder = async () => {
      try {
        // 1. 自動生成訂單編號
        const order_number = generateOrderNumber();
    
        // 2. 獲取商品標題和購買數量
        const productTitlesWithQuantity = cartItems.map((item) => `${item.product_title} X ${item.quantity}`);
    
        // 3. 計算運費
        const totalCartPrice = cartItems.reduce((total, item) => {
          return total + item.product_discount * item.quantity;
        }, 0);
    
        const order_shipping_fee = totalCartPrice > 1000 ? 0 : 100;
    
        // 4. 計算 TotalOrderPrice
        const totalOrderPrice = totalCartPrice + order_shipping_fee;

        // 5. 提示彈窗
        const message = `本次消費金額為 NT ${totalCartPrice} 元，運費為 NT ${order_shipping_fee} 元（滿千免運），訂單成立後即無法修改，是否確定送出訂單？`;
    
        if (window.confirm(message)) {
          // 6. 存進 orders         
          const response = await createOrder(user.user_id, order_number, productTitlesWithQuantity.join(', '), order_shipping_fee, totalOrderPrice);
    
          if (response.success) {
            // 7. 更新庫存
            const updateStockRequests = await Promise.all(cartItems.map(async (item) => {
              // 使用 getProductById 取得商品資訊
              const productData = await getProductById(item.product_id);
              const product = await productData.json(); // 轉換為 JSON 格式
            
              // 檢查商品庫存
              if (product && product.product_stock === 0) {
                alert(`商品 ${product.product_title} 已售完，無法購買`);
                return null;
              }
            
              const newStock = product.product_stock - item.quantity;
              return {
                productId: item.product_id,
                newStock: newStock,
              };
            }));

            // 使用 Promise.all 等待所有更新庫存的請求完成
            const updateStockResponses = await Promise.all(
              updateStockRequests.map(async (request) => {
                if (request !== null) {
                  return await updateProductStock(request.productId, request.newStock);
                }
                return null;
              })
            );

            // 檢查是否有更新庫存失敗的情況
            const hasFailedStockUpdate = updateStockResponses.some((response) => response && !response.success);

            if (hasFailedStockUpdate) {
              console.error('更新商品庫存失敗');
              alert('更新商品庫存失敗');
              return;
            }


             // 9. 更新庫存成功，刪除購物車中的相關資料
            await Promise.all(
              cartItems.map(async (item) => {
                const deleteResponse = await deleteCartItem(user.user_id, item.product_id);
                if (!deleteResponse.success) {
                  console.error('刪除購物車商品失敗:', deleteResponse.error);
                  alert('刪除購物車商品失敗');
                }
              })
            );

            // 10. 清空本地購物車數據
            setCartItems([]);
            setTotalCartPrice(0);
            setCartItemsCount(0);

            //11.導向填寫收件人資料頁面
            navigate(`/shippingAddress/${response.data.order_id}`); // 傳遞訂單 ID 給 ShippingAddress 頁面
          } else {
            console.error('創建訂單失敗:', response.error);
            alert('創建訂單失敗');
          }
        }
      } catch (error) {
        console.error('創建訂單失敗:', error);
      }
    };
    

    // 生成訂單編號
    const generateOrderNumber = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const randomDigits = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    
      // 生成包含英文與數字的 8 碼 UID
      const uid = Math.random().toString(36).substr(2, 8);
    
      // 將字串截取前 20 個字元
      const result = `${year}${month}${day}${hours}${minutes}${seconds}${randomDigits}${uid}`.substr(0, 20);

      return result;
    };
    

    
    return (
        <Root>
           <CheckOutNav location={location} /> 

           <CheckOutContainer>                  
               
           <ProductTable>
          <thead>
            <ProductTableRow>
              <ProductTableHeader>商品名稱</ProductTableHeader>
              <ProductTableHeader>數量</ProductTableHeader>
              <ProductTableHeader>單價</ProductTableHeader>
              <ProductTableHeader>小計</ProductTableHeader>
              <ProductTableHeader>刪除</ProductTableHeader>
            </ProductTableRow>
          </thead>
          <tbody>
            {cartItems.map((product) => (
              <ProductTableRow key={product.product_id}>
                <ProductTableCell style={{textAlign: "start"}}>{product.product_title}</ProductTableCell>

                {/* 增減商品數量 */}
                <ProductTableCell>
                  <QuantityContainer>
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
                    <QuantityButton onClick={() => handleQuantityChange(product.product_id, product.quantity + 1)} disabled={product.quantity >= product.product_stock}>
                      ＋
                    </QuantityButton>
                  </QuantityContainer>
                </ProductTableCell>

                <ProductTableCell>NT {product.product_discount} 元</ProductTableCell>
                <ProductTableCell style={{color: "rgb(173 62 74"}}>NT {product.product_discount * product.quantity} 元</ProductTableCell>

                {/* 刪除按鈕 */}
                <ProductTableCell>
                  <RemoveButton onClick={() => handleRemoveItems(product)}>
                    <FontAwesomeIcon icon={faTrashCan} style={{ color: 'rgb(202, 74, 88,0.9)', fontSize: '24px' }} />
                  </RemoveButton>
                </ProductTableCell>
              </ProductTableRow>
            ))}
          </tbody>
        </ProductTable>
        <ButtonContainer>
            <TotalPrice>總價 NT{totalCartPrice.toLocaleString()} 元</TotalPrice>
            <CheckoutButton onClick={handleCreateOrder}>
                確認，下一步
                <FontAwesomeIcon icon={faHandPointRight} style={{color: "#fff", fontSize: "20px", marginLeft: "10px"}} /> 
            </CheckoutButton>
        </ButtonContainer>

        
        </CheckOutContainer>

        

        </Root>
        
    
    );
  };
  