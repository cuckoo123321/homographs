import React from 'react';
import styled from 'styled-components';
import {  useState } from 'react';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET } from '../../constants/style';


const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap; 
  margin-top: 70px;
`;

const Title = styled.div`
h1 {
  text-align: center;
  font-weight: 500;
  color: rgb(47, 150, 169);
  letter-spacing: 0.04em;
  margin: 40px 0 0 0;
  ${MEDIA_QUERY_MOBILE} {
    font-size: 20px;
  }
`;

const Container = styled.div`
display: flex;
align-items: center;
justify-content: center;
padding: 0 100px 0 100px;

&:last-child {
  margin-bottom: 200px;
}
${MEDIA_QUERY_TABLET} {
  &:last-child {
    margin-bottom: 50px;
  }
}

${MEDIA_QUERY_MOBILE} {
  padding: 0 50px 0 50px;
}
`;

const Image = styled.img`
  width: 150px; 
  height: auto; 
  margin:20px 0 20px 0;
  transition: transform 0.3s ease-in-out; 
  cursor: pointer;
  
  &:hover { 
    transform: scale(1.3);
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 50px;
  }
`;

const Paragraph = styled.p`
  font-size: 20px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: rgb(25 80 91);
  text-align: justify;
  padding: 0 100px;
  margin-top: 20px;
  ${MEDIA_QUERY_TABLET} {
    font-size: 16px;
    padding: 0;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 16px;
    padding: 0;
  }
`;

const MonsterS = styled.div`
  color:rgb(180 143 74);
  font-size: 20px;
  border: 1px solid rgb(110 99 41);
  border-radius: 20px;
  padding: 5px;
`;
const MonsterO = styled.div`
  width: 400px;
  color:rgb(215 133 149);
  font-size: 20px;
  border: 1px solid rgb(173 31 37);
  border-radius: 20px;
  padding: 5px;
  margin-right: 10px;
`;
const MonsterD = styled.div`
  width: 600px;
  color:rgb(58 162 191);
  font-size: 20px;
  border: 1px solid rgb(4 66 74);
  border-radius: 20px;
  padding: 5px;
  margin-right: 10px;
`;

export default function AboutPage() {
    const [imageDescriptionS, setImageDescriptionS] = useState('');
    const [imageDescriptionO, setImageDescriptionO] = useState('');
    const [imageDescriptionD, setImageDescriptionD] = useState('');
    const [currentImageS, setCurrentImageS] = useState(process.env.PUBLIC_URL + '/imgs/monster_S-4.png');
    const [currentImageO, setCurrentImageO] = useState(process.env.PUBLIC_URL + '/imgs/monster_O-4.png');
    const [currentImageD, setCurrentImageD] = useState(process.env.PUBLIC_URL + '/imgs/monster_D-4.png');

  
    const handleMouseEnterS = () => {
      setImageDescriptionS('我是小怪獸S，歡迎你來玩～');
      setCurrentImageS(process.env.PUBLIC_URL + '/imgs/monster_S-2.png');
    };
  
    const handleMouseEnterO = () => {
      setImageDescriptionO('嘿嘿，我是小怪獸O，噢噢噢、おおお！');
      setCurrentImageO(process.env.PUBLIC_URL + '/imgs/monster_O-3.png');
    };
  
    const handleMouseEnterD = () => {
      setImageDescriptionD('我是小怪獸D，快來和我一起冒險吧！');
      setCurrentImageD(process.env.PUBLIC_URL + '/imgs/monster_D-3.png');
    };
  
    const handleMouseLeave = () => {
      setImageDescriptionS('');
      setImageDescriptionO('');
      setImageDescriptionD('');
      setCurrentImageS(process.env.PUBLIC_URL + '/imgs/monster_S-4.png');
      setCurrentImageO(process.env.PUBLIC_URL + '/imgs/monster_O-4.png');
      setCurrentImageD(process.env.PUBLIC_URL + '/imgs/monster_D-4.png');
    };

  return (
    <Root>
      <Title><h1>歡迎光臨本網站 - 中日同形詞的奇幻世界</h1></Title>
      
      <Container>      
         <Image 
         src={currentImageS}  
         alt="小怪獸S-2"
         style={{marginLeft:"20px"}}
         onMouseEnter={handleMouseEnterS}
         onMouseLeave={handleMouseLeave}
         />
        {imageDescriptionS && <MonsterS>{imageDescriptionS}</MonsterS>}  
        <Paragraph style={{ paddingLeft: '30px' }}>
            本網站是由《實用中日同形詞攻略法》的作者所開發而成，旨在向大家推廣這本實用的書籍，同時介紹其他華語教學相關的書籍、研討會和工作坊活動。希望這些資源能對語言學習者、教學者帶來一些幫助。
        </Paragraph>
      </Container>
     
      <Container>
        <Paragraph style={{ paddingRight: '30px' }}>
        在這裡，你可以體驗多項功能測試，包括「加入會員、登入、修改會員資料、查看商品、搜尋活動、收藏商品、購物車、結帳、查看購物清單、評價商品」等功能。我們經過嚴格的 JWT 加密處理，以及防範前後端攻擊的措施，但由於這是一個測試網站，不建議填寫真實或敏感資訊。
        <br/><br/>
        如果你有真實的購書需求，推薦您前往正中出版社網站或各大銷售通路進行購買，以確保您得到最正確的資訊並享受到更優惠的價格。
      </Paragraph>
      {imageDescriptionO && <MonsterO>{imageDescriptionO}</MonsterO>}
        <Image 
          src={currentImageO} 
          alt="小怪獸O-4"
          style={{marginLeft:"20px"}}
          onMouseEnter={handleMouseEnterO}
          onMouseLeave={handleMouseLeave}
        />
      </Container>
      
      <Container>      
      <Image 
        src={currentImageD} 
        alt="小怪獸D-4"
        style={{marginLeft:"20px"}}
        onMouseEnter={handleMouseEnterD}
        onMouseLeave={handleMouseLeave}
      />
      {imageDescriptionD && <MonsterD>{imageDescriptionD}</MonsterD>}
        <Paragraph style={{ paddingLeft: '30px' }}>
        此外，如果您對相關研究有興趣，本站提供期刊文章<a href="https://www.airitilibrary.com/Article/Detail/18118429-202006-202006300008-202006300008-1-40" style={{textDecoration: 'none'}}>〈中日同形詞自學式教材對初級日籍學習者詞彙學習成效之影響〉</a>，歡迎探索深入了解。這篇文章透過實驗，深入探討了使用「中日同形詞」教材與未使用該教材的學習者，在詞彙方面的學習成效差異。同時收錄作者的相關著作：
        <a href="https://www.degruyter.com/document/doi/10.1515/caslar-2021-2005/html" style={{textDecoration: 'none'}}>〈漢語移動事件中「來」與「過來」之探究〉</a>、
        <a href="http://tjl.nccu.edu.tw/main/uploads/20.2_.4_%E6%BC%A2%E8%AA%9E%E9%81%8B%E5%8B%95%E4%BA%8B%E4%BB%B6%E8%B6%A8%E5%90%91%E8%A3%9C%E8%AA%9E%E6%A7%8B%E5%BC%8F%E8%A6%8F%E5%89%87%E4%B9%8B%E6%8E%A2%E7%A9%B6%E2%94%80%E2%94%80%E4%BB%A5%E3%80%8CV%EF%BC%8B%E4%BE%86%EF%BC%8F%E9%81%8E%EF%BC%8F%E9%81%8E%E4%BE%86%E3%80%8D%E7%82%BA%E4%BE%8B_.pdf" style={{textDecoration: 'none'}}>〈漢語運動事件趨向補語構式規則之探究──以「V＋來／過／過來」為例〉</a>，
        帶領您深度瞭解此領域的研究成果。
        <br/><br/>
        如有任何疑問，請隨時來信聯絡我們的客服（
        <a href="mailto:slide.dr80h@slmails.com" style={{ textDecoration: 'none' }}>homographs.s3c5a@slmails.com</a>
       ） ，作者本人會為您提供最貼心的服務。我們也歡迎您來信留下對書籍的評論，分享您的感受和看法。您的回饋對我們來說非常寶貴。感謝您的支持與參與，期待您在我們的網站上度過愉快的時光。
        </Paragraph>
      </Container>
      
    </Root>
  );
};