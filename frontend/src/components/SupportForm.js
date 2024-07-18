import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const Wrapper = styled.div`
  max-width: 800px;
  margin-top:3% !important;
  margin: 0 auto;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  resize: none;
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

const SupportForm = () => {
  const [email, setEmail] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/SupportForm', {
        email,
        suggestions,
      });
      alert('Form başarı ile gönderildi.');
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Form gönderilirken bir hata oluştu.');
    }
  };

  return (
    <Wrapper>
      <FormTitle>Müşteri Destek</FormTitle>
      <FormContainer onSubmit={handleSubmit}>
        <label>
          E-posta:
          <InputField 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </label>
        <label>
          Önerileriniz:
          <TextArea 
            rows="4" 
            value={suggestions} 
            onChange={(e) => setSuggestions(e.target.value)} 
            required 
          />
        </label>
        <SubmitButton type="submit">Gönder</SubmitButton>
      </FormContainer>
    </Wrapper>
  );
};

export default SupportForm;
