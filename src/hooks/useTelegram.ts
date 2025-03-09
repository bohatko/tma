import { useEffect, useState } from 'react';
import { TelegramUser } from '../types/telegram';

interface UseTelegramReturn {
  user: TelegramUser | null;
  ready: boolean;
  error: string | null;
  webApp: any;
}

export const useTelegram = (): UseTelegramReturn => {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    const initTelegram = () => {
      try {
        // Проверяем, запущено ли приложение в Telegram
        if (window.Telegram?.WebApp) {
          // Сохраняем объект WebApp для использования в других частях приложения
          setWebApp(window.Telegram.WebApp);
          
          // Получаем данные пользователя
          const telegramUser = window.Telegram.WebApp.initDataUnsafe.user;
          
          if (telegramUser) {
            console.log('Получены данные пользователя:', telegramUser);
            setUser(telegramUser);
            
            // Сообщаем Telegram, что приложение готово
            window.Telegram.WebApp.ready();
            setReady(true);
          } else {
            console.warn('Не удалось получить данные пользователя Telegram');
            setError('Не удалось получить данные пользователя Telegram');
            
            // Для локальной разработки или тестирования
            if (process.env.NODE_ENV !== 'production') {
              console.log('Используем тестовые данные для разработки');
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
          console.warn('Приложение запущено не в Telegram');
          setError('Приложение запущено не в Telegram');
          
          // Для локальной разработки или тестирования
          if (process.env.NODE_ENV !== 'production') {
            console.log('Используем тестовые данные для разработки');
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
        console.error('Ошибка инициализации Telegram:', err);
        setError(`Ошибка инициализации Telegram: ${err}`);
        
        // Для локальной разработки или тестирования
        if (process.env.NODE_ENV !== 'production') {
          console.log('Используем тестовые данные для разработки');
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

    // Задержка для инициализации Telegram WebApp
    setTimeout(initTelegram, 500);
  }, []);

  return { user, ready, error, webApp };
}; 