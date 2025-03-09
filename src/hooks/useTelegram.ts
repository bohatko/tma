import { useEffect, useState } from 'react';
import { TelegramUser } from '../types/telegram';

interface UseTelegramReturn {
  user: TelegramUser | null;
  ready: boolean;
  error: string | null;
}

export const useTelegram = (): UseTelegramReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTelegram = () => {
      try {
        // Проверяем, запущено ли приложение в Telegram
        if (window.Telegram) {
          // Получаем данные пользователя
          const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
          
          if (telegramUser) {
            setUser(telegramUser);
            
            // Сообщаем Telegram, что приложение готово
            window.Telegram.WebApp.ready();
            setReady(true);
          } else {
            setError('Не удалось получить данные пользователя Telegram');
            
            // Для локальной разработки, используем моковые данные
            if (process.env.NODE_ENV === 'development') {
              setUser({
                id: 123456789,
                first_name: 'Тестовый',
                last_name: 'Пользователь',
                username: 'test_user',
                photo_url: 'https://via.placeholder.com/32'
              });
              setReady(true);
              setError(null);
            }
          }
        } else {
          setError('Приложение запущено не в Telegram');
          
          // Для локальной разработки, используем моковые данные
          if (process.env.NODE_ENV === 'development') {
            setUser({
              id: 123456789,
              first_name: 'Тестовый',
              last_name: 'Пользователь',
              username: 'test_user',
              photo_url: 'https://via.placeholder.com/32'
            });
            setReady(true);
            setError(null);
          }
        }
      } catch (err) {
        setError(`Ошибка инициализации Telegram: ${err}`);
        
        // Для локальной разработки, используем моковые данные
        if (process.env.NODE_ENV === 'development') {
          setUser({
            id: 123456789,
            first_name: 'Тестовый',
            last_name: 'Пользователь',
            username: 'test_user',
            photo_url: 'https://via.placeholder.com/32'
          });
          setReady(true);
          setError(null);
        }
      }
    };

    initTelegram();
  }, []);

  return { user, ready, error };
}; 