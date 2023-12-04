import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { fetchProductData } from '../../WebAPI';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET, MEDIA_QUERY_DESKTOP, MEDIA_QUERY_LARGE_DESKTOP } from '../../constants/style';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

const ProductContainer = styled.div`
  width: 1375px;
  height: 100%;
  padding: 80px 0;

  ${MEDIA_QUERY_TABLET} {
    padding: 60px 20px;
  }

  ${MEDIA_QUERY_DESKTOP} {
    padding: 80px 30px;
  }
`;


const ProductTitle = styled.div`
  h1 {
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
`;

const ProductCard = styled.div`
  display: flex;
  flex-wrap: wrap; 
  align-items: center;
  justify-content: start;
  text-align: center;
  margin: 80px 0px;
 

  ${MEDIA_QUERY_MOBILE} {
    margin: 20px 5px;
  }

  ${MEDIA_QUERY_TABLET} {
    margin: 40px 10px;
  }

  ${MEDIA_QUERY_DESKTOP} {
    margin: 60px 20px;
  }
`;

const ProductImg = styled.img`
  width: 250px;
  height: 275px;
  overflow: hidden;
  object-fit: contain;
  object-position: center center;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.15); /* 放大 15% */
  }
`;

const ProductText = styled.div`
  width: 275px;
  height: auto;
  margin-top: 16px;
  font-weight: 400;
  letter-spacing: 0.04em;
  overflow-wrap: break-word;
  cursor: pointer;

  &:hover {
    color:  rgb(31 100 113);
  }

  ${MEDIA_QUERY_MOBILE} {
    font-size: 12px;
  }

  ${MEDIA_QUERY_DESKTOP} {
    font-size: 16px;
  }
`;

const Price = styled.div`
  font-weight: 300;
  font-size: medium;
  letter-spacing: 0.08em;
  color: rgb(126, 126, 126);
  text-decoration: line-through;

  &::before {
    content: "定價：NT";
  }
`;

const Discount = styled.div`
    font-weight: 500;
    font-size: medium;
    letter-spacing: 0.08em;
    color: rgb(173 62 74);
    margin-bottom: 50px;

    &::before {
    content: "特價：NT";
    color: rgb(126, 126, 126);
    }
`;

export default function ProductPage() {
    const [productData, setProductData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await fetchProductData();
            setProductData(result);
          } catch (error) {
            console.error('Error fetching product data:', error);
          } 
        };
    
        fetchData();
      }, []); // 空的依賴表示只在組件初次渲染時調用

  return (
    <Root>
    <ProductContainer>       
        <ProductTitle><h1>商品總覽</h1></ProductTitle>
        <ProductCard>
        {productData.map((product) => (
            <div key={product.product_id}>
            <div>
                <ProductImg src={`http://localhost:5001/uploads/${product.product_path}`} alt={`Product ${product.product_id}`} />
            </div>
            <ProductText>{product.product_title}</ProductText>
            <Price>{product.product_price}</Price>
            <Discount>{product.product_discount}</Discount>
            </div>
        ))}
        </ProductCard>
    </ProductContainer>
    </Root>
  );
}
