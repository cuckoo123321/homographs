import React from 'react';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointRight, faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import CheckOutNav from './CheckOutNav';
import { addRecipient, getOrderById } from '../../WebAPI';
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

//填寫收件人資料
const ShippingAddressContainer = styled.div`
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
  margin-top: 20px;
`;


const FormGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 20px;

  label {
    margin-bottom: 8px;
  }

  .required-star {
    color: red;
    margin-left: 4px;
  }

  input,
  select,
  date {
    padding: 8px;
  }
`;

const Label = styled.label`
  width: 60px;
  display: block;
  margin: 10px 0px 20px 0px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
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
  margin:20px 0 0 520px;
  &:hover{
    background: rgb(35 112 128);
  }
  ${MEDIA_QUERY_TABLET} {
    margin:20px 0 0 130px;
  }
  ${MEDIA_QUERY_MOBILE} {
    margin:20px 0 0 80px;
  }
`;

export default function ShippingAddress () {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { order_id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [recipient_name, setRecipientName] = useState('');
    const [recipient_phone, setRecipientPhone] = useState('');
    const [recipient_residence, setRecipientResidence] = useState('');
    const [recipient_address, setRecipientAddress] = useState('');

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

    const handleSubmit = async (e) => {
      e.preventDefault();
      // 檢查是否所有欄位都填寫
      if (
        !recipient_name ||
        !recipient_phone ||
        !recipient_residence ||
        !recipient_address
      ) {
        window.alert('欄位不可空白');
        return;
      }

      const isConfirmed = window.confirm('確認收件者資料填寫無誤？');
      if (!isConfirmed) {
        return;
      }

      try {
        const response = await addRecipient(
          user.user_id,
          user.user_name,
          orderData.order_number,
          recipient_name,
          recipient_phone,
          recipient_residence,
          recipient_address
        );
  
        if (response.success) {          
          // 在這裡可以做一些成功後的處理，例如清空表單、顯示成功訊息等
          window.alert('新增收件者資料成功，前往付款頁面');
          navigate(`/payment/${orderData.order_id}`); // 傳遞訂單 ID 給 payment 頁面
        } else {
          console.error('新增收件者資料失敗:', response.error);
          // 在這裡可以做一些失敗後的處理，例如顯示錯誤訊息等
        }
      } catch (error) {
        console.error('新增收件者資料時發生錯誤:', error);
        // 在這裡可以做一些錯誤處理，例如顯示錯誤訊息等
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
                    <TableCell style={{color:'rgb(205 84 113)'}}>{orderData.order_number}</TableCell>
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
                    <TableCell>總價</TableCell>
                    <TableCell>NT {orderData.order_price} 元</TableCell>
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

           <ShippingAddressContainer>

           <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="recipient_name">姓名：</Label>
            <Input
              type="text"
              name="recipient_name"
              value={recipient_name}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="請填寫收件人姓名"
              required="required"
            />
          </FormGroup>
          
          
          <FormGroup>
            <Label htmlFor="recipient_phone">電話：</Label>
            <Input 
              type="text" 
              name="recipient_phone"
              value={recipient_phone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="09XX-XXX-XXX" 
              required="required" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="recipient_residence">地區：</Label>
            <select 
              className="form-select" 
              name="recipient_residence" 
              value={recipient_residence}
              onChange={(e) => setRecipientResidence(e.target.value)}
              required="required">
              <option value="" selected disabled>
                請選擇居住地區
              </option>
                <option value="Taipei">台北市</option>
                <option value="New Taipei">新北市</option>
                <option value="Keelung">基隆市</option>
                <option value="Yilan">宜蘭縣</option>
                <option value="Hsinchu">新竹市</option>
                <option value="Miaoli">苗栗縣</option>
                <option value="Taoyuan">桃園市</option>
                <option value="Taichung">台中市</option>
                <option value="Changhua">彰化縣</option>
                <option value="Nantou">南投縣</option>
                <option value="Yunlin">雲林縣</option>
                <option value="Chiayi">嘉義市</option>
                <option value="Tainan">台南市</option>
                <option value="Kaohsiung">高雄市</option>
                <option value="Pingtung">屏東縣</option>
                <option value="Taitung">台東縣</option>
                <option value="Hualien">花蓮縣</option>
                <option value="Penghu">澎湖縣</option>
                <option value="Kinmen">金門縣</option>
                <option value="Lienchiang">連江縣</option>
                <option value="Other">其他</option>
            </select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recipient_address">地址：</Label>
            <Input
              type="text"
              name="recipient_address"
              value={recipient_address}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="請填寫商品配送地址"
              required="required"
            />
          </FormGroup>
          {/* <Button onClick={navigateToCheckOut}>
                <FontAwesomeIcon icon={faHandPointLeft} style={{color: "#fff", fontSize: "20px", marginRight: "10px"}} /> 
                回上一步                   
            </Button> */}
            <Button type="submit">
                確認，下一步
                <FontAwesomeIcon icon={faHandPointRight} style={{color: "#fff", fontSize: "20px", marginLeft: "10px"}} />             
            </Button>
        </Form>
            
           </ShippingAddressContainer>  
        </Root>
        
    
    );
  };
  