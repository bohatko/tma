import React from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 20px;
`;

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <h1>Главная</h1>
    </HomeContainer>
  );
};

export default Home; 