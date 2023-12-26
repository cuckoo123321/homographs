import React from 'react';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { getMe } from '../../WebAPI'; 
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {  useLocation } from "react-router-dom";
import { updateUserData } from '../../WebAPI';
import UserNav from './UserNav';
import { MEDIA_QUERY_MOBILE } from '../../constants/style';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 70px;

`;

const UserAreaContainer = styled.div`
  width: 520px;
  height: 100%;
  padding: 40px 20px;
  margin-bottom: 200px;
  border: 1px solid #ddd; 
  border-radius: 8px; /* 圓角 */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  ${MEDIA_QUERY_MOBILE} {
    width: 350px;
  }
`;

const UserAreaTitle = styled.div`
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

const Alert = styled.label`
  color: rgb(173 62 74);
  margin:0 0 0 55px;
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
  letter-spacing: .1rem;

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

export default function UserEdit () {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [editedUserData, setEditedUserData] = useState({
        user_id: '',
        user_name: '',
        user_password: '',
        user_email: '',
        user_gender: '',
        user_birthdate: '',
      });
      

    // 將 UTC 字符串轉換為日期對象
    const birthdateDate = new Date(editedUserData.user_birthdate);
    const formattedBirthdate = isNaN(birthdateDate) ? '' : birthdateDate.toISOString().split('T')[0];

    // 使用 toLocaleDateString 方法轉換為本地日期字符串
    const currentDate = new Date().toISOString().split('T')[0];


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getMe();
                if (response.success) {                 
                    setUserData(response.user);
                    setEditedUserData(response.user);
                } else {
                    console.error('獲取使用者資料失敗:', response.message);
                    // API 回應中 success 為 false，表示身份驗證已經失效
                    window.alert('身份驗證已逾時，請重新登入');
                    navigate('/login'); // 將用戶導向登入頁面
                }
            } catch (error) {
                console.error('發生錯誤:', error);
            } 
        };

        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;    
        // 檢查是否嘗試更改 user_name
        if (name === 'user_name') {
          setErrorMessage('帳號不能修改');
          return;
        } 
        
        // 檢查是否嘗試更改 user_password 或 confirm_password
        if (name === 'user_password' || name === 'confirm_password') {
          setErrorMessage(''); // 清除之前的錯誤消息
        }

        //更新狀態
        setEditedUserData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault(); 
       
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // 提示確認修改會員資料
        const confirmed = window.confirm('確認修改會員資料？');
    
        if (!confirmed) {
            // 如果用戶取消了操作，不執行後續代碼
            return;
        }      
    
        // 重置錯誤訊息
        setErrorMessage('');
    
        //檢查是否嘗試更改 user_name
        if (editedUserData.user_name !== userData.user_name) {
            setErrorMessage('帳號不能修改');
            return;
        }    
    
        // 如果有新輸入的密碼，檢查是否符合正則表達式        
        if (editedUserData.user_password && !passwordRegex.test(editedUserData.user_password)) {
          if (editedUserData.user_password.length < 8) {
              // 密碼長度不夠
              setErrorMessage('密碼長度需至少為 8 個字元');
          } else {
              // 密碼未同時包含大小寫英文、數字和特殊字元
              setErrorMessage('密碼需同時包含大小寫英文、數字和特殊字元');
          }
          return;
      }

      // 檢查是否填寫了新密碼
      if (editedUserData.user_password === undefined) {
        setErrorMessage('請填寫新密碼');
        return;
      }

      // 檢查兩次輸入的密碼是否相同
      if (editedUserData.user_password !== confirmPassword) {
        setErrorMessage('兩次輸入的密碼不相同');
        return;
      }

    
        // 如果有新輸入的電子郵件，檢查是否符合正則表達式
        if (editedUserData.user_email && !emailRegex.test(editedUserData.user_email)) {
            setErrorMessage('Email 格式不正確');
            return;
        }
    
        try {
            // 調用 API 更新使用者資料
            const updateResponse = await updateUserData(editedUserData);          
            if (updateResponse.success) {
                // 更新成功的處理，可以導航回會員資料頁面或顯示成功信息
                alert('成功修改會員資料');
                navigate('/userArea');
            } else {
                console.error('更新使用者資料失敗:', updateResponse.message);
            }
        } catch (error) {
            console.error('發生錯誤:', error);
        }
    };
    const goToUserArea = () => {
      navigate("/userArea");
    };

    //隱藏、顯示密碼
    const togglePasswordVisibility = (e) => {
      e.preventDefault();
      setPasswordVisible(!passwordVisible);
    };

    return (
        <Root>
            <UserNav location={location} />

        <UserAreaContainer>
          <UserAreaTitle>
            <h1>修改會員資料</h1>
          </UserAreaTitle>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <Form>
            <FormGroup>
              <Label htmlFor="user_name">帳號：</Label>
              <Input type="text" value={editedUserData.user_name} name="user_name" onChange={handleInputChange} disabled required="required"/>
            </FormGroup>
            <FormGroup>
              <Alert>＊為保護您的資訊安全，請重新輸入密碼或更新密碼</Alert>
            </FormGroup>
            <FormGroup style={{marginTop: "-10px"}}>              
              <Label htmlFor="user_password">密碼：</Label>
              <Input 
                type={passwordVisible ? 'text' : 'password'}
                placeholder="密碼至少 8 個字元，包括大小寫字母、數字和特殊字元" value={undefined} name="user_password" 
                onChange={handleInputChange}                 
                required="required" />
                <TogglePasswordButton onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
              </TogglePasswordButton>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="confirm_password">確認：</Label>
            <Input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="再次輸入密碼"
              value={confirmPassword}
              name="confirm_password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required="required"
            />
            <TogglePasswordButton onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
              </TogglePasswordButton>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_email">信箱：</Label>
            <Input type="email"  placeholder="example@example.com"  value={editedUserData.user_email} name="user_email" onChange={handleInputChange} required="required"/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_gender">性別：</Label>
            <select className="form-select" value={editedUserData.user_gender} name="user_gender" onChange={handleInputChange}>
              <option disabled>請選擇性別</option>
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="other">其他</option>
            </select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="user_birthdate">生日：</Label>
            <Input type="date" value={formattedBirthdate} name="user_birthdate" onChange={handleInputChange} max={currentDate} />
          </FormGroup>
            <ButtonContainer>
              <Button type="submit" onClick={handleSubmit}>
                送出
              </Button>
              <Button type="button" onClick={goToUserArea}>
                取消
              </Button>
            </ButtonContainer>  
          </Form>
        </UserAreaContainer>
      </Root>
    );
  };