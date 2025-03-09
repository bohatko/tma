import React, { useState } from 'react';
import styled from 'styled-components';
import { SERVER_TYPES } from '../types/server';
import { useAppContext } from '../context/AppContext';
import Notification from '../components/Notification';

const StoreContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 140px);
  background-color: var(--tg-theme-bg-color, #FFFFFF);
`;

const StoreTitle = styled.h1`
  margin-bottom: 20px;
  color: var(--tg-theme-text-color, #333);
  text-align: center;
`;

const ServersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 600px;
`;

const ServerCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ServerHeader = styled.div`
  background-color: #0098E9;
  color: white;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ServerName = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const ServerPrice = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const ServerContent = styled.div`
  padding: 15px;
  display: flex;
  gap: 15px;
`;

const ServerImage = styled.div`
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const ServerInfo = styled.div`
  flex: 1;
`;

const ServerDescription = styled.p`
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
`;

const ServerStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
`;

const ServerStat = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  
  span:first-child {
    color: #666;
  }
  
  span:last-child {
    font-weight: 500;
    color: #333;
  }
`;

const RentButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #0098E9;
  color: white;
  border: none;
  border-radius: 0 0 10px 10px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin: 0 auto;
`;

const Spinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 3px solid white;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Balance = styled.div`
  margin-bottom: 15px;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  
  span {
    color: #0098E9;
  }
`;

const Store: React.FC = () => {
  const { state, rentServer } = useAppContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  
  // Показываем уведомление
  const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Обработчик клика по кнопке "Аренда"
  const handleRentServer = async (serverId: string, serverName: string, price: number, hourlyIncome: number) => {
    // Проверяем, хватает ли баланса
    if (state.balance < price) {
      showNotificationMessage('Недостаточно средств для аренды сервера', 'error');
      return;
    }
    
    // Пытаемся арендовать сервер
    const success = await rentServer(serverId, serverName, price, hourlyIncome);
    
    if (success) {
      showNotificationMessage('Сервер успешно арендован!');
    } else {
      showNotificationMessage('Ошибка при аренде сервера', 'error');
    }
  };
  
  return (
    <StoreContainer>
      <Notification 
        show={showNotification} 
        message={notificationMessage} 
        type={notificationType} 
      />
      
      <StoreTitle>Аренда серверов</StoreTitle>
      
      <Balance>
        Ваш баланс: <span>{state.balance.toFixed(2)} USDT</span>
      </Balance>
      
      <ServersList>
        {SERVER_TYPES.map((server) => (
          <ServerCard key={server.id}>
            <ServerHeader>
              <ServerName>{server.name}</ServerName>
              <ServerPrice>{server.price} USDT</ServerPrice>
            </ServerHeader>
            
            <ServerContent>
              <ServerImage>
                <img src={server.imageUrl} alt={server.name} />
              </ServerImage>
              
              <ServerInfo>
                <ServerDescription>{server.description}</ServerDescription>
                
                <ServerStats>
                  <ServerStat>
                    <span>Доход в час:</span>
                    <span>{server.hourlyIncome.toFixed(8)} USDT</span>
                  </ServerStat>
                  
                  <ServerStat>
                    <span>Доход в день:</span>
                    <span>{(server.hourlyIncome * 24).toFixed(4)} USDT</span>
                  </ServerStat>
                  
                  <ServerStat>
                    <span>Цена в Stars:</span>
                    <span>{server.starsPrice} Stars</span>
                  </ServerStat>
                </ServerStats>
              </ServerInfo>
            </ServerContent>
            
            <RentButton
              onClick={() => handleRentServer(server.id, server.name, server.price, server.hourlyIncome)}
              disabled={state.loading || state.balance < server.price}
            >
              {state.loading ? <SpinnerContainer><Spinner /></SpinnerContainer> : 'Арендовать'}
            </RentButton>
          </ServerCard>
        ))}
      </ServersList>
    </StoreContainer>
  );
};

export default Store; 