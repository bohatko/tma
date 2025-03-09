import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Notification from '../components/Notification';

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

const WithdrawButton = styled.button`
  background-color: var(--tg-theme-button-color, #0098E9);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
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
  
  // Новые состояния для модального окна вывода средств
  const [showWithdrawAlert, setShowWithdrawAlert] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const withdrawInputRef = useRef<HTMLInputElement>(null);
  
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
          title: 'Вознаграждение за майнинг',
          date: formattedDate,
          amount: `+${reward.toFixed(2)} USDT`
        }, ...prev.slice(0, 9)]); // Храним только последние 10 транзакций
      }, 5000); // Изменено с 1000 на 5000 (5 секунд)
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
      if (!prev) {
        showNotificationMessage('Майнинг запущен');
      } else {
        showNotificationMessage('Майнинг остановлен');
      }
      return !prev;
    });
  };
  
  // Обработчик нажатия на кнопку "Вывести"
  const handleWithdrawClick = () => {
    setWithdrawAmount('');
    setShowWithdrawAlert(true);
    // Фокусируемся на поле ввода после открытия модального окна
    setTimeout(() => {
      if (withdrawInputRef.current) {
        withdrawInputRef.current.focus();
      }
    }, 100);
  };
  
  // Обработчик нажатия на кнопку "Отмена"
  const handleWithdrawCancel = () => {
    setShowWithdrawAlert(false);
  };
  
  // Обработчик нажатия на кнопку "Подтвердить вывод"
  const handleWithdrawConfirm = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotificationMessage('Пожалуйста, введите корректную сумму');
      return;
    }
    
    if (amount > earnings) {
      showNotificationMessage('Недостаточно средств');
      return;
    }
    
    // Уменьшаем баланс
    setEarnings(prev => {
      const newEarnings = prev - amount;
      localStorage.setItem('miningEarnings', newEarnings.toString());
      return newEarnings;
    });
    
    // Закрываем модальное окно
    setShowWithdrawAlert(false);
    
    // Показываем уведомление об успешном выводе
    showNotificationMessage('Заявка успешно обработана');
    
    // Добавляем транзакцию вывода
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
      title: 'Вывод средств',
      date: formattedDate,
      amount: `-${amount.toFixed(2)} USDT`
    }, ...prev.slice(0, 9)]); // Храним только последние 10 транзакций
  };

  return (
    <MiningContainer>
      <Notification show={showNotification} message={notificationMessage} />
      
      <BonusCard>
        <h2>Ваш доход:</h2>
        <EarningsAmount>
          <>USDT </>
          {earnings.toFixed(2)}
        </EarningsAmount>
        <WithdrawButton onClick={handleWithdrawClick}>
          Вывести
        </WithdrawButton>
      </BonusCard>

      <StatusCircle isMining={isMining} onClick={handleMiningClick}>
        <svg width=" 40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
          <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
      </StatusCircle>

      <div style={{ textAlign: 'center', marginBottom: '-20px' }}>
        <h2>{isMining ? 'Сервер подключен' : 'Сервер отключён'}</h2>
      </div>

      <NetworkQualityCard style={{ marginTop: '2px' }}>
        <QualityHeader>
          Качество сети: {networkQuality}%
        </QualityHeader>
        <QualityText>
          {isMining 
            ? "Отлично! Оставайтесь подключенными к сети для получения дохода."
            : "Подключитесь, чтобы начать зарабатывать в этой сети."}
        </QualityText>
      </NetworkQualityCard>

      <TransactionCard>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <TransactionLeft>
                <TransactionIcon>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {transaction.amount.startsWith('+') ? (
                      <path d="M12 2v20M2 12h20"/>  // Плюс для поступлений
                    ) : (
                      <path d="M2 12h20"/>  // Минус для выводов
                    )}
                  </svg>
                </TransactionIcon>
                <TransactionInfo>
                  <TransactionTitle>{transaction.title}</TransactionTitle>
                  <TransactionDate>{transaction.date}</TransactionDate>
                </TransactionInfo>
              </TransactionLeft>
              <TransactionAmount style={{ color: transaction.amount.startsWith('+') ? '#046611' : '#d32f2f' }}>
                {transaction.amount}
              </TransactionAmount>
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
      
      {/* Модальное окно для вывода средств */}
      <AlertOverlay show={showWithdrawAlert}>
        <AlertCard>
          <AlertTitle>Вывод средств</AlertTitle>
          <AlertInput 
            ref={withdrawInputRef}
            type="number" 
            placeholder="Введите сумму" 
            value={withdrawAmount} 
            onChange={(e) => setWithdrawAmount(e.target.value)}
            min="0.01"
            max={earnings.toString()}
            step="0.01"
          />
          <AlertButtonGroup>
            <AlertButton onClick={handleWithdrawCancel}>Отмена</AlertButton>
            <AlertButton primary onClick={handleWithdrawConfirm}>Подтвердить вывод</AlertButton>
          </AlertButtonGroup>
        </AlertCard>
      </AlertOverlay>
    </MiningContainer>
  );
};

export default Mining; 