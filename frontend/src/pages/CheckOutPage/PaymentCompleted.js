import React from 'react';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import CheckOutNav from './CheckOutNav';
import { getOrderById, getPaymentResult } from '../../WebAPI';
import { AuthContext } from '../../contexts';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET } from '../../constants/style'; 

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

//訂單內容
const OrderDetailsContainer = styled.div`
  width: 780px;
  margin-top: 30px;
  margin-bottom: 200px;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #ddd; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${MEDIA_QUERY_TABLET} {
    width: 450px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 300px; 
  }
`;

const OrderHeading = styled.h2`
  color: rgba(47, 150, 169);
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const TableRow = styled.tr`
  border: 1px solid #ddd;
`;

const TableCell = styled.td`
  padding: 8px;
  border: 1px solid #ddd;
  ${MEDIA_QUERY_MOBILE} {
    font-size: 14px; 
  }
`;

const LoadingMessage = styled.p`
  color: rgba(47, 150, 169);
  font-size: 20px;
`;

const Button = styled.button`
    background-color: rgba(47, 150, 169);
    color: #fff;
    font-weight: bold;
    border: none;
    border-radius: 5px;
    padding: 8px;
    cursor: pointer;
    width: 200px;
    margin: 20px 0 0 20px;
    &:hover{
    background: rgb(35 112 128);
    }
`;

export default function PaymentCompleted () {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { order_id, payment_id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [paymentResult, setPaymentResult] = useState(null);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const fetchOrderData = async () => {
          try {
            // 發送 API 請求
            const response = await getOrderById(order_id);
  
            const formattedOrderDate = formatDate(response.data.order_date);
            
            // 更新組件的狀態，顯示訂單資料
            setOrderData({
              ...response.data,
              formattedOrderDate: formattedOrderDate,
            });
  
          } catch (error) {
            console.error('獲取訂單數據時出錯:', error);
            // 處理錯誤情況，例如顯示錯誤提示
          }
        };

      fetchOrderData();
    }, [order_id]);

    useEffect(() => {
        const fetchPaymentResult = async () => {
          try {
            // 發送 API 請求，獲取支付結果
            const paymentResultResponse = await getPaymentResult(payment_id);

            const formattedPaymentDate = formatDate(paymentResultResponse.data.payment_created_at);

    
            // 更新組件的狀態，顯示訂單數據
            setPaymentResult({
              ...paymentResultResponse.data,
              formattedPaymentDate: formattedPaymentDate,
            });
    
          } catch (error) {
            console.error('獲取支付結果時出錯:', error);
            // 處理錯誤情況，例如顯示錯誤提示
          }
        };
        fetchPaymentResult();
    
      }, [payment_id]);   
    

      const formatDate = (rawDate) => {
        const options = {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };
      
        return new Date(rawDate).toLocaleString('zh-TW', options);
      };
      
      const handleToHomePage = () => {
          navigate('/');
      };

      const handleToOrderList = () => {
        navigate(`/orderList/${user.user_id}`);
     };

    return (
        <Root>
            <CheckOutNav location={location} /> 
            <OrderDetailsContainer>
            {orderData && paymentResult?  (
              <div>
                <OrderHeading>交易結果</OrderHeading>
                <Table>
                <tbody>
                  <TableRow>
                    <TableCell>訂單編號</TableCell>
                    <TableCell>{orderData.order_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>訂單內容</TableCell>
                    <TableCell>{orderData.order_products}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>運費</TableCell>
                    <TableCell>NT {orderData.order_shipping_fee} 元</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>交易金額</TableCell>
                    <TableCell style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>NT {orderData.order_price} 元</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>訂單提交時間</TableCell>
                    <TableCell>{orderData.formattedOrderDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell  style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>付款狀態</TableCell>
                    <TableCell  style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>{paymentResult.is_paid ? '已付款' : '未成功付款'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>付款時間</TableCell>
                    <TableCell>{paymentResult.formattedPaymentDate}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>出貨狀態</TableCell>
                    <TableCell>{paymentResult.is_delivered}</TableCell>
                  </TableRow>  
                  <TableRow>
                    <TableCell style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>交易結果</TableCell>
                    <TableCell style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>{paymentResult.is_success ? '交易成功': '交易失敗'}</TableCell>
                  </TableRow>                  
                </tbody>
              </Table>
              </div>
            ) : (
              <LoadingMessage>加載中...</LoadingMessage>
            )}
            <Button onClick={handleToHomePage}>回首頁</Button>
            <Button onClick={handleToOrderList}>查看訂單列表</Button>
          </OrderDetailsContainer>
        </Root>
        
    
    );
  };
  