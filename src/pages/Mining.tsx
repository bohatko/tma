import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Notification from '../components/Notification';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/formatDate';
import { useNavigate } from 'react-router-dom';

const MiningContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: calc(100vh - 140px);
  background-color: var(--tg-theme-bg-color, #FFFFFF);
`;

const BonusCard = styled.div`
  background-color: #0098E9;
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  margin: 20px 0;
  width: 110%;
  max-width: 600px;
  transition: transform 0.3s ease;
  text-align: center;
  
  h2 {
    font-size: 24px;
    color: white;
    margin: 0;
  }
`;

const EarningsAmount = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: white;
  margin-top: 5px;
  text-align: center;
`;

const CoinIcon = styled.div`
  width: 24px;
  height: 24px;
  background: #90EE90;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusCircle = styled.div<{ isMining: boolean }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: ${props => props.isMining ? '#0098E9' : '#000000'};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MiningIcon = styled.div<{ isMining: boolean }>`
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
`;

const MiningStatusText = styled.div`
  text-align: center;
  margin: 10px 0;
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.children === 'Майнинг активен' ? '#0098E9' : '#000000'};
`;

const TransactionCard = styled.div`
  background: #FFFFFF;
  padding: 15px;
  border-radius: 12px;
  width: 110%;
  max-width: 600px;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TransactionTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #f5f5f5;
  
  &:last-child {
    border-bottom: none;
  }
  
  div:first-child {
    div:first-child {
      font-weight: 500;
      color: #333;
    }
    
    div:last-child {
      font-size: 12px;
      color: #999;
    }
  }
  
  div:last-child {
    font-weight: 600;
    color: #4CAF50;
    
    &[data-negative="true"] {
      color: #F44336;
    }
  }
`;

const TransactionLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TransactionIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #0098E9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const TransactionAmount = styled.div`
  font-weight: 500;
  color: #046611;
`;

const WithdrawButton = styled.button`
  background-color: white;
  color: #0098E9;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 15px auto;
  display: block;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const AlertOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AlertCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const AlertTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
`;

const AlertInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 16px;
`;

const AlertButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const AlertButton = styled.button<{ primary?: boolean }>`
  background-color: ${props => props.primary ? 'var(--tg-theme-button-color, #0098E9)' : '#f5f5f5'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  font-size: 14px;
  cursor: pointer;
`;

const TransactionHistory = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
`;

const ServerSection = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  margin: 15px 0;
  color: #333;
  text-align: center;
  font-weight: 600;
`;

const ServerStatsCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 0px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  span:first-child {
    color: #666;
  }
  
  span:last-child {
    font-weight: 500;
    color: #333;
  }
`;

const ServersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ServerCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ServerHeader = styled.div`
  background-color: #0098E9;
  color: white;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ServerName = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

const ServerContent = styled.div`
  padding: 10px 15px;
`;

