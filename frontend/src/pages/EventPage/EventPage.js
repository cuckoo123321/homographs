import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { fetchEventData } from '../../WebAPI';
import { MEDIA_QUERY_MOBILE, MEDIA_QUERY_TABLET, MEDIA_QUERY_DESKTOP, MEDIA_QUERY_LARGE_DESKTOP } from '../../constants/style';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap; 
  margin-top: 70px;
`;

const EventTitle = styled.div`
  h1 {
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
    margin-top: 70px;
`;

const EventContainer = styled.div`
  width: 1375px;
  height: 100%;
  padding: 50px 0;
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
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await fetchEventData();
          setEventData(result);
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
    
  
    return (
      <Root>
        <EventTitle><h1>華語教學研討會、工作坊活動資訊</h1></EventTitle>
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
  