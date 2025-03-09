import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 140px);
  background-color: #f5f5f5;
`;

const Profile: React.FC = () => {
  return (
    <ProfileContainer>
      <h1>Профиль</h1>
    </ProfileContainer>
  );
};

export default Profile; 