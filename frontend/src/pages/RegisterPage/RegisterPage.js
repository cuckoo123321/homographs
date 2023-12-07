import React from 'react';
import styled from 'styled-components';
import { registerUser } from '../../WebAPI';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;
`;

const RegisterContainer = styled.div`
  width: 520px;
  height: 100%;
  padding: 80px 20px;
  margin-top: 100px;
  border: 1px solid #ddd; 
  border-radius: 8px; /* 圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const RegisterTitle = styled.div`
  h1 {
    text-align: center;
    font-weight: 500;
    color: rgb(47, 150, 169);
    letter-spacing: 0.04em;
  }
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

const ErrorMessage = styled.label`
  display: block;
  margin: 20px 0px 20px 0px;
  font-weight: 500;
  color: rgb(173 62 74);
`;

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
  margin-top: 20px;

  &:hover {
    background-color: rgb(35 112 128);
  }
`;

export default function RegistrationPage() {
  const navigate = useNavigate();
  const [user_name, setUsername] = useState('');
  const [user_password, setPassword] = useState('');
  const [user_email, setEmail] = useState('');
  const [user_gender, setGender] = useState('');
  const [user_birthdate, setBirthdate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 簡單的正則表達式驗證
    const usernameRegex = /^[a-zA-Z0-9]{6,12}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 非空驗證
    if (!user_name || !user_password || !user_email) {
      setErrorMessage('必填欄位不可空白');
      return;
    }

    if (!usernameRegex.test(user_name)) {
      if (user_name.length < 6) {
        // 帳號長度不夠
        setErrorMessage('帳號長度需至少為 6 個字元');
      } else {
        // 帳號未同時包含英文和數字
        setErrorMessage('帳號需同時包含英文和數字');
      }
      //setErrorMessage('帳號格式不正確');
      return;
    }

    if (!passwordRegex.test(user_password)) {
      if (user_password.length < 8) {
        // 密碼長度不夠
        setErrorMessage('密碼長度需至少為 8 個字元');
      } else {
        // 密碼未同時包含大小寫英文、數字和特殊字元
        setErrorMessage('密碼需同時包含大小寫英文、數字和特殊字元');
      }
      //setErrorMessage('密碼格式不正確');
      return;
    }
     // 檢查第二次輸入的密碼是否與第一次相同
    if (user_password !== confirmPassword) {
      setErrorMessage('兩次輸入的密碼不一致');
      return;
    }

    if (!emailRegex.test(user_email)) {
      setErrorMessage('Email 格式不正確');
      return;
    }
    // 防止選擇未來日期
    const currentDate = new Date().toISOString().split('T')[0];
    if (user_birthdate > currentDate) {
      setErrorMessage('生日不能選擇未來日期');
      return;
    }

    // 收集使用者輸入的資料
    const userData = {
      user_name,
      user_password,
      user_email,
      user_gender,
      user_birthdate,
    };

    try {
      // 發送註冊請求到後端
      const response = await registerUser(userData);
    
      // 處理 API 回應
      if (response.success) {
        // 註冊成功，導航到登入頁面或其他頁面
        alert('註冊成功，請登入');
        navigate('/login');
      } else {
        // 註冊失敗，更新錯誤訊息
        if (response.message) {
          // 如果後端返回了訊息，使用後端提供的訊息
          alert(response.message);
        } else {
          // 如果沒有明確的錯誤訊息，使用一般性錯誤訊息
          setErrorMessage('註冊失敗，請稍後再試');
        }
      }
    } catch (error) {
      console.error('註冊失敗:', error);
    
      // 如果是 axios 錯誤，可以從錯誤對象中獲取更多信息
      if (error.response) {
        if (error.response.status === 400) {
          // 如果是 400 錯誤，使用後端提供的錯誤消息
          alert(error.response.data.message);
        } else {
          // 其他錯誤處理邏輯
          setErrorMessage('伺服器錯誤');
        }
      } else {
        // 如果不是 axios 錯誤，可能是其他類型的錯誤，使用一般性錯誤訊息
        setErrorMessage('註冊失敗，請稍後再試');
      }
    }
  };

  //隱藏、顯示密碼
  const togglePasswordVisibility = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Root>
      <RegisterContainer>
        <RegisterTitle>
          <h1>註冊會員</h1>
        </RegisterTitle>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="user_name">帳號<span className="required-star">*</span></Label>
            <Input
              type="text"
              placeholder="帳號至少包含 6 到 12 個英、數字元"
              required="required"
              value={user_name}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_password">密碼<span className="required-star">*</span></Label>
            <Input
               type={passwordVisible ? 'text' : 'password'}
              placeholder="密碼至少 8 個字元，包括大小寫字母、數字和特殊字元"
              required="required"
              value={user_password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TogglePasswordButton onClick={togglePasswordVisibility}>
            <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </TogglePasswordButton>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirm_password">確認<span className="required-star">*</span></Label>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="再次輸入密碼以確認"
              required="required"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <TogglePasswordButton onClick={togglePasswordVisibility}>
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </TogglePasswordButton>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_email">信箱<span className="required-star">*</span></Label>
            <Input 
              type="email" 
              placeholder="example@example.com" 
              required="required"
              value={user_email}
              onChange={(e) => setEmail(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_gender">性別：</Label>
            <select 
              className="form-select" 
              name="user_gender" 
              value={user_gender}              
              onChange={(e) => setGender(e.target.value)}>
              <option disabled selected>
                請選擇性別
              </option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">其他</option>
            </select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_birthdate">生日：</Label>
            <Input 
              type="date" 
              placeholder="請選擇生日"
              value={user_birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split('T')[0]} />
          </FormGroup>
          <Button type="submit">
            送出
          </Button>
        </Form>
      </RegisterContainer>
    </Root>
  );
}

