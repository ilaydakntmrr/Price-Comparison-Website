import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Logo from '../Pictures/logo.jpeg';

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    overflow: hidden;
  }
`;

const SplitResetPasswordContainer = styled.div`
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

const ResetPasswordContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  top: 10%;
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

const ResetPasswordButton = styled.button`
  background-color: #004a9e;
  color: #fff;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AlertContainer = styled.div`
  background-color: #5fb873;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;


const AlertMessage = styled.p`
  font-size: 14px;
  margin: 0;
  text-align:center;
`;

const ActionButton = styled.button`
  background-color: #fff;
  color: #053262;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 5px;
  display: block;
  margin: 0 auto; /* Butonu ortala */
  margin-top:1%;
`;

const ResetPassword = () => {
  const [ad, setFirstName] = useState('');
  const [soyad, setLastName] = useState('');
  const [eposta, setEmail] = useState('');
  const [yeniSifre, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [showTryAgainButton, setShowTryAgainButton] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/reset-password', {
        ad,
        soyad,
        eposta,
        yeniSifre,
      });

      console.log(response.data);
      setResetSuccess(true);
      setInvalidInput(false);
      setShowTryAgainButton(false);
    } catch (error) {
      console.error('Şifre sıfırlama sırasında bir hata oluştu:', error);
      setResetSuccess(false);
      setInvalidInput(true);
      setShowTryAgainButton(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setNewPassword('');
    setResetSuccess(false);
    setInvalidInput(false);
    setShowTryAgainButton(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleResetPassword();
    }
  };

  return (
    <>
      <GlobalStyle />
      <SplitResetPasswordContainer>
        <BlueSidebar>
          <LogoImage src={Logo} alt="Logo" />
        </BlueSidebar>
        <ContentContainer>
          <ResetPasswordContainer>
          <AlertContainer isVisible={resetSuccess || invalidInput}>
            <AlertMessage>
              {resetSuccess ? 'Şifreniz başarıyla değiştirildi.' : 'Hatalı veri girişi. Şifre sıfırlama başarısız.'}
            </AlertMessage>
            {showTryAgainButton && <ActionButton onClick={handleTryAgain}>Tekrar Dene</ActionButton>}
            {resetSuccess && <ActionButton onClick={handleLoginRedirect}>Oturum Aç</ActionButton>}
          </AlertContainer>
            <Heading>Şifre Sıfırla</Heading>
            <InputGroup>
              <Label>Ad:</Label>
              <Input type="text" value={ad} onChange={(e) => setFirstName(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>Soyad:</Label>
              <Input type="text" value={soyad} onChange={(e) => setLastName(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>Email:</Label>
              <Input type="email" value={eposta} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
            <InputGroup>
              <Label>Yeni Şifre:</Label>
              <Input
                type="password"
                value={yeniSifre}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </InputGroup>
            <ResetPasswordButton onClick={handleResetPassword}>Şifreyi Sıfırla</ResetPasswordButton>
          </ResetPasswordContainer>
          
        </ContentContainer>
      </SplitResetPasswordContainer>
    </>
  );
};

export default ResetPassword;
