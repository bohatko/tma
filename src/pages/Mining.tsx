import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Notification from '../components/Notification';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/formatDate';

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

const NetworkQualityCard = styled.div`
  background-color: #0098E9;
  padding: 15px 25px;
  border-radius: 12px;
  margin: 20px 0;
  width: 110%;
  max-width: 600px;
  color: white;
`;

const QualityHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
`;

const QualityText = styled.div`
  color: white;
  text-align: center;
  margin-top: 10px;
  font-size: 18px;
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
  margin-bottom: 20px;
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

const Mining: React.FC = () => {
  const [isMining, setIsMining] = useState<boolean>(false);
  const [networkQuality, setNetworkQuality] = useState<number>(75);
  const { state, dispatch } = useAppContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [transactions, setTransactions] = useState<Array<{
    id: number;
    title: string;
    date: string;
    amount: string;
  }>>([]);
  
  useEffect(() => {
    // Инициализация состояния майнинга
    const storedMiningState = localStorage.getItem('isMining');
    if (storedMiningState === 'true') {
      setIsMining(true);
    }
    
    // Загрузка транзакций из локального хранилища
    const storedTransactions = localStorage.getItem('miningTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  useEffect(() => {
    let qualityInterval: NodeJS.Timeout | null = null;
    let earningsInterval: NodeJS.Timeout | null = null;

    if (isMining) {
      // Обновление качества сети с интервалом
      qualityInterval = setInterval(() => {
        const randomQuality = Math.floor(Math.random() * 30) + 70;
        setNetworkQuality(randomQuality);
      }, 3000);

      // Добавление дохода с интервалом
      earningsInterval = setInterval(() => {
        // Рассчитываем доход на основе арендованных серверов
        let incomeAmount = 0;
        
        // Проверяем наличие арендованных серверов
        if (state.rentedServers.length > 0) {
          // Суммируем почасовой доход всех серверов
          const hourlyIncome = state.rentedServers.reduce(
            (sum, server) => sum + server.hourlyIncome, 
            0
          );
          
          // Переводим часовой доход в доход за 5 секунд
          // (hourlyIncome / 3600) * 5 = hourlyIncome * 5 / 3600
          incomeAmount = hourlyIncome * 5 / 3600;
          
          // Применяем множитель качества сети (от 0.7 до 1.0)
          const qualityMultiplier = networkQuality / 100;
          incomeAmount = incomeAmount * qualityMultiplier;
          
          // Добавляем доход на баланс только если он больше нуля
          if (incomeAmount > 0) {
            dispatch({
              type: 'SET_BALANCE',
              payload: state.balance + incomeAmount
            });
            
            // Добавляем транзакцию о начислении
            const date = new Date();
            const formattedDate = date.toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const incomeTransaction = {
              id: Date.now(),
              title: 'Доход от майнинга',
              date: formattedDate,
              amount: `+${incomeAmount.toFixed(8)} USDT`
            };
            
            setTransactions(prev => {
              const newTransactions = [incomeTransaction, ...prev];
              localStorage.setItem('miningTransactions', JSON.stringify(newTransactions));
              return newTransactions;
            });
            
            // Добавляем в историю транзакций приложения
            dispatch({
              type: 'ADD_TRANSACTION',
              payload: {
                id: Date.now().toString(),
                type: 'INCOME',
                amount: incomeAmount,
                description: 'Доход от майнинга',
                timestamp: new Date(),
              }
            });
          }
        }
        // Если нет серверов, никаких начислений не производим
      }, 5000); // Доход начисляется каждые 5 секунд
    }

    return () => {
      if (qualityInterval) clearInterval(qualityInterval);
      if (earningsInterval) clearInterval(earningsInterval);
    };
  }, [isMining, dispatch, state.balance, state.rentedServers, networkQuality]);

  // Сохраняем состояние майнинга в localStorage
  useEffect(() => {
    localStorage.setItem('isMining', isMining.toString());
  }, [isMining]);

  // Показываем уведомление
  const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Обработка нажатия на кнопку майнинга
  const handleMiningClick = () => {
    // Проверяем наличие арендованных серверов
    if (!isMining && state.rentedServers.length === 0) {
      showNotificationMessage('Для начала майнинга необходимо арендовать сервер', 'error');
      return;
    }
    
    const newMiningState = !isMining;
    setIsMining(newMiningState);
    
    if (newMiningState) {
      showNotificationMessage('Майнинг запущен', 'success');
    } else {
      showNotificationMessage('Майнинг остановлен', 'error');
    }
  };

  // Вычисляем суммарный доход в час от всех серверов
  const totalHourlyIncome = state.rentedServers.reduce(
    (sum, server) => sum + server.hourlyIncome, 
    0
  );
  
  // Вычисляем общий доход (сумма всех транзакций дохода)
  const totalIncome = state.transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

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
      
      <NetworkQualityCard>
        <QualityHeader>
          Качество: {networkQuality}%
        </QualityHeader>
        <QualityText>
          {state.rentedServers.length > 0 
            ? `Качество сети влияет на доходность. При текущем качестве сети ваш доход умножается на ${(networkQuality / 100).toFixed(2)}.` 
            : 'Для начала майнинга необходимо арендовать хотя бы один сервер на странице "Аренда".'}
        </QualityText>
      </NetworkQualityCard>
      
      <MiningStatusText>
        {isMining ? 'Майнинг активен' : 'Майнинг не активен'}
      </MiningStatusText>
      
      <StatusCircle isMining={isMining} onClick={handleMiningClick}>
        <MiningIcon isMining={isMining}>
          {isMining ? 'Stop' : 'Start'}
        </MiningIcon>
      </StatusCircle>
      
      <ServerSection>
        <SectionTitle>Серверы</SectionTitle>
        
        <ServerStatsCard>
          <StatRow>
            <span>Всего серверов:</span>
            <span>{state.rentedServers.length}</span>
          </StatRow>
          <StatRow>
            <span>Общий доход:</span>
            <span>{totalIncome.toFixed(8)} USDT</span>
          </StatRow>
          <StatRow>
            <span>Доход в час:</span>
            <span>{totalHourlyIncome.toFixed(8)} USDT</span>
          </StatRow>
        </ServerStatsCard>
        
        <SectionTitle>Арендованные серверы</SectionTitle>
        
        {state.rentedServers.length > 0 ? (
          <ServersList>
            {state.rentedServers.map(server => (
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
                </ServerContent>
              </ServerCard>
            ))}
          </ServersList>
        ) : (
          <EmptyMessage>У вас пока нет арендованных серверов</EmptyMessage>
        )}
      </ServerSection>
    </MiningContainer>
  );
};

export default Mining; 