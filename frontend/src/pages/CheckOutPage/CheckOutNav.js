import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faHouse, faCreditCard, faCircleCheck, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getOrderById } from '../../WebAPI';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET } from '../../constants/style';

const Nav = styled.ul`
  list-style: none;
  display: flex;
  padding: 5px;
  margin-top:100px;
`;

const NavItem = styled.li`
  margin-right: 20px;  
  ${MEDIA_QUERY_TABLET} {
    margin-right: 0px; 
  }
  ${MEDIA_QUERY_MOBILE} {
    margin-right: 0px; 
  }
`;

const Arrow = styled.div`
  color: rgb(47, 150, 169);
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;


const NavLink = styled(Link)`
  text-decoration: none;
  color: rgb(47, 150, 169);
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  cursor: auto;
  
  ${(props) =>
    props.$active && `
      color: rgb(205 83 112);
    `}
  
  ${MEDIA_QUERY_TABLET} {
    font-size: 20px;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 16px;
  }
`;

export default function CheckOutNav ({ location }) {
    const { order_id, payment_id } = useParams();
    const [orderData, setOrderData] = useState(null);


    useEffect(() => {
        const fetchOrderData = async () => {
          try {
            // 發送 API 請求
            const response = await getOrderById(order_id);
            // 更新組件的狀態，顯示訂單資料
            setOrderData(response.data); 
  
          } catch (error) {
            console.error('獲取訂單數據時出錯:', error);
            // 處理錯誤情況，例如顯示錯誤提示
          }
        };
    
        fetchOrderData();
      }, [order_id]);
    return (
        <Nav>
            <NavItem>
                <NavLink $active={location.pathname === '/checkOut'} >
                    <FontAwesomeIcon icon={faBagShopping} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />                   
                    確認購買商品
                </NavLink>
            </NavItem>
            <NavItem>
                <Arrow><FontAwesomeIcon icon={faRightLong} /></Arrow>
            </NavItem>
            <NavItem>
                <NavLink $active={location.pathname === `/shippingAddress/${order_id}`}>
                        <FontAwesomeIcon icon={faHouse} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />
                          填寫配送地址
                </NavLink>
            </NavItem>
            <NavItem>
                <Arrow><FontAwesomeIcon icon={faRightLong} /></Arrow>
            </NavItem>
            <NavItem>
                <NavLink $active={location.pathname === `/payment/${order_id}`}>
                    <FontAwesomeIcon icon={faCreditCard} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />    
                    線上付款
                </NavLink>
            </NavItem>
            <NavItem>
                <Arrow><FontAwesomeIcon icon={faRightLong} /></Arrow>
            </NavItem>
            <NavItem>
                <NavLink $active={location.pathname === `/paymentCompleted/${order_id}/${payment_id}`}>
                    <FontAwesomeIcon icon={faCircleCheck} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />    
                    交易結果
                </NavLink>
            </NavItem>
        </Nav>
    );
  };
  