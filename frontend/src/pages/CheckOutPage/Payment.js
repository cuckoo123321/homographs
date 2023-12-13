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

export default function Payment () {
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
        
           </ShippingAddressContainer>  
        </Root>
        
    
    );
  };
  