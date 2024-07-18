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

const SplitLoginContainer = styled.div`
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
  display: block;
  justify-content: center;
  align-items: center;
  background-color: #f0f4f7;
`;

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  top: 20%;
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

const LoginButton = styled.button`
  background-color: #004a9e;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ForgotPasswordLink = styled.a`
  color: #3498db;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
  display: block;
`;

const AlertContainer = styled.div`
  background-color: #e74c3c;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;

const AlertMessage = styled.p`
  font-size: 14px;
  margin: 0;
`;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        console.log('Giriş başarılı!');
        onLogin(data.token); 
        navigate('/');
      } else {
        console.log(data.error);
        setShowAlert(true); 
      }
    } catch (error) {
      console.error('Bir hata oluştu:', error);
      setShowAlert(true); 
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    navigate('/sifre-sifirla');
  };

  return (
    <>
      <GlobalStyle />
      <SplitLoginContainer>
        <BlueSidebar>
          <LogoImage src={Logo} alt="Logo" />
        </BlueSidebar>
        <ContentContainer>
          <LoginContainer>
            <AlertContainer isVisible={showAlert}>
              <AlertMessage>Email ya da şifreniz hatalı.</AlertMessage>
            </AlertContainer>
            <Heading>Giriş Yap</Heading>
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
            <LoginButton onClick={handleLogin}>Giriş Yap</LoginButton>
            <ForgotPasswordLink onClick={handleForgotPassword}>
              Parolamı Unuttum
            </ForgotPasswordLink>
          </LoginContainer>
        </ContentContainer>
      </SplitLoginContainer>
    </>
  );
};

export default Login;
