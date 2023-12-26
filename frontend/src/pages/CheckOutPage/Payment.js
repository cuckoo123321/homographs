import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import CheckOutNav from './CheckOutNav';
import { getOrderById, sendPaymentInfo } from '../../WebAPI';
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
  background-color: #fff;
  padding: 30px;
  border: 1px solid #ddd; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${MEDIA_QUERY_TABLET} {
    width: 500px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 400px; 
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
`;

const LoadingMessage = styled.p`
  color: rgba(47, 150, 169);
  font-size: 20px;
`;

//付款部分

const PaymentContainer = styled.div`
  width: 780px;
  margin-top: 30px;
  margin-bottom: 200px;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #ddd; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${MEDIA_QUERY_TABLET} {
    width: 500px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 400px; 
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  &:first-child{
    justify-content: space-between;
  }
  ${MEDIA_QUERY_TABLET} {
    flex-direction: column;
  }
  ${MEDIA_QUERY_MOBILE} {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin: 0 20px 20px 0;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Info = styled.p`
  color: rgb(205 84 113);
  font-weight: 500;
  font-size: 16px;
  text-align: start;
  ${MEDIA_QUERY_TABLET} {
    margin-bottom: -10px;
  }
  ${MEDIA_QUERY_MOBILE} {
    margin-bottom: -10px;
  }
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Button = styled.button`
  background-color: rgba(47, 150, 169);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  width: 100px;
  margin:-10px 0 -20px 20px;
  &:hover{
    background: rgb(35 112 128);
  }
  ${MEDIA_QUERY_TABLET} {
    margin-top: 20px;
  }
  ${MEDIA_QUERY_MOBILE} {
    margin-top: 20px;
  }
`;

const CancelButton = styled.button`
  background-color: rgb(200 200 200);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  width: 100px;
  margin: -10px 0 -20px 20px;
  &:hover{
    background: rgb(145 145 145);
  }
  ${MEDIA_QUERY_TABLET} {
    margin-top: 10px;
  }
  ${MEDIA_QUERY_MOBILE} {
    margin-top: 10px;
  }
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: wait;
  z-index: 9999; /* 設置高於其他元素 */
`

const PaymentLoadingMessage = styled.div`
  width: 400px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  background: #333;
  border-radius: 8px;
  cursor: wait;
`;

export default function Payment () {
    const location = useLocation();
    const navigate = useNavigate();
    const { order_id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [paymentResponse, setPaymentResponse] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expirationYear, setExpirationYear] = useState('');
    const [expirationMonth, setExpirationMonth] = useState('');
    const [cvv, setCvv] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
      const fetchOrderData = async () => {
        try {
          // 發送 API 請求
          const response = await getOrderById(order_id);

          const rawOrderDate = response.data.order_date;
      
          // 格式化日期
          const formattedOrderDate = new Date(rawOrderDate).toLocaleString('zh-TW', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
          
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

    const handleChange = (e) => {
      const inputValue = e.target.value.replace(/\D/g, ''); // 移除非數字字符
  
      // 將數字每四個分隔
      const formattedValue = inputValue.replace(/(\d{4})/g, '$1-');
      
      // 移除可能的末尾分隔符
      const finalValue = formattedValue.replace(/-$/, '');
  
      setCardNumber(finalValue);
    };
    

    const generateYearOptions = () => {
      const currentYear = new Date().getFullYear();
      const years = [];
    
      for (let i = 0; i < 10; i++) {
        years.push(currentYear + i);
      }
    
      return years;
    };
  
    // const handlePayment = async () => {
    //   try {
    //     // 確保 orderData 不為空
    //     if (!orderData) {
    //       console.error('Order data is empty.');
    //       return;
    //     }
    //     console.log('前端 order_id',order_id)
    //     console.log('前端 orderData', orderData)
    //     // 呼叫 createPayment API 並傳遞 orderData
    //     const paymentResponse = await createPayment(order_id, orderData);
    //     console.log('Payment response:', paymentResponse);
  
    //     // 根據需求處理付款 API 的回應，例如導向到付款頁面等等
    //     // 將 HTML 字符串設置為 state
    //   setPaymentResponse(paymentResponse);
    //   } catch (error) {
    //     console.error('Error creating payment:', error);
    //   }
    // };  
    
    const handleSubmit = async (e) => {
      e.preventDefault();

       // 檢查是否所有欄位都填寫
       if (
        !cardNumber ||
        !expirationYear ||
        !expirationMonth ||
        !cvv
      ) {
        window.alert('欄位不可空白');
        return;
      }

      const confirmPayment = window.confirm('確認付款？');
      if (!confirmPayment) {
        return;
      }
  
      try {
        // 獲取表單數據
        const { user_id, order_id } = orderData;
  
        if (confirmPayment) {
          // 顯示交易處理中畫面
          setProcessing(true);
  
          // 發送支付信息到後端
          const paymentResponse = await sendPaymentInfo({
            user_id: user_id,
            order_id: order_id,
            cardNumber: cardNumber.replace(/\D/g, ''), // 移除非數字字符
            expirationYear: expirationYear,
            expirationMonth: expirationMonth,
            cvv: cvv,
          });
          
          // 處理支付結果
          setPaymentResponse(paymentResponse);
  
          // 根據支付結果執行相應操作
          if (paymentResponse.success) {
            const payment_id = paymentResponse.data.payment_id;
            // 支付成功，可能需要進行頁面跳轉等操作
            setTimeout(() => {
              // 5秒後隱藏交易處理中畫面並跳轉
              setProcessing(false);
              navigate(`/paymentCompleted/${order_id}/${payment_id}`);
            }, 5000);
          } 
          else {
            const payment_id = paymentResponse.data.payment_id;
            // 支付失敗，顯示錯誤信息等
            console.error('支付失敗:', paymentResponse.error);
            setTimeout(() => {
              // 5秒後隱藏交易處理中畫面並跳轉
              setProcessing(false);
              navigate(`/paymentCompleted/${order_id}/${payment_id}`);
            }, 5000);
          }
        } 
      } catch (error) {
        const payment_id = paymentResponse.data.payment_id;
        console.error('提交支付時出錯:', error);
        // 處理錯誤，顯示錯誤信息等
        setTimeout(() => {
          // 5秒後隱藏交易處理中畫面並跳轉
          setProcessing(false);
          navigate(`/paymentCompleted/${order_id}/${payment_id}`);
        }, 5000);
      }
    };
    
    const handleCancel = () => {
      const confirmCancel = window.confirm('取消交易後，該筆訂單將不成立，並將畫面導向首頁，是否仍確定取消交易？');
      
      if (!confirmCancel) {
        return;
      }else{
        navigate('/');
      }
    };

   
    return (
        <Root>
           <CheckOutNav location={location} /> 

           <OrderDetailsContainer>
            {orderData ? (
              <div>
                <OrderHeading>訂單詳情</OrderHeading>
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
                </tbody>
              </Table>
              </div>
            ) : (
              <LoadingMessage>加載中...</LoadingMessage>
            )}
          </OrderDetailsContainer>

           <PaymentContainer>
            <Form onSubmit={handleSubmit}>
            <Row>              
              <FormGroup>
                <Label htmlFor="cardNumber" style={{width: '100px'}}>信用卡號碼：</Label>
                <Input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder='1234-5678-9101-1121'
                  value={cardNumber}
                  //onChange={handleChange}
                  onChange={(e) => {
                    setCardNumber(e.target.value);
                    handleChange(e);                    
                  }}
                  
                  maxLength="19" // 限制最大長度，包括分隔符
                  required
                />
              </FormGroup>
          
              <FormGroup>
                <Label htmlFor="expirationYear" style={{width: '100px'}}>有效期限：</Label>
                <Select id="expirationYear" name="expirationYear" onChange={(e) => setExpirationYear(e.target.value)} required>
                  <option value="">年</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
                <Label>／</Label>
                <Select id="expirationMonth" name="expirationMonth" onChange={(e) => setExpirationMonth(e.target.value)} required>
                  <option value="">月</option>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => (
                    <option key={month} value={month < 10 ? `0${month}` : `${month}`}>
                      {month}
                    </option>
                  ))}
                </Select>                             
              </FormGroup>
              <FormGroup>
                <Label htmlFor="cvv">CVV：</Label>
                <Input
                  type="text"
                  id="cvv"
                  name="cvv"
                  maxLength="3"
                  placeholder="123"
                  onChange={(e) => setCvv(e.target.value)}
                  required
                  style={{width:'50px'}}
                />
              </FormGroup>
            </Row>

            <Row style={{justifyContent: 'space-between'}}>
              <FormGroup><Info>✻請填寫測試卡號：1234-5678-9101-1121</Info></FormGroup>
              <FormGroup><Info>✻測試有效期限：2026／01</Info></FormGroup>
              <FormGroup><Info>✻測試CVV:123</Info></FormGroup>
            </Row>
          
            <Row style={{justifyContent: 'end'}}>
              <FormGroup><CancelButton onClick={handleCancel}>取消交易</CancelButton></FormGroup>
              <FormGroup><Button type="submit">立即付款</Button></FormGroup>  
            </Row>
            </Form>   
           </PaymentContainer>  
           {processing && (
            <FullScreenOverlay>
              <PaymentLoadingMessage>交易處理中，請稍候...</PaymentLoadingMessage>
            </FullScreenOverlay>
          )}
        </Root>
        
    
    );
  };
  