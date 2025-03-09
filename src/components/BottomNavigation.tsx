import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const NavContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #FFFFFF;
  box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
`;

const NavItem = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => props.active ? '#046611' : '#8E8E93'};
  font-size: 12px;
  cursor: pointer;
  padding: 8px;
  
  svg {
    margin-bottom: 4px;
    font-size: 24px;
  }
`;

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavContainer>
      <NavItem 
        active={isActive('/mining')} 
        onClick={() => navigate('/mining')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
          <line x1="12" y1="12" x2="12" y2="17"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        Майнинг
      </NavItem>
      
      <NavItem 
        active={isActive('/store')} 
        onClick={() => navigate('/store')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
        </svg>
        Аренда
      </NavItem>
      
      <NavItem 
        active={isActive('/profile')} 
        onClick={() => navigate('/profile')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        Профиль
      </NavItem>
    </NavContainer>
  );
};

export default BottomNavigation; 