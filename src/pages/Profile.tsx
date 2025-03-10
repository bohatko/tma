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

const TransactionItem = styled.div<{ type: 'RENT' | 'INCOME' }>`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  border-left: 4px solid ${props => getTransactionColor(props.type)};
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

const TransactionAmount = styled.div<{ type: 'RENT' | 'INCOME' }>`
  font-weight: 600;
  color: ${props => getTransactionColor(props.type)};
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

type TransactionTabType = 'all' | 'income' | 'expense';

const Profile: React.FC = () => {
  const { state } = useAppContext();
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
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} type={transaction.type}>
                <TransactionInfo>
                  <TransactionTitle>
                    {transaction.type === 'RENT' 
                      ? `Аренда сервера ${transaction.serverName ? transaction.serverName : ''}` 
                      : transaction.amount === 10 && !transaction.serverId 
                        ? 'Начисление бонуса' 
                        : `Доход от сервера ${transaction.serverName ? transaction.serverName : ''}`} 
                  </TransactionTitle>
                  <TransactionDate>
                    {new Date(transaction.timestamp).toLocaleString('ru-RU')}
                  </TransactionDate>
                  {transaction.serverId && (
                    <ServerInfo>
                      ID: {transaction.serverId}
                    </ServerInfo>
                  )}
                </TransactionInfo>
                
                <TransactionAmount type={transaction.type}>
                  {transaction.type === 'RENT' ? '-' : '+'}{transaction.amount.toFixed(8)} USDT
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