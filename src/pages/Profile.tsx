import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context/AppContext';
import { getTransactionColor } from '../types/transaction';
import Notification from '../components/Notification';
import { formatDate } from '../utils/formatDate';

const ProfileContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: calc(100vh - 140px);
  background-color: var(--tg-theme-bg-color, #FFFFFF);
  width: 100%;
`;

const ProfileTitle = styled.h1`
  margin-bottom: 20px;
  color: var(--tg-theme-text-color, #333);
  text-align: center;
  width: 100%;
`;

const ProfileSection = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 2px solid #0098E9;
  padding-bottom: 8px;
`;

const UserInfoCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const UserInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  
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
  gap: 15px;
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
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ServerName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const ServerDate = styled.div`
  font-size: 12px;
  opacity: 0.9;
`;

const ServerContent = styled.div`
  padding: 15px;
`;

const ServerInfo = styled.div`
  color: #0098E9;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
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

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-left: 3px solid ${props => props.color || '#4CAF50'};
  background-color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%; // На всю ширину экрана
`;

const TransactionLeft = styled.div`
  display: flex;
  align-items: center;
`;

const TransactionIcon = styled.div`
  margin-right: 10px;
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TransactionTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
`;

const TransactionDate = styled.div`
  color: #999;
  font-size: 12px;
`;

const TransactionAmount = styled.div<{ positive: boolean }>`
  font-weight: 600;
  color: ${props => props.positive ? '#4CAF50' : '#f44336'};
  font-size: 16px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #999;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-style: italic;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 12px;
  background-color: ${props => props.active ? '#0098E9' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#0098E9' : '#f0f0f0'};
  }
`;

const Balance = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background-color: #0098E9;
  color: white;
  border-radius: 8px;
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const ResetButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin: 20px 0;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

type TransactionTabType = 'all' | 'income' | 'expense';

const Profile: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [activeTransactionTab, setActiveTransactionTab] = useState<TransactionTabType>('all');
  
  // Функция для отображения уведомлений
  const showNotificationMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  
  // Подсчитываем общий доход
  const totalIncome = state.transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Сортируем транзакции по дате (от новых к старым)
  const sortedTransactions = [...state.transactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Фильтруем транзакции по выбранному табу
  const filteredTransactions = sortedTransactions.filter(transaction => {
    if (activeTransactionTab === 'all') return true;
    if (activeTransactionTab === 'income') return transaction.type === 'INCOME';
    if (activeTransactionTab === 'expense') return transaction.type === 'RENT';
    return true;
  });
  
  // Функция сброса сессии
  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные? Это действие нельзя отменить.')) {
      dispatch({ type: 'RESET_STATE' });
      showNotificationMessage('Сессия успешно сброшена', 'success');
    }
  };
  
  return (
    <ProfileContainer>
      <Notification 
        show={showNotification} 
        message={notificationMessage} 
        type={notificationType} 
      />
      
      <ProfileTitle>Профиль</ProfileTitle>
      
      <Balance>
        Баланс: {state.balance.toFixed(8)} USDT
      </Balance>
      
      <ResetButton onClick={handleReset}>
        Сбросить сессию
      </ResetButton>
      
      <ProfileSection>
        <SectionTitle>История транзакций</SectionTitle>
        
        <TabContainer>
          <TabButton 
            active={activeTransactionTab === 'all'} 
            onClick={() => setActiveTransactionTab('all')}
          >
            Все
          </TabButton>
          <TabButton 
            active={activeTransactionTab === 'income'} 
            onClick={() => setActiveTransactionTab('income')}
          >
            Доходы
          </TabButton>
          <TabButton 
            active={activeTransactionTab === 'expense'} 
            onClick={() => setActiveTransactionTab('expense')}
          >
            Расходы
          </TabButton>
        </TabContainer>
        
        {filteredTransactions.length > 0 ? (
          <TransactionsList>
            {filteredTransactions.map(transaction => (
              <TransactionItem key={transaction.id} color={getTransactionColor(transaction.type)}>
                <TransactionLeft>
                  <TransactionIcon>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                  </TransactionIcon>
                  <TransactionInfo>
                    <div>{transaction.description}</div>
                    {transaction.serverName && <div>Сервер: {transaction.serverName}</div>}
                    <TransactionDate>{formatDate(transaction.timestamp.getTime())}</TransactionDate>
                  </TransactionInfo>
                </TransactionLeft>
                <TransactionAmount positive={transaction.type === 'INCOME'}>
                  {transaction.type === 'INCOME' ? '+' : '-'}{transaction.amount.toFixed(8)} USDT
                </TransactionAmount>
              </TransactionItem>
            ))}
          </TransactionsList>
        ) : (
          <EmptyMessage>
            {activeTransactionTab === 'all' && 'У вас пока нет транзакций'}
            {activeTransactionTab === 'income' && 'У вас пока нет доходных транзакций'}
            {activeTransactionTab === 'expense' && 'У вас пока нет расходных транзакций'}
          </EmptyMessage>
        )}
      </ProfileSection>
    </ProfileContainer>
  );
};

export default Profile; 