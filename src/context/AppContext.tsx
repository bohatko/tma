import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { RentedServer } from '../types/server';
import { Transaction } from '../types/transaction';

// Интерфейс состояния приложения
interface AppState {
  balance: number;
  rentedServers: RentedServer[];
  transactions: Transaction[];
  loading: boolean;
}

// Типы действий
type AppAction =
  | { type: 'SET_BALANCE'; payload: number }
  | { type: 'ADD_RENTED_SERVER'; payload: RentedServer }
  | { type: 'UPDATE_RENTED_SERVER'; payload: RentedServer }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_STATE' };

// Начальное состояние
const initialState: AppState = {
  balance: 10,
  rentedServers: [],
  transactions: [],
  loading: false
};

// Редуктор для управления состоянием
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_BALANCE':
      localStorage.setItem('balance', action.payload.toString());
      return { ...state, balance: action.payload };
      
    case 'ADD_RENTED_SERVER':
      const updatedRentedServers = [...state.rentedServers, action.payload];
      localStorage.setItem('rentedServers', JSON.stringify(updatedRentedServers));
      return { ...state, rentedServers: updatedRentedServers };
      
    case 'UPDATE_RENTED_SERVER':
      const updatedServers = state.rentedServers.map(server => 
        server.id === action.payload.id ? action.payload : server
      );
      localStorage.setItem('rentedServers', JSON.stringify(updatedServers));
      return { ...state, rentedServers: updatedServers };
      
    case 'ADD_TRANSACTION':
      const updatedTransactions = [...state.transactions, action.payload];
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      return { ...state, transactions: updatedTransactions };
      
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'LOAD_STATE':
      // Загрузка состояния из localStorage
      const balance = parseFloat(localStorage.getItem('balance') || '0');
      const rentedServers = JSON.parse(localStorage.getItem('rentedServers') || '[]');
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Преобразуем строки дат обратно в объекты Date
      const parsedRentedServers = rentedServers.map((server: any) => ({
        ...server,
        purchaseDate: new Date(server.purchaseDate),
        expiresAt: new Date(server.expiresAt),
        lastIncomeDate: new Date(server.lastIncomeDate)
      }));
      
      const parsedTransactions = transactions.map((transaction: any) => ({
        ...transaction,
        timestamp: new Date(transaction.timestamp)
      }));
      
      return {
        ...state,
        balance,
        rentedServers: parsedRentedServers,
        transactions: parsedTransactions
      };
      
    default:
      return state;
  }
};

// Создаем контекст
interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  rentServer: (serverId: string, serverName: string, price: number, hourlyIncome: number) => Promise<boolean>;
  processServerIncome: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Провайдер контекста
export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // При инициализации загружаем данные из localStorage
  useEffect(() => {
    // Проверяем, есть ли уже сохраненные данные в localStorage
    const savedBalance = localStorage.getItem('balance');
    const savedRentedServers = localStorage.getItem('rentedServers');
    const savedTransactions = localStorage.getItem('transactions');

    if (savedBalance || savedRentedServers || savedTransactions) {
      // Если есть сохраненные данные, загружаем их
      dispatch({ type: 'LOAD_STATE' });
    } else {
      // Если данных нет (новый пользователь), инициализируем с начальным балансом
      localStorage.setItem('balance', '10');
      localStorage.setItem('rentedServers', JSON.stringify([]));
      localStorage.setItem('transactions', JSON.stringify([]));
      
      // Добавляем транзакцию о пополнении начального баланса
      const initialTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'INCOME',
        amount: 10,
        description: 'Начальный бонус',
        timestamp: new Date()
      };
      
      localStorage.setItem('transactions', JSON.stringify([initialTransaction]));
      
      // Загружаем состояние после установки начальных значений
      dispatch({ type: 'LOAD_STATE' });
    }
    
    // Запускаем обработку дохода от серверов каждую минуту
    const intervalId = setInterval(() => {
      processServerIncome();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Функция для аренды сервера
  const rentServer = async (
    serverId: string, 
    serverName: string, 
    price: number, 
    hourlyIncome: number
  ): Promise<boolean> => {
    try {
      // Устанавливаем Loading 
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Проверка, хватает ли баланса
      if (state.balance < price) {
        return false;
      }
      
      // Уменьшаем баланс
      const newBalance = state.balance - price;
      dispatch({ type: 'SET_BALANCE', payload: newBalance });
      
      // Создаем новый арендованный сервер
      const now = Date.now(); // Текущий timestamp
      
      const rentedServer: RentedServer = {
        id: `${serverId}_${now}`,
        name: serverName,
        description: '', // Можно добавить описание
        price: price,
        starsPrice: 0, // Если нужно
        imageUrl: '', // Можно добавить URL изображения
        hourlyIncome,
        rentDate: now,
        lastIncomeDate: now
      };
      
      // Добавляем сервер в состояние
      dispatch({ type: 'ADD_RENTED_SERVER', payload: rentedServer });
      
      // Создаем транзакцию аренды
      const rentTransaction: Transaction = {
        id: `rent_${Date.now()}`,
        type: 'RENT',
        amount: price,
        description: `Аренда сервера ${serverName}`,
        timestamp: new Date(),
        serverId: rentedServer.id,
        serverName: serverName
      };
      
      // Добавляем транзакцию
      dispatch({ type: 'ADD_TRANSACTION', payload: rentTransaction });
      
      // Отключаем Loading
      dispatch({ type: 'SET_LOADING', payload: false });
      
      return true;
    } catch (error) {
      console.error('Ошибка при аренде сервера:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };
  
  // Функция для обработки дохода от серверов
  const processServerIncome = () => {
    if (state.rentedServers.length === 0) return;

    console.log('Обрабатываем доход от серверов');
    const now = Date.now();
    let newBalance = state.balance;
    const updatedServers: RentedServer[] = [];
    const newTransactions: Transaction[] = [];

    state.rentedServers.forEach(server => {
      // Проверяем, прошел ли час с последнего начисления
      const hoursSinceLastIncome = (now - server.lastIncomeDate) / (60 * 60 * 1000);
      
      if (hoursSinceLastIncome >= 1) {
        // Сколько полных часов прошло
        const fullHours = Math.floor(hoursSinceLastIncome);
        
        // Начисляем доход за каждый прошедший час
        const income = server.hourlyIncome * fullHours;
        newBalance += income;
        
        // Создаем транзакцию о доходе
        const incomeTransaction: Transaction = {
          id: Date.now().toString() + server.id,
          type: 'INCOME',
          amount: income,
          description: `Доход от сервера "${server.name}"`,
          timestamp: new Date(),
          serverId: server.id,
          serverName: server.name
        };
        
        newTransactions.push(incomeTransaction);
        
        // Обновляем информацию о сервере
        const updatedServer: RentedServer = {
          ...server,
          lastIncomeDate: now
        };
        
        updatedServers.push(updatedServer);
      }
    });
    
    // Если были начисления
    if (updatedServers.length > 0) {
      // Обновляем баланс
      dispatch({ type: 'SET_BALANCE', payload: newBalance });
      
      // Обновляем серверы
      updatedServers.forEach(server => {
        dispatch({ type: 'UPDATE_RENTED_SERVER', payload: server });
      });
      
      // Добавляем транзакции
      newTransactions.forEach(transaction => {
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
      });
    }
  };
  
  return (
    <AppContext.Provider value={{ state, dispatch, rentServer, processServerIncome }}>
      {children}
    </AppContext.Provider>
  );
};

// Хук для использования контекста
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext должен использоваться внутри AppContextProvider');
  }
  
  return context;
}; 