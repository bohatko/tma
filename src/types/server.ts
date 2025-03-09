export interface ServerType {
  id: string;
  name: string;
  description: string;
  price: number;
  starsPrice: number;
  hourlyIncome: number;
  imageUrl: string;
}

export interface RentedServer extends ServerType {
  rentDate: number; // timestamp аренды
  lastIncomeDate: number; // timestamp последнего начисления дохода
}

// Используем 10 типов серверов с данными от пользователя
export const SERVER_TYPES: ServerType[] = [
  {
    id: 't2.micro',
    name: 't2.micro',
    description: 'Базовый сервер для небольших проектов и тестирования',
    price: 3,
    starsPrice: 125,
    hourlyIncome: 0.004166667,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 't3.small',
    name: 't3.small',
    description: 'Стандартный сервер для средних нагрузок',
    price: 5,
    starsPrice: 208,
    hourlyIncome: 0.006944444,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 't3.medium',
    name: 't3.medium',
    description: 'Улучшенный сервер с высокой производительностью',
    price: 7,
    starsPrice: 292,
    hourlyIncome: 0.009722222,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'm5.large',
    name: 'm5.large',
    description: 'Мощный сервер для интенсивных вычислений',
    price: 9,
    starsPrice: 375,
    hourlyIncome: 0.0125,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'm5.xlarge',
    name: 'm5.xlarge',
    description: 'Расширенная версия сервера для высоких нагрузок',
    price: 11,
    starsPrice: 458,
    hourlyIncome: 0.015277778,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'c5.large',
    name: 'c5.large',
    description: 'Вычислительно-оптимизированный сервер для сложных задач',
    price: 13,
    starsPrice: 542,
    hourlyIncome: 0.018055556,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'c5.xlarge',
    name: 'c5.xlarge',
    description: 'Производительный сервер для интенсивных вычислений',
    price: 15,
    starsPrice: 625,
    hourlyIncome: 0.020833333,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'r5.large',
    name: 'r5.large',
    description: 'Сервер с оптимизацией по памяти для баз данных',
    price: 17,
    starsPrice: 708,
    hourlyIncome: 0.023611111,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'r5.xlarge',
    name: 'r5.xlarge',
    description: 'Расширенный сервер с высокой пропускной способностью',
    price: 19,
    starsPrice: 792,
    hourlyIncome: 0.026388889,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  },
  {
    id: 'g4dn.xlarge',
    name: 'g4dn.xlarge',
    description: 'Премиум сервер с GPU для максимальной производительности',
    price: 21,
    starsPrice: 875,
    hourlyIncome: 0.029166667,
    imageUrl: 'https://www.it-world.ru/upload/iblock/664/xln29hgj7yuogkeo5jpjkxwo5mxyvnnn.jpg'
  }
]; 