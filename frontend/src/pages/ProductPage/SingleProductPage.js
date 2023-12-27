import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { getProductById, addToFavorites, addToCart } from '../../WebAPI';
import { useContext } from 'react'; //用於在函式組件中存取上下文
import { AuthContext } from '../../contexts'; //存儲和共享身份驗證相關資訊的上下文
import { MEDIA_QUERY_MOBILE } from '../../constants/style';


const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
`;

const Container = styled.div`
  padding: 20px;
  border-radius: 8px;  
  display: flex;
  max-width: 1000px; /* 設定最大寬度，以防止內容過寬 */
  margin-bottom: 200px;
  ${MEDIA_QUERY_MOBILE} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const ProductImgContainer = styled.div`
  max-width: 500px;
  height: auto;
  border-radius: 8px;
  border: 0.5px solid rgb(47, 150, 169,0.2);
  box-shadow: 0px 5px 5px rgb(47, 150, 169, 0.5);
  ${MEDIA_QUERY_MOBILE} {
    width: 300px;
    border:none; 
    box-shadow: none;
  }
`;

const ProductImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
`;

const ProductDetails = styled.div`
  flex: 1; /* 佔據剩餘空間 */
  margin-left: 50px;
  ${MEDIA_QUERY_MOBILE} {
    margin: 30px 0 0 0;
  }
`;

const ProductTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  color:rgb(31 100 113);
`;

const ItemGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const Label = styled.span`
  color: rgb(31 100 113);
  font-size: 18px;
  margin-right: 10px;
  flex-shrink: 0; /* 防止 Label 被壓縮 */
`;

const Price = styled.span`
  color: rgb(60 60 60);
  font-size: 18px;
  text-decoration: line-through;
  &::before {
    content: "NT ";
    }
  &::after {
    content: " 元";
    }
`;

const Discount = styled.span` 
  color: rgb(173 62 74);
  font-size: 18px;
  &::before {
    content: "NT ";
    }
  &::after {
    content: " 元";
    }
`;

const ProductDescription = styled.div`
    height: 160px;
    overflow-y: auto;
    color: rgb(60 60 60);
    font-size: 18px;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1; /* 使 ProductDescription 佔據剩餘空間 */
`;

const Category = styled.span`
  color: rgb(31 100 113);
  font-size: 18px;
  font-weight: bold;
  &::before {
    content: "#";
    }
`;

const Stock = styled.span`
  rgb(60 60 60);
  font-size: 18px;
`;

const ButtonGroup = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(47, 150, 169);
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px;
  margin-right: 10px;
  margin-top:20px;
  cursor: pointer;
  flex: 1; /* 讓按鈕佔據彈性空間的一半 */

  svg {
    margin-right: 5px;
  }
  &:hover {
    background: rgb(35 112 128);
  }
  ${MEDIA_QUERY_MOBILE} {
    margin-top:0px;
  }
