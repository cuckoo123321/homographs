import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { getAllOrdersByUserId } from '../../WebAPI';
import { MEDIA_QUERY_MOBILE } from '../../constants/style'; 

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
  margin-bottom: 200px;
`;
const OrderListTitle = styled.div`
  h1 {
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
    margin: 30px 0 10px 0;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;

const TableHeader = styled.th`
  width: 150px;
  background-color: rgb(47, 150, 169);
  color: white;
  padding: 10px;
  font-weight: bold;
  text-align: center;
  ${MEDIA_QUERY_MOBILE} {
    width: 120px; 
  }
`;

const TableRow = styled.tr`
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 16px;
  text-align: justify;
`;

const TableCell = styled.td`
  padding: 8px;
`;

const OrderContainer = styled.div`
    width: 780px;
    margin-top: 30px;
    background-color: #fff;
    padding: 30px;
    border: 1px solid #ddd; 
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    ${MEDIA_QUERY_MOBILE} {
      width: 420px; 
    }
`;

const RecipientContainer = styled.div`
  background-color: #fff;
  margin-top: 20px;
`;

const DetailsContainer = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  margin-top: 8px;
`;

const ShowDetailsButton = styled.button`
  width: 720px;
  height: 30px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  &:hover{
    background: rgba(47, 150, 169, 0.2);
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 350px; 
  }
`;

const Info = styled.span`
  margin-right: 10px;
  color: rgb(47, 150, 169);
  font-weight: bold;
`;

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const { user_id } = useParams(); // 從路由參數中取得使用者 ID

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersData = await getAllOrdersByUserId(user_id);
        // 使用 Set 來去除重複的訂單
        const uniqueOrders = Array.from(new Set(ordersData.data.map(order => order.order_id)))
        .map(orderId => ordersData.data.find(order => order.order_id === orderId));
        
        const ordersArray = Array.isArray(uniqueOrders) ? uniqueOrders : [ordersData];
        setOrders(ordersArray);

        // 初始化 detailsOpen 物件，每個訂單的預設值為 false
        const initialDetailsOpen = {};
        ordersArray.forEach(order => {
          initialDetailsOpen[order.order_id] = false;
        });
        setDetailsOpen(initialDetailsOpen);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [user_id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric',
    minute: 'numeric', second: 'numeric', };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const addressMapping = {
    Taipei: '台北市',
    'New Taipei': '新北市',
    Keelung: '基隆市',
    Yilan: '宜蘭縣',
    Hsinchu: '新竹市',
    Miaoli: '苗栗縣',
    Taoyuan: '桃園市',
    Taichung: '台中市',
    Changhua: '彰化縣',
    Nantou: '南投縣',
    Yunlin: '雲林縣',
    Chiayi: '嘉義市',
    Tainan: '台南市',
    Kaohsiung: '高雄市',
    Pingtung: '屏東縣',
    Taitung: '台東縣',
    Hualien: '花蓮縣',
    Penghu: '澎湖縣',
    Kinmen: '金門縣',
    Lienchiang: '連江縣',
    Other: '其他',
  };
  // 將英文地址轉換為中文
  const convertAddressToChinese = (englishAddress) => {
    return addressMapping[englishAddress] || englishAddress;
  };

  
    return (
        <Root>
        <OrderListTitle><h1>我的訂單列表</h1></OrderListTitle>
        {orders.map((order) => (
        <OrderContainer key={order.order_id}>
          <Table>
            <tbody>
              <TableRow>
                <TableHeader>訂單編號</TableHeader>
                <TableCell>{order.order_number}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>商品明細</TableHeader>
                <TableCell>{order.order_products}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>交易金額</TableHeader>
                  <TableCell>
                    NT {order.order_price} 元 （運費：NT {order.order_shipping_fee} 元）
                  </TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>訂單提交時間</TableHeader>
                <TableCell>{formatDate(order.order_date)}</TableCell>
              </TableRow>
            </tbody>
          </Table>

          <ShowDetailsButton onClick={() => setDetailsOpen(prevState => ({ ...prevState, [order.order_id]: !prevState[order.order_id] }))}>
            <Info>
                {detailsOpen[order.order_id] ? '隱藏詳細資訊' : '顯示詳細資訊'}
            </Info>
            {detailsOpen[order.order_id] ? <FontAwesomeIcon icon={faAngleUp} style={{color: 'rgb(47, 150, 169)'}}/> : <FontAwesomeIcon icon={faChevronDown} style={{color: 'rgb(47, 150, 169)'}}/>}
          </ShowDetailsButton>

          <DetailsContainer isOpen={detailsOpen[order.order_id]}>
            {order.recipient && (
              <RecipientContainer key={order.recipient.recipient_id}>
                <Table>
                <tbody>
                    <TableRow>
                    <TableHeader>收件人姓名</TableHeader>
                    <TableCell>{order.recipient.recipient_name}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableHeader>聯絡電話</TableHeader>
                    <TableCell>{order.recipient.recipient_phone}</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableHeader>收件地址</TableHeader>
                    <TableCell>{convertAddressToChinese(order.recipient.recipient_residence)} {order.recipient.recipient_address}</TableCell>
                    </TableRow>
                </tbody>
                </Table>
              </RecipientContainer>
            )}
            {order.payment && (
            <RecipientContainer key={order.payment.payment_id}>
              <Table>
                <tbody>
                  <TableRow>
                    <TableHeader>付款狀態</TableHeader>
                    <TableCell>{order.payment.is_paid ? '已付款' : '付款失敗'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>付款時間</TableHeader>
                    <TableCell>{formatDate(order.payment.payment_created_at)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>出貨狀態</TableHeader>
                    <TableCell>{order.payment.is_delivered}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHeader>訂單狀態</TableHeader>
                    <TableCell style={{color:'rgb(205 84 113)', fontWeight: 'bold'}}>{order.payment.is_success ? '訂單成立' : '訂單未成立'}</TableCell>
                  </TableRow>
                </tbody>
              </Table>
            </RecipientContainer>
          )}
          </DetailsContainer>
        </OrderContainer>
      ))}
      </Root>
    );
  };