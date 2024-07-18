import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import BackgroundImage from '../Pictures/background.png'; 

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    overflow: hidden; /* Scroll barı gizle */
  }
`;

const SplitLoginContainer = styled.div`
  display: flex;
  height: 100vh;
  margin: 0;
  background-image: url(${BackgroundImage});
  background-size: cover;
  background-position: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding-right: 10%; 
`;

const Title = styled.h1`
  color: #f0f4f7; 
  font-size: 30px; 
  margin-bottom: 40px; 
  font-family: 'Roboto Mono', monospace;
  text-align: right; 
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end; 
  gap: 10px;
`;

const AuthButton = styled.button`
  width: 200px; 
  height: 50px; 
  background-color: #f0f4f7;
  color: #063263;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/Login');
  };

  const handleSignin = () => {
    navigate('/Signup');
  };

  return (
    <>
      <GlobalStyle />
      <SplitLoginContainer>
        <ContentContainer>
          <Title>BAKK-AL'A HOŞGELDİNİZ!</Title>
          <ButtonContainer>
            <AuthButton onClick={handleLogin}>Oturum Aç</AuthButton>
            <AuthButton onClick={handleSignin}>Kayıt Ol</AuthButton>
          </ButtonContainer>
        </ContentContainer>
      </SplitLoginContainer>
    </>
  );
};

export default WelcomePage;
