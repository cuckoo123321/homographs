import React from 'react';
import styled, { css } from 'styled-components';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPenToSquare, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { faOptinMonster} from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../../contexts';
import { setAuthToken } from '../../constants/utils';
import { useNavigate } from 'react-router-dom';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET } from '../../constants/style';

const baseLinkStyles = css`
  height: 70px;
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
  z-index: 1000;

  ${MEDIA_QUERY_MOBILE} {
    padding: 0px 8px;
  }
`;

const Brand = styled(Link)`
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
  color: rgb(47 150 169);

  ${MEDIA_QUERY_TABLET} {
    font-size: 20px;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 0px;
  }
`;

const NavbarList = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  margin-left: 30px;

  ${MEDIA_QUERY_MOBILE} {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 0;
    margin-top: 10px;
  }
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

    ${MEDIA_QUERY_MOBILE} {
      width: 100%;
      text-align: center;
      margin-bottom: 5px;
    }
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

  ${MEDIA_QUERY_MOBILE} {
    width: 100%;
    text-align: center;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 64px;

  ${MEDIA_QUERY_MOBILE} {
    margin-left: 20px;
  }
`;

export default function Header() {  
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthToken('');
    setUser(null);
    if(location.pathname !== '/'){
      navigate('/');
    }    
  };

   return (
    <StyleSheetManager shouldForwardProp={(prop) => isPropValid(prop)}>
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
        {!user && <NavRight to="/register" $active={location.pathname === '/register'}>
            <div><FontAwesomeIcon icon={faPenToSquare} style={{color: "#2f96a9", fontSize: "24px"}} /></div>
            <div>註冊</div>
          </NavRight> }
          
          {!user && <NavRight className="margin: 0px" to="/login" $active={location.pathname === '/login'}>
            <div><FontAwesomeIcon icon={faRightToBracket} style={{ color: "#2f96a9", fontSize: "24px"}} /></div>
            <div>登入</div>          
          </NavRight> }

          {user && <NavRight to="/userArea" $active={location.pathname === '/userArea'}>
            <div><FontAwesomeIcon icon={faUser} style={{color: "#2f96a9", fontSize: "24px"}} /></div>
            <div>會員</div>
          </NavRight> }

          {user && <NavRight className="margin: 0px" to="/login" onClick={handleLogout}><FontAwesomeIcon icon={faRightFromBracket} style={{ color: "#2f96a9", fontSize: "24px"}}/><div>登出</div></NavRight>}


        </NavbarList>
    </HeaderContainer>
   </StyleSheetManager>
  )
}