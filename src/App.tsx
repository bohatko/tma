import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Mining from './pages/Mining';
import Store from './pages/Store';
import Profile from './pages/Profile';
import BottomNavigation from './components/BottomNavigation';

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

function App() {
  return (
    <Router>
      <AppWrapper>
        <StyledApp>
          <Container>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <TonConnectButton />
            </div>
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
