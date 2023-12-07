import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { fetchEventData } from '../../WebAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';


const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap; 
  margin-top: 70px;
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

const ButtonSearch = styled.button`
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

`;

const Select = styled.select`
  padding: 8px;
  font-size: 16px;
  border: 1px solid rgb(47, 150, 169);
  border-radius: 4px;
  margin-right: 8px;
  outline-color: #32a1ce;
`;

const EventTitle = styled.div`
  h1 {
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
    margin-bottom: 40px;
`;

const EventContainer = styled.div`
  width: 1375px;
  height: 100%;
  padding: 250px 0;
  display: flex;
  flex-wrap: wrap; 
  align-items: center;
  justify-content: start;
`;

const EventCard = styled.div`
  width: 400px;  
  height: 450px; 
  margin: 0 20px 40px 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.05);
  }
`;

const EventName = styled.h2`
  height:55px;
  font-size: 1.5rem;
  margin-bottom: 10px;
  overflow-y: auto;
`;

const EventInfo = styled.p`
  font-size: large;
  margin-bottom: 10px;
  text-align: left;
  height: 250px;
  overflow-y: auto;
`;

const Title = styled.strong`
  display: inline-block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Content = styled.span`
  display: inline-block;
  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 350px;
  background-color: rgb(47, 150, 169);
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.1em;
  margin-top: 10px;
  position: relative;
  bottom: 5px;

  &:hover {
    background-color:rgb(35 112 128);
  }
`;

export default function EventPage() {
  const [eventData, setEventData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [originalEventData, setOriginalEventData] = useState([]);
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchEventData();
        setEventData(result);
        setOriginalEventData(result); // 將原始數據保存下來
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchData();
  }, []);

  const openEventWebsite = (url) => {
    window.open(url, '_blank');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('zh-TW', options);
  };

  
  const handleSearch = () => {
    const lowerCaseSearchKeyword = searchKeyword.toLowerCase();

    if (lowerCaseSearchKeyword === '') {
      // 如果搜索條件為空，顯示所有活動
      setEventData(originalEventData);
    } else {
      // 否則，根據搜索條件篩選活動數據
      const filteredEvents = originalEventData.filter(event =>
        event.event_title.toLowerCase().includes(lowerCaseSearchKeyword) ||
        event.event_date.toLowerCase().includes(lowerCaseSearchKeyword) ||
        event.event_location.toLowerCase().includes(lowerCaseSearchKeyword) ||
        event.event_organizer.toLowerCase().includes(lowerCaseSearchKeyword) ||
        event.event_description.toLowerCase().includes(lowerCaseSearchKeyword)
      );

      // 更新活動數據，只顯示符合搜索條件的活動
      setEventData(filteredEvents);
    }
  };


 

  const handleSort = (option) => {
    let sortedEvents = [...eventData];

    switch (option) {
      case 'dateNewToOld':
        sortedEvents.sort((a, b) => new Date(b.event_date) - new Date(a.event_date));
        break;
      case 'dateOldToNew':
        sortedEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        break;
      // 添加其他排序選項，根據需要
      default:
        break;
    }

    setEventData(sortedEvents);
    setSortOption(option);
  };

  const sortOptions = [
    { label: '新 → 舊', value: 'dateNewToOld' },
    { label: '舊 → 新', value: 'dateOldToNew' },
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Root>
      <FilterContainer>
        <EventTitle><h1>華語教學研討會、工作坊活動資訊</h1></EventTitle>
        <Input
          type="text"
          placeholder="請輸入關鍵字搜尋"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <ButtonSearch onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#fff", fontSize: "18px" }} />
        </ButtonSearch>

        <Label>日期排序</Label>
        <Select onChange={(e) => handleSort(e.target.value)} value={sortOption || ''}>
          <option value="">顯示所有活動</option>
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </Select>
      </FilterContainer>

      <EventContainer>
        {eventData.map((event, index) => (
          <EventCard key={index}>
            <EventName>{event.event_title}</EventName>
            <hr></hr>
            <EventInfo>
              <Title>日期:</Title> <Content>{formatDate(event.event_date)}</Content><br />
              <Title>地點:</Title> <Content>{event.event_location}</Content><br />
              <Title>主辦單位:</Title> <Content>{event.event_organizer}</Content><br />
              <Title>簡介:</Title> <Content>{event.event_description}</Content><br />
            </EventInfo>
            <Button onClick={() => openEventWebsite(event.event_website)}>前往活動網站</Button>
          </EventCard>
        ))}
      </EventContainer>
    </Root>
  );
};
