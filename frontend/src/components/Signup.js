import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Logo from '../Pictures/logo.jpeg';

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
`;

const SplitSignInContainer = styled.div`
  display: flex;
  height: 100vh;
  margin: 0;
`;

const BlueSidebar = styled.div`
  width: 50%;
  background-color: #053262;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
  max-width: 70%;
  height: auto;
`;

const ContentContainer = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f7;
`;

const SignInContainer = styled.div`
  width: 50%; /* Genişlik ayarı burada */
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Heading = styled.h2`
  color: #18191a;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  text-align: left;
  color: #18191a;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-sizing: border-box;
`;

const SignInButton = styled.button`
  background-color: #00a8cc;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SignUp = ({ onSignUp }) => {
  const [fullName, setFullName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Lütfen geçerli bir email adresi girin.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName, lastName, email, password }),
      });
  
      const data = await response.json();
  
      if (response.status === 200) {
        console.log('Kayıt başarılı!');
        alert('Kayıt Başarılı Bir Şekilde Oluşturuldu!')
        navigate('/Login'); 
      } else if (response.status === 409) {
        console.log('Email already exists');
        alert('Bu email adresi ile daha önce kayıt olunmuş.');
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
    }
  };
  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <>
      <GlobalStyle />
      <SplitSignInContainer>
        <BlueSidebar>
          <LogoImage src={Logo} alt="Logo" />
        </BlueSidebar>
        <ContentContainer>
          <SignInContainer>
            <Heading>Kayıt Ol</Heading>
            <InputGroup>
              <Label>Ad: </Label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            <InputGroup>
              <Label>Soyad: </Label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            <InputGroup>
              <Label>Email:</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            <InputGroup>
              <Label>Şifre:</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            <SignInButton onClick={handleSignUp}>Kayıt Ol</SignInButton>
          </SignInContainer>
        </ContentContainer>
      </SplitSignInContainer>
    </>
  );
};

export default SignUp;
