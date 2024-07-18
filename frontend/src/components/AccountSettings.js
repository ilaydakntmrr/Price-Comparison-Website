import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Wrapper = styled.div`
  max-width: 800px;
  margin: 3% auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormTitle = styled.h2`
  text-align: center;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;

  &:hover {
    background-color: #45a049;
  }
`;

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    axios.get('/api/user')
      .then(response => {
        const { firstName, lastName, email } = response.data;
        setUserData({
          firstName,
          lastName,
          email,
          password: ''
        });
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('/api/user', userData) 
      .then(response => {
        console.log('User data updated successfully:', response.data);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  return (
    <Wrapper>
      <FormTitle>Hesap Ayarları</FormTitle>
      <FormContainer onSubmit={handleSubmit}>
        <label>
          Ad:
          <InputField
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Soyad:
          <InputField
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <InputField
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Şifre:
          <InputField
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            minLength={8} 
          />
        </label>
        <SubmitButton type="submit">Değişiklikleri Kaydet</SubmitButton>
      </FormContainer>
    </Wrapper>
  );
};

export default AccountSettings;
