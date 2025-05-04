# React-react

Приложение возможно установить через браузер хром десктопную и мобильное версию

## Главная страница

Страница содержит:

- курс валют монобанка (показывает изменение курса между вчера и сегодня, если приложение запускалось вчера и сегодня)
- События / факты / шутка
- Погода на текущий час
- часы (текущее время на устройстве)
- радио плейер (с базовым набором радиостнций)

## Погода

Страница содержит:

- Погода на текущий час
- Качество воздуха, на текущий час, с детальной информацией на день
- Погода на Месяц
- Дитальна информация о погоде на текущее время

## Курс валют

Страница содержит:

- Конвертер вылют (данные окурсе валют соответствуют курсу монобанка)
- Курс валют монобанка
- Курс валют в банках
- Курс НБУ
- ЗВР Украины

## Инфо

Страница содержит:

- Переключение темы / автовыбор темной и светлой темы (как в системе)
- Смена обоев и цвета фона

---

"scripts": { "start:local": "cross-env REACT_APP_API_URL=http://localhost:3000 react-scripts start", "start:staging":
"cross-env REACT_APP_API_URL=https://staging-api.example.com react-scripts start", "start:production": "cross-env
REACT_APP_API_URL=https://production-api.example.com react-scripts start", "start": "react-scripts start", "build":
"react-scripts build", "test": "react-scripts test", "eject": "react-scripts eject", "lint:js": "eslint
src/\*_/_.{js,jsx}" }

npm install cross-env npm run start:local

const apiUrl = process.env.REACT_APP_API_URL; console.log('Current API URL:', apiUrl);
