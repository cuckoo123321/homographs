import React from 'react';
import styled from 'styled-components';
import {  useState, useContext } from 'react';
import { login } from '../../WebAPI';
import { setAuthToken } from '../../constants/utils';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

const LoginContainer = styled.div`
  width: 500px;
  height: 100%;
  padding: 80px 20px;
  margin-top: 100px;
  border: 1px solid #ddd; 
  border-radius: 8px; /* 圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const LoginTitle = styled.div`
  h1 {
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
    margin-bottom: 50px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const ErrorMessage = styled.label`
  display: block;
  margin: -20px 0px 20px 0px;
  font-weight: 500;
  color: rgb(173 62 74);
`;


const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  margin-left: -20px; /*調整 icon 與密碼輸入框的距離*/
  color: grey;
`;

const Button = styled.button`
  background-color: rgb(47, 150, 169);
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;

  &:hover {
    background-color: rgb(35 112 128);
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;

  /* 設置 Button 的寬度為一半 */
  & ${Button} {
    flex: 1;
  }

  /* 加入中間的距離 */
  & ${Button}:first-child {
    margin-right: 10px;
  }

  & ${Button}:last-child {
    margin-left: 10px;
  }
`;

export default function LoginPage() {
  const [user_name, setUsername] = useState('');
  const [user_password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // 防止表單自動提交

    setErrorMessage(null);

    if (!user_name || !user_password) {
      setErrorMessage("帳號和密碼不可空白");
      return;
    }

    try {
      const loginResponse = await login(user_name, user_password);

          if (loginResponse.success) {
              setAuthToken(loginResponse.token);
              setUser(loginResponse.user);  // loginResponse 中包含 user 資料              
              navigate("/");
          } else {
              setAuthToken(null);
              setErrorMessage(loginResponse.message);
          }
      } catch (error) {
          console.error('登入時發生錯誤:', error);
          setErrorMessage('伺服器錯誤');
      }
  }
  const handleRegister = () => {
    navigate("/register");
  }
  //隱藏、顯示密碼
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };
  return (
    <Root>
      <LoginContainer>
        <LoginTitle><h1>會員登入</h1></LoginTitle>
        <Form onSubmit={handleSubmit}>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <FormGroup>            
            <Input type="text" value={user_name} onChange={e => setUsername(e.target.value)} id="user_name" placeholder="請輸入帳號" required="required"/>
          </FormGroup>
          <FormGroup>           
            <Input type={passwordVisible ? 'text' : 'password'} value={user_password} onChange={e => setPassword(e.target.value)} id="user_password" placeholder="請輸入密碼" required="required"/>
            <TogglePasswordButton onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </TogglePasswordButton>
          </FormGroup>
          <Button type="button" onClick={handleSubmit} style={{ margin: "20px 0px" }}>登入</Button>
          <ButtonContainer>
            <Button type="button">忘記密碼？</Button>
            <Button type="button" onClick={handleRegister}>註冊會員</Button>
          </ButtonContainer>
        </Form>
      </LoginContainer>
    </Root>
  );
}
