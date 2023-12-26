import React from 'react';
import styled, { css } from 'styled-components';
import { useState, useEffect } from 'react';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faPenToSquare, faRightFromBracket, faUser,faCartShopping, faRectangleList } from '@fortawesome/free-solid-svg-icons';
//import { faOptinMonster} from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from "react-router-dom";
import { useContext } from 'react'; ////用於在函式組件中存取上下文
import { AuthContext, CountContext } from '../../contexts'; //該上下文是用於存儲和共享身份驗證相關資訊的上下文
import { setAuthToken } from '../../constants/utils';//設置 token
import { useNavigate } from 'react-router-dom';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET, MEDIA_QUERY_DESKTOP } from '../../constants/style';
import ShoppingCartPopover from '../../pages/ShoppingCartPopover/index';
import { getCart } from '../../WebAPI';

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

  ${[MEDIA_QUERY_DESKTOP, MEDIA_QUERY_TABLET, MEDIA_QUERY_MOBILE].map(query => `
    ${query} {
      font-size: 0px;
    }`)}
`;

const NavbarList = styled.div`
  display: flex;
  align-items: center;
  height: 70px;
  margin-left: 30px;

  ${MEDIA_QUERY_MOBILE} {
    flex-direction: row;
    align-items: flex-start;
    margin-left: 0;
  }
`;

const NavLeft = styled(Link)`
  ${baseLinkStyles}
  justify-content: center;
  width: 130px;
  font-size: 20px;
  font-weight: 500;

  ${(props) =>
    props.$active &&`
      background: rgba(47, 150, 169, 0.1);
    `}

    ${MEDIA_QUERY_MOBILE} {
      font-size: 16px;
      margin: 0 -20px 0 -20px;
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

  ${MEDIA_QUERY_TABLET} {
    font-size: 16px;
    &:last-child {
      margin-right: 50px;
    }
  }

  ${MEDIA_QUERY_MOBILE} {
    width: 100%;
    font-size: 0px;
    margin-right: 20px;
    &:last-child {
      margin-right: 100px;
    }
  }
`;

const Badge = styled.div`
  width:20px;
  height:20px;
  background-color: rgb(233 85 102);
  color: white;
  border-radius: 50%;
  text-align: center;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0px;
  right: 180px;
  ${MEDIA_QUERY_MOBILE} {
   display:none;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 30px;

  ${MEDIA_QUERY_MOBILE} {
    margin-left: 20px;
  }
`;

const ImageS = styled.img`
  width: 35px;  
  height: auto; 
  margin-right:10px;

  ${MEDIA_QUERY_TABLET} {
    margin-right: -25px;
  }

  ${MEDIA_QUERY_MOBILE} {
    display: none;
  }
`;

const Image = styled.img`
  height: auto; 
  margin-right:10px;

  ${MEDIA_QUERY_TABLET} {
    display: none;
  }

  ${MEDIA_QUERY_MOBILE} {
    display: none;
  }
`;


export default function Header() {  
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPopover, setShowPopover] = useState(false);
  //const [cartItemsCount, setCartItemsCount] = useState(0);
  const { cartItemsCount, setCartItemsCount } = useContext(CountContext);

  useEffect(() => {
    // 確保 user 已經被正確設定
    if (user) {
      // 使用 API 獲取購物車資訊
      getCart(user.user_id, user.token)
        .then((response) => {
          if (response.success) {
            // 設定商品品項數量
            setCartItemsCount(response.data.length);
          } else {
            console.error('獲取購物車資訊失敗:', response.error);
          }
        })
        .catch((error) => {
          console.error('Error fetching cart information:', error);
        });
    }
  }, [user]);


  const handleCartClick = () => {
    setShowPopover(!showPopover);
  };


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
          {/* <FontAwesomeIcon icon={faOptinMonster} style={{color: "#2f96a9", marginRight:"10px"}} /> */}
          <ImageS 
         src={process.env.PUBLIC_URL + '/imgs/monster_S-3.png'}  
         alt="小怪獸S-3"
         />
         <Image 
         src={process.env.PUBLIC_URL + '/imgs/monster_D-1.png'}  
         alt="小怪獸D-1"
         style={{width:"28px"}}
         />
          <Image 
         src={process.env.PUBLIC_URL + '/imgs/monster_O-2.png'}  
         alt="小怪獸O-2"
         style={{width:"40px"}}
         />
         
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

          {user && <NavRight to={`/orderList/${user.user_id}`} $active={location.pathname === `/orderList/${user.user_id}`}>
            <div><FontAwesomeIcon icon={faRectangleList} style={{color: "#2f96a9", fontSize: "24px"}} /></div>
            <div>訂單</div>
          </NavRight> }        

          {user && (
            <NavRight onClick={handleCartClick}>
              <div>
              {cartItemsCount > 0 && (
                <Badge>{cartItemsCount}</Badge>
              )}
                <FontAwesomeIcon icon={faCartShopping} style={{ color: "#2f96a9", fontSize: "24px" }} />
                
                {showPopover && (
                  <ShoppingCartPopover/>
                )}
              </div>
              <div>購物車</div>
            </NavRight>
          )}

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