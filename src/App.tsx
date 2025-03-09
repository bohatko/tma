import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Mining from './pages/Mining';
import Store from './pages/Store';
import Profile from './pages/Profile';
import BottomNavigation from './components/BottomNavigation';
import { useEffect, useState } from "react";
import { useTelegram } from "./hooks/useTelegram";

const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  position: relative;
  overflow-y: auto;
`;

const StyledApp = styled.div`
  padding: 20px;
  padding-bottom: 80px;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div<{ bgUrl?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ccc;
  background-image: ${props => props.bgUrl ? `url(${props.bgUrl})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  overflow: hidden;
  font-size: 14px;
  color: white;
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #333;
`;

function App() {
  const { user, ready, error } = useTelegram();

  return (
    <Router>
      <AppWrapper>
        <StyledApp>
          <Container>
            <HeaderContainer>
              <UserInfoContainer>
                {user && (
                  <>
                    <UserAvatar bgUrl={user.photo_url}>
                      {!user.photo_url && user.first_name.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserName>
                      {user.first_name} {user.last_name}
                    </UserName>
                  </>
                )}
                {!user && !error && <UserName>Загрузка...</UserName>}
                {error && <UserName>Гость</UserName>}
              </UserInfoContainer>
              <TonConnectButton />
            </HeaderContainer>
            <Routes>
              <Route path="/" element={<Navigate to="/mining" replace />} />
              <Route path="/mining" element={<Mining />} />
              <Route path="/store" element={<Store />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Container>
          <BottomNavigation />
        </StyledApp>
      </AppWrapper>
    </Router>
  );
}

export default App;
