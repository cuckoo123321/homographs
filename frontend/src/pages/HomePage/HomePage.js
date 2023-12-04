import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import './HomePageStyle.scss'
import { fetchCarouselData } from '../../WebAPI';


const Root = styled.div`
  text-align: center;
  margin-top:70px;
`;

const CarouselContainer = styled.div`
  position: relative;
`;

const CarouselItem = styled.div`
  width: 100%;
  height: 600px;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, rgba(47, 150, 169, 0.1), rgba(47, 150, 169, 0.7));
  opacity: 0;
  transition: opacity 0.5s ease-in-out;  
`;

const CarouselImg = styled.img`
  width: 100%;
  height: 600px;
  overflow: hidden;
  object-fit: contain;
  object-position: center center;
  border-bottom: 1px solid rgba(47, 150, 169, 0.1);
`;

const CarouselPage = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: ${({ active }) => (active === 'true' ? 'rgb(55 177 200)' : '#ffffff')};
  border: 3px solid rgb(55 177 200);
  position: absolute;
  top: 550px;
  right: ${({ offset }) => `${130 - (25 * (offset - 1))}px`};

  &:hover {
    background: rgb(55 177 200);
    cursor: pointer;
  }
`;


export default function HomePage() {
  const [carouselData, setCarouselData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchCarouselData();
        setCarouselData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);// 空的依賴表示只在組件初次渲染時調用

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 10000); // 切換圖片的間隔，設定為 10 秒

    return () => clearInterval(interval); // 在組件解除掛載時清除 interval
  }, [carouselData]);

  const handlePageClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <Root>
      <CarouselContainer>
      {carouselData.map((carousel, index) => (
          <CarouselItem key={carousel.carousel_id} style={{ opacity: index === currentIndex ? 1 : 0 }}>
            <CarouselImg src={`http://localhost:5001/uploads/${carousel.carousel_path}`} alt={`Carousel ${carousel.carousel_id}`}/>
          </CarouselItem>
        ))}
        <div className="carousel__page">
          {carouselData.map((_, index) => (
            <CarouselPage key={index + 1} offset={index + 1} active={index === currentIndex ? 'true' : 'false'} onClick={() => handlePageClick(index)} />
          ))}
        </div> 
      </CarouselContainer>
    </Root>
  );
}