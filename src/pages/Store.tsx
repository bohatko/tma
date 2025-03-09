import React from 'react';
import styled from 'styled-components';

const StoreContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 140px);
  background-color: #f5f5f5;
`;

const Store: React.FC = () => {
  return (
    <StoreContainer>
      <h1>Магазин</h1>
    </StoreContainer>
  );
};

export default Store; 