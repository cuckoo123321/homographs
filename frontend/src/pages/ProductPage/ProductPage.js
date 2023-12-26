import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { fetchProductData } from '../../WebAPI';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET, MEDIA_QUERY_DESKTOP } from '../../constants/style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";


const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
  margin-bottom: 500px;
`;

const FilterContainer = styled.div`
  position: fixed;
  top: 70px;
  width: 100%;
  background-color: #fff;
  z-index: 100; /* 固定在最上層 */
  padding: 20px;
  box-shadow: 0 2px 0 0 rgba(47, 150, 169, 0.2); /* 添加陰影效果 */
`;


const Input = styled.input`
  padding: 8px;
  font-size: 16px;
  border: 1px solid rgb(47, 150, 169);
  border-radius: 4px;
  margin-right: 8px;
  outline-color: #32a1ce;
`;

const Button = styled.button`
  padding: 8px 16px;
  font-size: 16px;
  background-color: rgb(47, 150, 169);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: rgb(35 112 128);
  }
`;

const Label = styled.label`
  margin: 0 5px 30px 20px;
  color: rgb(47, 150, 169);
  font-size: large;
  font-weight: bold;

  ${MEDIA_QUERY_MOBILE} {
    font-size: 0;
  }

`;

const Select = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid rgb(47, 150, 169);
  border-radius: 4px;
  margin-right: 8px;
  outline-color: #32a1ce;
`;

const ProductContainer = styled.div`
  width: 1375px;
  padding: 180px 0;
  height: 100vh; /* 設定整個區域的高度為視窗高度 */

  ${MEDIA_QUERY_MOBILE} {
    padding: 20px 20px;
  }

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
    margin-bottom: 40px;
  }
`;

const ProductCard = styled.div`
  display: flex;
  flex-wrap: wrap; 
  align-items: center;
  justify-content: start;
  text-align: center;
  margin: 80px 0px;
  overflow: auto; /* 讓內容溢出時可以捲動 */
 

  ${MEDIA_QUERY_MOBILE} {
    margin: 250px 5px 0 5px;
  }

  ${MEDIA_QUERY_TABLET} {
    margin: 150px 10px 0 10px;
  }

  ${MEDIA_QUERY_DESKTOP} {
    margin: 150px 20px 0 20px;
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
const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PageButton = styled.button`
  margin: 0 10px;
  padding: 8px 16px;
  font-size: 20px;
  background-color: rgb(47, 150, 169);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 200px;

  &:hover {
    background: rgb(35 112 128);
  }
`;

const PageCount = styled.span`
margin-bottom: 200px;
`;
const FirstLastPageButton = styled(PageButton)`
  margin: 0 5px;
  margin-bottom: 200px;