`;

const ButtonLabel = styled.span`
  font-size: 16px;
  ${MEDIA_QUERY_MOBILE} {
    font-size: 0px;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  font-size: 16px;
  margin: 0 10px;
`;

const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  background-color: rgb(47, 150, 169);
  color: white;
  font-weight: 900;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: rgb(35 112 128);
  }
`;

export default function SingleProductPage ({ setCartItems }){
  const { product_id } = useParams();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [ cartItemsCount, setCartItemsCount] = useState(0);
  const navigate = useNavigate();
  const HOST = 'https://homographs-backend-497c2e6eca4b.herokuapp.com';

  useEffect(() => {
    // 根據 productId 從 API 中取得商品詳細資訊
    const fetchProduct = async () => {
        try {
          const response = await getProductById(product_id);      
          if (!response.ok) {
            console.error('Response not ok:', response.statusText);
            throw new Error('Failed to fetch product');
          }
      
          const data = await response.json();
          setProduct(data); // 設定商品詳細資訊到 state
        } catch (error) {
          console.error('Error fetching product details:', error);
        }
      };

    fetchProduct();
  }, [product_id]);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < product.product_stock) {
        setQuantity(quantity + 1);
      }
  };

  const handleFavorite = async (product_id) => {
    try {
      if (!user || !user.user_id) {
        alert('請先登入會員');
        navigate("/login");
        return;
      }

      // 使用 Web API 將商品加入收藏清單
      await addToFavorites({ user_id: user.user_id, product_id });
      alert('成功加入收藏清單');
      

      // 在這裡你可以更新收藏清單狀態或顯示相應的提示
    } catch (error) {
      // 如果錯誤是由於唯一鍵衝突引起的
      if (error.response && error.response.status === 400) {
        alert('該商品已存在收藏清單中');
        console.log('該商品已存在收藏清單中:', error);
      } else {
        // 其他錯誤的處理
        alert('添加到收藏清單失敗');
        console.error('加入收藏清單失敗:', error);
      }
    }
  };

  const handleAddToCart = async (product_id, quantity) => {
    try {
      // 判斷是否有使用者登入
      if (!user) {
        alert('請先登入會員');
        navigate("/login");
        return;
      }

      // 使用 getProductById 取得商品資訊
      const productData = await getProductById(product_id);
      const product = await productData.json(); // 轉換為 JSON 格式

      // 檢查商品庫存
      if (product && product.product_stock === 0) {
        alert('該商品已售完，無法購買');
        return;
      }

      // 使用 addToCart API 將商品加入購物車
      const response = await addToCart(user.user_id, product_id, quantity, user.token);

      // 判斷 addToCart API 的回傳是否成功
      if (response.success) {
        alert('成功加入購物車');
        // 更新購物車數量等相關資訊
        setCartItemsCount((prevCount) => prevCount + 1);
      } else {
        // 判斷是否為唯一鍵衝突
        if (response.error && response.error.code === 'ER_DUP_ENTRY') {
          alert('該商品已存在購物車中');
        } else {
          console.error('添加到購物車失敗:', response.error);
          alert('添加到購物車失敗');
        }
      }
    } catch (error) {
      console.error('Error handling add to cart:', error);
    }
  };   

  return (
    <Root>    
    <Container>
        {product ? (
            <>
        <ProductImgContainer>
            <ProductImg src={`${HOST}/uploads/${product.product_path}`} alt={`Product ${product.product_id}`} />
        </ProductImgContainer>
        <ProductDetails>
          <ProductTitle>{product.product_title}</ProductTitle>
            <ItemGroup>
                <Label>定價：</Label>
                <Price>{product.product_price}</Price>
            </ItemGroup>
            <ItemGroup>
                <Label>特價：</Label>
                <Discount>{product.product_discount}</Discount>
            </ItemGroup>
            <ItemGroup>
                <Label>簡介：</Label>
                <ProductDescription>{product.product_description}</ProductDescription>
            </ItemGroup>
            <ItemGroup>
                <Label>分類：</Label>
                <Category>{product.product_category}</Category>
            </ItemGroup>
            <ItemGroup>
                <Label>庫存： </Label>
                {product.product_stock > 10 ? (
                    <Stock>庫存大於 10</Stock>
                ) : product.product_stock === 0 ? (
                    <Stock style={{color:"rgb(173 62 74)"}}>已售完，無法購買</Stock>
                ) : (
                    <Stock style={{color:"rgb(173 62 74)"}}>{`剩餘數量 ${product.product_stock}`}</Stock>
                )}
            </ItemGroup>

            <ItemGroup style={{marginTop:"20px"}}>
                <Label>數量：</Label>
                <QuantitySelector>
                    <QuantityButton onClick={handleDecrease}>－</QuantityButton>
                    <QuantityInput type="text" value={quantity} readOnly />
                    <QuantityButton onClick={handleIncrease}>＋</QuantityButton>
                </QuantitySelector>
            </ItemGroup>
            <ItemGroup>
                <Label>提醒：</Label>
                <ProductDescription>本平台僅支援線上付款，並提供配送至您指定的地址。滿千免運，未滿千國內一律酌收100元運費。若您相同此交易方式再進行購買，我們將提供快捷的結帳和郵寄服務，感謝您的惠顧。</ProductDescription>

            </ItemGroup>
            
          <ButtonGroup>
            <Button onClick={() => handleAddToCart(
                    product.product_id, quantity)}  >
                <FontAwesomeIcon icon={faShoppingCart} style={{ color: 'white', fontSize: '24px' }} />
                <ButtonLabel                   
                    >加入購物車
                </ButtonLabel>                   
            </Button>
            <Button onClick={() => handleFavorite(product.product_id)}>
                <FontAwesomeIcon icon={faHeart} style={{ color: 'white', fontSize: '24px' }} />
                <ButtonLabel >收藏商品</ButtonLabel>    
            </Button>
          </ButtonGroup>
        </ProductDetails>
        </>
        ) : (
            <p>Loading...</p>
        )}
      </Container>
    </Root>
  );
};