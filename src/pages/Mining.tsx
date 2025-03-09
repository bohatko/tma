import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Notification from '../components/Notification';

const MiningContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-height: calc(100vh - 140px);
  background-color: #f5f5f5;
`;

const BonusCard = styled.div`
  background: #0098E9;
  padding: 15px 25px;
  border-radius: 12px;
  width: 110%;
  max-width: 600px;
  text-align: center;
  color: white;

  h2 {
    color: white;
    margin: 0;
  }
`;

const EarningsAmount = styled.div`
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 15px 0;
  color: white;
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
  width: 120px;
  height: 120px;
  background: ${props => props.isMining ? '#046611' : '#FF6B6B'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 32px 0 0 0;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NetworkQualityCard = styled.div`
  background: #0098E9;
  padding: 15px 25px;
  border-radius: 12px;
  width: 110%;
  max-width: 600px;
  color: white;
  margin-top: 32px;
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
  font-size: 20px;
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

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #EEEEEE;

  &:last-child {
    border-bottom: none;
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

const TransactionTitle = styled.div`
  font-weight: 500;
  color: #333;
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #999;
`;

const TransactionAmount = styled.div`
  font-weight: 500;
  color: #046611;
`;

const Mining: React.FC = () => {
  const [isMining, setIsMining] = useState<boolean>(false);
  const [networkQuality, setNetworkQuality] = useState<number>(75);
  const [earnings, setEarnings] = useState<number>(() => {
    const savedEarnings = localStorage.getItem('miningEarnings');
    return savedEarnings ? parseFloat(savedEarnings) : 0;
  });
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [transactions, setTransactions] = useState<Array<{
    id: number;
    title: string;
    date: string;
    amount: string;
  }>>([]);

  useEffect(() => {
    let qualityInterval: NodeJS.Timeout;
    let earningsInterval: NodeJS.Timeout;

    if (isMining) {
      qualityInterval = setInterval(() => {
        setNetworkQuality(Math.floor(Math.random() * (99 - 75 + 1)) + 75);
      }, 1000);

      earningsInterval = setInterval(() => {
        const reward = networkQuality / 100;
        setEarnings(prev => {
          const newEarnings = prev + reward;
          localStorage.setItem('miningEarnings', newEarnings.toString());
          return newEarnings;
        });

        // Добавляем новую транзакцию
        const now = new Date();
        const formattedDate = now.toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });

        setTransactions(prev => [{
          id: Date.now(),
          title: 'Mining Reward',
          date: formattedDate,
          amount: `+${reward.toFixed(2)} USDT`
        }, ...prev.slice(0, 9)]); // Храним только последние 10 транзакций
      }, 1000);
    }

    return () => {
      if (qualityInterval) clearInterval(qualityInterval);
      if (earningsInterval) clearInterval(earningsInterval);
    };
  }, [isMining, networkQuality]);

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleMiningClick = () => {
    setIsMining(prev => {
      const newState = !prev;
      if (newState) {
        showNotificationMessage('Майнинг успешно начат');
      } else {
        showNotificationMessage('Майнинг приостановлен');
      }
      return newState;
    });
  };

  return (
    <MiningContainer>
      <Notification show={showNotification} message={notificationMessage} />
      
      <BonusCard>
        <h2>Rewards:</h2>
        <EarningsAmount>
          <>USDT </>
          {earnings.toFixed(2)}
        </EarningsAmount>
      </BonusCard>

      <StatusCircle isMining={isMining} onClick={handleMiningClick}>
        <svg width=" 40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
          <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
      </StatusCircle>

      <div style={{ textAlign: 'center', marginBottom: '-20px' }}>
        <h2>{isMining ? 'Server is Connected' : 'Server is Disconnected'}</h2>
      </div>

      <NetworkQualityCard style={{ marginTop: '2px' }}>
        <QualityHeader>
          Network Quality: {networkQuality}%
        </QualityHeader>
        <QualityText>
          {isMining 
            ? "You're doing great! Keep connected to this network to earn."
            : "Connect to start earning with this network."}
        </QualityText>
      </NetworkQualityCard>

      <TransactionCard>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <TransactionLeft>
                <TransactionIcon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M2 12h20"/>
                  </svg>
                </TransactionIcon>
                <TransactionInfo>
                  <TransactionTitle>{transaction.title}</TransactionTitle>
                  <TransactionDate>{transaction.date}</TransactionDate>
                </TransactionInfo>
              </TransactionLeft>
              <TransactionAmount>{transaction.amount}</TransactionAmount>
            </TransactionItem>
          ))
        ) : (
          <TransactionItem>
            <TransactionInfo>
              <TransactionTitle style={{ textAlign: 'center', width: '100%' }}>
                Нет транзакций
              </TransactionTitle>
            </TransactionInfo>
          </TransactionItem>
        )}
      </TransactionCard>
    </MiningContainer>
  );
};

export default Mining; 