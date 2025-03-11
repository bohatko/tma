import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import styled from "styled-components";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Mining from './pages/Mining';
import Store from './pages/Store';
import Profile from './pages/Profile';
import BottomNavigation from './components/BottomNavigation';
import { useEffect } from "react";
import { useTelegram } from "./hooks/useTelegram";
import { AppContextProvider } from "./context/AppContext";
import Notification from "./components/Notification";

const AppWrapper = styled.div`
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color, #FFFFFF);
  position: relative;
  overflow-y: auto;
`;

const StyledApp = styled.div`
  padding: 20px;
  padding-bottom: 80px;
  min-height: 100vh;
  background-color: var(--tg-theme-bg-color, #FFFFFF);
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

const AppContent = () => {
  const { user, ready, error, webApp } = useTelegram();
  const defaultUserImage = "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg";

  useEffect(() => {
    // Настраиваем цвета приложения в соответствии с темой Telegram
    if (webApp) {
      // Можно настроить colors, button, etc.
      console.log('Telegram WebApp инициализирован:', webApp.initDataUnsafe);

      // Настройка цветов
      document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color || '#FFFFFF');
      document.documentElement.style.setProperty('--tg-theme-text-color', webApp.themeParams.text_color || '#333333');
      document.documentElement.style.setProperty('--tg-theme-button-color', webApp.themeParams.button_color || '#0098E9');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', webApp.themeParams.button_text_color || '#ffffff');
    } else {
      // Если WebApp не инициализирован, используем белый фон
      document.documentElement.style.setProperty('--tg-theme-bg-color', '#FFFFFF');
    }
  }, [webApp]);

  return (
    <Router>
      <AppWrapper>
        <StyledApp>
          <Container>
            <HeaderContainer>
              <UserInfoContainer>
                {user && (
                  <>
                    <UserAvatar bgUrl={user.photo_url || defaultUserImage}>
                      {!user.photo_url && !defaultUserImage && user.first_name.charAt(0).toUpperCase()}
                    </UserAvatar>
                    <UserName>
                      {user.first_name} {user.last_name}
                    </UserName>
                  </>
                )}
                {!user && !error && <UserName>Загрузка...</UserName>}
                {error && (
                  <>
                    <UserAvatar bgUrl={defaultUserImage}>
                      G
                    </UserAvatar>
                    <UserName>Гость</UserName>
                  </>
                )}
              </UserInfoContainer>
              <TonConnectButton />
            </HeaderContainer>
            <Routes>
              <Route path="/" element={<Mining />} />
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

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
