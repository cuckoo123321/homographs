import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faOptinMonster} from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from "react-router-dom";

const baseLinkStyles = css`
  height: 100px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  color: rgb(47 150 169);
  text-decoration: none;
  padding: 0px 5px;
  transition: background 0.3s;

  &:hover {
    background: rgba(47, 150, 169, 0.2);
  }
`;

const HeaderContainer = styled.div`
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 0px 32px;
  box-sizing: border-box;
  background: #ffffff;
  color: rgb(47 150 169);
`;

const Brand = styled.div`
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
`;

const NavbarList = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  margin-left: 30px;
`;

const NavLeft = styled(Link)`
  ${baseLinkStyles}
  justify-content: center;
  width: 130px;
  font-size: 20px;
  font-weight: 500;

  ${(props) =>
    props.$active &&
    `
      background: rgba(47, 150, 169, 0.1);
    `}
`;

const NavRight = styled(Link)`
  ${baseLinkStyles}
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  font-size: 18px;
  font-weight: 400;

  ${(props) =>
    props.$active &&
    `
      background: rgba(47, 150, 169, 0.1);
    `}
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 64px;
`;

export default function Footer() {  
  const location = useLocation();
   return (
   <HeaderContainer>
    <LeftContainer>
      <Brand to="/" $active={location.pathname === '/'}>
        <FontAwesomeIcon icon={faOptinMonster} style={{color: "#2f96a9", marginRight:"10px"}} />
        實用中日同形詞攻略法</Brand>
      <NavbarList>
        <NavLeft to="/product" $active={location.pathname === '/product'}>商品總覽</NavLeft>
        <NavLeft to="/event" $active={location.pathname === '/event'}>活動資訊</NavLeft>
        <NavLeft to="/about" $active={location.pathname === '/about'}>關於我們</NavLeft>
      </NavbarList>
    </LeftContainer>
    <NavbarList>
        <NavRight to="/register" $active={location.pathname === '/register'}>
          <div><FontAwesomeIcon icon={faPenToSquare} style={{color: "#2f96a9", fontSize: "24px"}} /></div>
          <div>註冊</div>
        </NavRight>
        <NavRight className="margin: 0px" to="/login" $active={location.pathname === '/login'}>
          <div><FontAwesomeIcon icon={faRightToBracket} style={{ color: "#2f96a9", fontSize: "24px"}} /></div>
          <div>登入</div>          
        </NavRight>
      </NavbarList>
   </HeaderContainer>
  )
}