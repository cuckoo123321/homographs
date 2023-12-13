import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faHouse, faCreditCard, faCircleCheck, faRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const Nav = styled.ul`
  list-style: none;
  display: flex;
  padding: 5px;
  margin-top:100px;
`;

const NavItem = styled.li`
  margin-right: 20px;  
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
  cursor: pointer;
  
  ${(props) =>
    props.$active && `
      color: rgb(205 83 112);
    `}
`;

export default function CheckOutNav ({ location }) {
    return (
        <Nav>
            <NavItem>
                <NavLink to="/checkOut" $active={location.pathname === '/checkOut'} >
                    <FontAwesomeIcon icon={faBagShopping} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />                   
                    確認購買商品
                </NavLink>
            </NavItem>
            <NavItem>
                <Arrow><FontAwesomeIcon icon={faRightLong} /></Arrow>
            </NavItem>
            <NavItem>
                <NavLink to="/shippingAddress" $active={location.pathname === '/shippingAddress'}>
                        <FontAwesomeIcon icon={faHouse} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />
                          填寫配送地址
                </NavLink>
            </NavItem>
            <NavItem>
                <Arrow><FontAwesomeIcon icon={faRightLong} /></Arrow>
            </NavItem>
            <NavItem>
                <NavLink to="/payment" $active={location.pathname === '/payment'}>
                    <FontAwesomeIcon icon={faCreditCard} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />    
                    線上付款
                </NavLink>
            </NavItem>
            <NavItem>
                <Arrow><FontAwesomeIcon icon={faRightLong} /></Arrow>
            </NavItem>
            <NavItem>
                <NavLink to="/checkComplete">
                    <FontAwesomeIcon icon={faCircleCheck} style={{color: "#2f96a9", fontSize: "20px", marginRight: "10px"}} />    
                    完成購買
                </NavLink>
            </NavItem>
        </Nav>
    );
  };
  