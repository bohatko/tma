import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface NotificationProps {
  show: boolean;
  message: string;
  type: 'success' | 'error';
}

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div<{ show: boolean; type: 'success' | 'error' }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background-color: ${props => props.type === 'success' ? '#4CAF50' : '#F44336'};
  color: white;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${props => props.show ? slideIn : slideOut} 0.3s ease-in-out forwards;
  display: ${props => props.show ? 'block' : 'none'};
`;

const Notification: React.FC<NotificationProps> = ({ show, message, type }) => {
  return (
    <NotificationContainer show={show} type={type}>
      {message}
    </NotificationContainer>
  );
};

export default Notification; 