const ServerStat = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
  
  span:first-child {
    color: #666;
  }
  
  span:last-child {
    font-weight: 500;
    color: #333;
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-style: italic;
`;

const RentButton = styled.button`
  background-color: var(--tg-theme-button-color, #0098E9);
  color: var(--tg-theme-button-text-color, white);
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin: 10px 0;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const ServerStatus = styled.div<{ isActive: boolean }>`
  color: ${props => props.isActive ? '#4CAF50' : '#F44336'};
  font-weight: 500;
  font-size: 14px;
  margin-top: 5px;
`;

const Mining: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();

  // Автозапуск майнинга при загрузке страницы
  useEffect(() => {
    startMining();
  }, []);

  // Функция запуска майнинга
  const startMining = () => {
    if (state.rentedServers.length === 0) {
      showNotificationMessage('Для начала майнинга необходимо арендовать сервер', 'error');
      return;
    }

    let earningsInterval = setInterval(() => {
      if (state.rentedServers.length > 0) {
        const now = Date.now();
        state.rentedServers.forEach(server => {
          // Проверяем, не истек ли срок аренды
          const rentEndDate = server.rentDate + (30 * 24 * 60 * 60 * 1000); // 30 дней в миллисекундах
          if (now > rentEndDate) {
            return;
          }

          const hourlyIncome = server.hourlyIncome;
          const incomeAmount = hourlyIncome * 5 / 3600;

          if (incomeAmount > 0) {
            dispatch({
              type: 'SET_BALANCE',
              payload: state.balance + incomeAmount
            });

            dispatch({
              type: 'ADD_TRANSACTION',
              payload: {
                id: Date.now().toString() + server.id,
                type: 'INCOME',
                amount: incomeAmount,
                description: `Доход от сервера "${server.name}"`,
                timestamp: new Date(),
                serverId: server.id,
                serverName: server.name
              }
            });
          }
        });
      }
    }, 5000);

    return () => {
      if (earningsInterval) clearInterval(earningsInterval);
    };
  };

  // Показываем уведомление
  const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Функция для расчета оставшегося времени аренды
  const getRemainingTime = (rentDate: number) => {
    const now = Date.now();
    const endDate = rentDate + (30 * 24 * 60 * 60 * 1000);
    const remainingMs = endDate - now;
    
    if (remainingMs <= 0) {
      return 'Аренда закончилась';
    }

    const days = Math.floor(remainingMs / (24 * 60 * 60 * 1000));
    const hours = Math.floor((remainingMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    return `${days}д ${hours}ч`;
  };

  return (
    <MiningContainer>
      <Notification 
        show={showNotification}
        message={notificationMessage}
        type={notificationType}
      />
      
      <BonusCard>
        <h2>Ваш баланс:</h2>
        <EarningsAmount>
          USDT {state.balance.toFixed(8)}
        </EarningsAmount>
      </BonusCard>
      
      <ServerSection>
        <SectionTitle>Серверы</SectionTitle>
        
        <ServerStatsCard>
          <StatRow>
            <span>Всего серверов:</span>
            <span>{state.rentedServers.length}</span>
          </StatRow>
          <StatRow>
            <span>Общий доход:</span>
            <span>{state.transactions
              .filter(t => t.type === 'INCOME')
              .reduce((sum, t) => sum + t.amount, 0).toFixed(8)} USDT</span>
          </StatRow>
          <StatRow>
            <span>Доход в час:</span>
            <span>{state.rentedServers.reduce((sum, server) => sum + server.hourlyIncome, 0).toFixed(8)} USDT</span>
          </StatRow>
        </ServerStatsCard>
        
        <SectionTitle>
          Арендованные серверы
          <RentButton onClick={() => navigate('/store')}>
            Арендовать сервер
          </RentButton>
        </SectionTitle>
        
        {state.rentedServers.length > 0 ? (
          <ServersList>
            {state.rentedServers.map(server => {
              const isActive = Date.now() < (server.rentDate + (30 * 24 * 60 * 60 * 1000));
              return (
                <ServerCard key={server.id}>
                  <ServerHeader>
                    <ServerName>{server.name}</ServerName>
                  </ServerHeader>
                  <ServerContent>
                    <ServerStat>
                      <span>Стоимость:</span>
                      <span>{server.price} USDT</span>
                    </ServerStat>
                    <ServerStat>
                      <span>Доход в час:</span>
                      <span>{server.hourlyIncome.toFixed(8)} USDT</span>
                    </ServerStat>
                    <ServerStat>
                      <span>Дата аренды:</span>
                      <span>{formatDate(server.rentDate)}</span>
                    </ServerStat>
                    <ServerStat>
                      <span>Осталось:</span>
                      <span>{getRemainingTime(server.rentDate)}</span>
                    </ServerStat>
                    <ServerStatus isActive={isActive}>
                      {isActive ? 'Сервер активен' : 'Сервер не активен'}
                    </ServerStatus>
                  </ServerContent>
                </ServerCard>
              );
            })}
          </ServersList>
        ) : (
          <EmptyMessage>У вас пока нет арендованных серверов</EmptyMessage>
        )}
      </ServerSection>
    </MiningContainer>
  );
};

export default Mining; 