`;

const PAGE_SIZE = 10; // 每頁顯示的商品數量

export default function ProductPage() {
    const [productData, setProductData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [originalProductData, setOriginalProductData] = useState([]);
    const [sortOption, setSortOption] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(null);    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    

    useEffect(() => {
        const fetchData = async () => {
          try {
            const result = await fetchProductData();
            setProductData(result);
            setOriginalProductData(result); // 將原始數據保存下來
            // 取得並設定商品分類
            const uniqueCategories = [...new Set(result.map(product => product.product_category))];
            setCategories(uniqueCategories);
          } catch (error) {
            console.error('Error fetching product data:', error);
          } 
        };
    
        fetchData();
      }, []); // 空的依賴表示只在組件初次渲染時調用

      useEffect(() => {
        const calculateTotalPages = () => {
          const totalPagesValue = Math.ceil(productData.length / PAGE_SIZE);
          setTotalPages(totalPagesValue);
        };
    
        // 在組件初始化時計算總頁數
        calculateTotalPages();
    
        // 在商品數據改變時重新計算總頁數，確保在每次商品數據改變時，總頁數都會被更新
        calculateTotalPages();
      }, [productData]);

      // 計算總頁數
     //const totalPages = Math.ceil(productData.length / PAGE_SIZE);

     // 計算當前頁面的商品範圍
       const startIndex = (currentPage - 1) * PAGE_SIZE;
       const endIndex = startIndex + PAGE_SIZE;
       const currentProducts = productData.slice(startIndex, endIndex);

      const handleSearch = () => {
        // 在所有商品數據中進行關鍵字搜索
        const lowerCaseSearchKeyword = searchKeyword.toLowerCase();
      
        // 如果搜索條件為空，顯示所有商品
        if (lowerCaseSearchKeyword === '' && !categoryFilter) {
          setProductData(originalProductData); // 使用原始的商品數據
        } else {
          // 否則，根據搜索條件篩選商品數據         
          const filteredProducts = originalProductData.filter(product =>
            product.product_title.toLowerCase().includes(lowerCaseSearchKeyword)
          );
      
          // 更新商品數據，只顯示符合搜索條件的商品
          setProductData(filteredProducts);
        }
        // 每次搜尋都將當前頁碼設為第一頁
        setCurrentPage(1);
      };
      

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      };

      const handleSort = (option) => {
        let sortedProducts = [...productData];
    
        switch (option) {
          case 'priceHighToLow':
            sortedProducts.sort((a, b) => b.product_price - a.product_price);
            break;
          case 'priceLowToHigh':
            sortedProducts.sort((a, b) => a.product_price - b.product_price);
            break;
          case 'newToOld':
            sortedProducts.sort((a, b) => new Date(b.product_created_at) - new Date(a.product_created_at));
            break;
          case 'oldToNew':
            sortedProducts.sort((a, b) => new Date(a.product_created_at) - new Date(b.product_created_at));
            break;
          default:
            break;
        }
    
        setProductData(sortedProducts);
        setSortOption(option);
      };     
    
      const sortOptions = [
        { label: '商品定價：高 → 低', value: 'priceHighToLow' },
        { label: '商品定價：低 → 高', value: 'priceLowToHigh' },
        { label: '上架時間：新 → 舊', value: 'newToOld' },
        { label: '上架時間：舊 → 新', value: 'oldToNew' },
      ];

      const handleCategoryFilter = (selectedCategory) => {
        // 如果選擇的是所有分類，顯示原始的商品數據
        if (selectedCategory === '') {
          setProductData(originalProductData);
        } else {
          // 否則，根據選擇的商品分類篩選所有商品數據
          const filteredProducts = originalProductData.filter(product =>
            product.product_category === selectedCategory
          );
          setProductData(filteredProducts);
        }
      
        // 設定選擇的商品分類
        setCategoryFilter(selectedCategory);
        // 每次篩選都將當前頁碼設為第一頁
        setCurrentPage(1);
      };

  return (
    <Root>
      <FilterContainer>
      <ProductTitle><h1>商品總覽</h1></ProductTitle>
      <Input
        type="text"
        placeholder="請輸入商品名稱關鍵字"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button onClick={handleSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#fff", fontSize: "18px"}} />
      </Button>

      <Label>排序</Label>
      <Select onChange={(e) => handleSort(e.target.value)} value={sortOption || ''}>
        <option value="">顯示所有商品</option>
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Select>

      <Label>商品分類</Label>
      <Select onChange={(e) => handleCategoryFilter(e.target.value)} value={categoryFilter || ''}>
        <option value="">所有分類</option>
        {categories.map(category => (
          <option key={category} value={category}>{category}</option>
        ))}
      </Select>     
      </FilterContainer>

      <ProductContainer> 
        <ProductCard>
          {currentProducts.map((product) => (
            <Link to={`/product/${product.product_id}`} key={product.product_id} style={{textDecoration: "none"}}>
              {/* 點擊時導向到 SingleProductPage */}
              <div>
                <ProductImg src={`http://localhost:5001/uploads/${product.product_path}`} alt={`Product ${product.product_id}`} />
              </div>
              <ProductText style={{color:"rgb(31 100 113)"}}>{product.product_title}</ProductText>
              <Price>{product.product_price}</Price>
            <Discount>{product.product_discount}</Discount>
            </Link>            
          ))}
        </ProductCard>

      <Pagination>
      <FirstLastPageButton onClick={() => setCurrentPage(1)}>第一頁</FirstLastPageButton>
        <PageButton onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>◀︎</PageButton>
        <PageCount>{currentPage} / {totalPages}</PageCount>
        <PageButton onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}>▶︎</PageButton>
        <FirstLastPageButton onClick={() => setCurrentPage(totalPages)}>最末頁</FirstLastPageButton>
      </Pagination>
    </ProductContainer>
    </Root>
  );
}
