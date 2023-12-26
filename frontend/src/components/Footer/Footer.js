import React from 'react';
import styled from 'styled-components';
import { MEDIA_QUERY_MOBILE } from '../../constants/style';


const FooterContainer = styled.footer`
  display:flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  bottom: 0;
  width: 100%;  
  background-color: rgb(214 232 235);
  text-align: center;
`;
const Image = styled.img`
  height: auto; 
  margin:20px 20px 20px 0;
  transition: transform 0.3s ease-in-out; 
  
  &:hover { 
    filter:hue-rotate(40deg);
    transform: rotate(45deg);
  }
`;

const CopyRight = styled.p`
  color: rgb(42 134 152);
  font-weight: blod;
  margin: 20px 0 20px 0;
  transition: transform 0.3s ease-in-out; 
  &:hover { 
    color: rgb(35 112 128);
    transform: scale(1.1);
  }
  ${MEDIA_QUERY_MOBILE} {
    display: none;
  }
`



const Footer = () => {
  
  return (
    <FooterContainer>      
      <CopyRight>&copy; 2024 實用中日同形詞攻略法 All rights reserved.</CopyRight>
      <Image src={process.env.PUBLIC_URL + '/imgs/monster_S-1.png'} alt="小怪獸S-1"style={{width:"50px",marginLeft:"20px"}}/>
      <Image src={process.env.PUBLIC_URL + '/imgs/monster_D-2.png'} alt="小怪獸D-2" style={{width:"50px"}}/>  
      <Image src={process.env.PUBLIC_URL + '/imgs/monster_O-1.png'} alt="小怪獸O-1" style={{width:"150px"}}/>   
      
    </FooterContainer>
  );
};

export default Footer;
