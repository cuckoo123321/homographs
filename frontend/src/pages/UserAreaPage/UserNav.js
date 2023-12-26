import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faComment } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { MEDIA_QUERY_MOBILE} from '../../constants/style';

const Nav = styled.ul`
  list-style: none;
  display: flex;
  border-bottom: 1px solid #ddd;
  padding: 5px;
  margin-top:60px;
`;

const NavItem = styled.li`
  margin-right: 20px;  
  ${MEDIA_QUERY_MOBILE} {
    margin-right: 10px;
  }
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
      color: #32a1ce;
      border-radius: 8px;
      background: rgba(47, 150, 169, 0.1);
    `}

  &:hover {
    color: #32a1ce;
    border-radius: 8px;
    background: rgba(47, 150, 169, 0.2);
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 16px;
  }

`;


export default function UserNav  ({ location }) {

  const handleComment = () => {
    alert('「商品評價」功能開發中，請再等等！(ᴗ_ ᴗ。)');
  };

    return (
        <Nav>
            <NavItem>
                <NavLink to="/userArea" $active={location.pathname === '/userArea'}>
                    <FontAwesomeIcon icon={faUser} style={{color: "#2f96a9", fontSize: "20px", marginRight: "5px"}} />
                    會員資料
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink to="/userFavorite" $active={location.pathname === '/userFavorite'}>
                        <FontAwesomeIcon icon={faHeart} style={{color: "#2f96a9", fontSize: "20px", marginRight: "5px"}} />
                    收藏商品
                </NavLink>
            </NavItem>
            <NavItem>
                <NavLink onClick={handleComment}>
                    <FontAwesomeIcon icon={faComment} style={{color: "#2f96a9", fontSize: "20px", marginRight: "5px"}} />    
                    商品評價
                </NavLink>
            </NavItem>
        </Nav>
    );
};

