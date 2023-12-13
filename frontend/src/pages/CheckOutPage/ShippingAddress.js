import React from 'react';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointRight, faHandPointLeft } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from "react-router-dom";
import CheckOutNav from './CheckOutNav';
import { fetchProductData } from '../../WebAPI';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

const ShippingAddressContainer = styled.div`
  width: 780px;
  margin-top: 30px;
  background-color: #fff;
  padding: 30px;
  border: 1px solid #ddd; 
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;


const FormGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin-bottom: 20px;

  label {
    margin-bottom: 8px;
  }

  .required-star {
    color: red;
    margin-left: 4px;
  }

  input,
  select,
  date {
    padding: 8px;
  }
`;

// const ErrorMessage = styled.label`
//   display: block;
//   margin: 20px 0px 20px 0px;
//   font-weight: 500;
//   color: rgb(173 62 74);
// `;

const Label = styled.label`
  width: 60px;
  display: block;
  margin: 10px 0px 20px 0px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;


const Button = styled.button`
  background-color: rgba(47, 150, 169);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 8px;
  cursor: pointer;
  width: 200px;
  margin:20px 20px 0 20px;
  &:hover{
    background: rgb(35 112 128);
  }
`;

export default function ShippingAddress () {
    const location = useLocation();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [productData, setProductData] = useState([]);
    const [showMaxQuantityAlert, setShowMaxQuantityAlert] = useState(false);

    const navigateToCheckOut = () => {
        navigate("/checkOut");
    };

    const handleSaveAddress = () => {
        navigate("/payment");
    };
    
    return (
        <Root>
           <CheckOutNav location={location} /> 

           <ShippingAddressContainer>
           <Form>
          <FormGroup>
            <Label htmlFor="recipient_name">姓名：</Label>
            <Input
              type="text"
              placeholder="請填寫收件人姓名"
              required="required"
            />
          </FormGroup>
          
          
          <FormGroup>
            <Label htmlFor="recipient_phone">電話：</Label>
            <Input 
              type="email" 
              placeholder="09XX-XXX-XXX" 
              required="required" />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="recipient_residence">地區：</Label>
            <select 
              className="form-select" 
              name="recipient_residence" 
              required="required">
              <option disabled selected>
                請選擇居住地區
              </option>
                <option value="Taipei">台北市</option>
                <option value="New Taipei">新北市</option>
                <option value="Keelung">基隆市</option>
                <option value="Yilan">宜蘭縣</option>
                <option value="Hsinchu">新竹市</option>
                <option value="Miaoli">苗栗縣</option>
                <option value="Taoyuan">桃園市</option>
                <option value="Taichung">台中市</option>
                <option value="Changhua">彰化縣</option>
                <option value="Nantou">南投縣</option>
                <option value="Yunlin">雲林縣</option>
                <option value="Chiayi">嘉義市</option>
                <option value="Tainan">台南市</option>
                <option value="Kaohsiung">高雄市</option>
                <option value="Pingtung">屏東縣</option>
                <option value="Taitung">台東縣</option>
                <option value="Hualien">花蓮縣</option>
                <option value="Penghu">澎湖縣</option>
                <option value="Kinmen">金門縣</option>
                <option value="Lienchiang">連江縣</option>
                <option value="Other">其他</option>
            </select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="recipient_address">地址：</Label>
            <Input
              type="text"
              placeholder="請填寫商品配送地址"
              required="required"
            />
          </FormGroup>
        </Form>
            <Button onClick={navigateToCheckOut}>
                <FontAwesomeIcon icon={faHandPointLeft} style={{color: "#fff", fontSize: "20px", marginRight: "10px"}} /> 
                回上一步                   
            </Button>
            <Button onClick={handleSaveAddress}>
                確認，下一步
                <FontAwesomeIcon icon={faHandPointRight} style={{color: "#fff", fontSize: "20px", marginLeft: "10px"}} />             
            </Button>
           </ShippingAddressContainer>  
        </Root>
        
    
    );
  };
  