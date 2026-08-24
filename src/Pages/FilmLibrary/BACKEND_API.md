# Документация: бэкенд для страницы «Медиатека» (FilmLibrary)

> Назначение: описание REST API, который нужно реализовать на Node.js (Express) + MongoDB,
> чтобы перенести хранение медиатеки с localStorage на сервер. Фронтенд уже готов и работает
> через слой `src/Pages/FilmLibrary/libraryService.js` (сейчас — localStorage, методы async/Promise).
> При реализации бэкенда достаточно заменить тела методов `libraryService` на axios-запросы к API —
> сама страница не меняется.

## Контекст проекта

- Бэкенд уже работает с этим фронтендом. Стиль кода см. в `routes/api/recipes.js`, `controllers/recipes/*`, `models/recipe.js`.
- Маршруты монтируются в `app.js`: `app.use("/api/<resource>", router)`.
- Используются middleware: `auth` (кладёт пользователя в `req.user`, `req.user._id`), `validation(joiSchema)`, `ctrlWrapper`.
- Базовый URL фронта: `config.BASE_URL` = `/api` (см. `src/config.js`, `BASE_URL`).
- Авторизация в приложении уже есть (`store/auth`), `userId` на фронте = `authSelectors.getUserID` = `req.user._id` на бэкенде.

## Модель данных (Mongoose)

### Collection (коллекция / подборка)

```js
// models/filmLibrary.js
const movieSubdoc = new Schema(
  {
    tmdbId: { type: Number, required: true }, // id фильма из TMDB (используется как movie.id на фронте)
    title: String,
    poster_path: String,
    release_date: String,
    vote_average: Number,
    genre_ids: [Number],
    overview: String,
    media_type: { type: String, enum: ['movie', 'tv'], default: 'movie' },
    watchedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }], // кто отметил «просмотрено»
  },
  { _id: false },
);

const filmLibrarySchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false }, // false = личная, true = общая
    movies: [movieSubdoc],
  },
  { versionKey: false, timestamps: true },
);
```

Ключевые требования из ТЗ:
- **Владелец** — поле `owner`.
- **Два состояния** — `isPublic` (личная / общая).
- **«Просмотрено» персонально** — массив `watchedBy` (id пользователей). Отметка видна только тому,
  кто её поставил. На бэкенде при чтении можно возвращать флаг `watched` = `watchedBy.includes(req.user._id)`,
  либо фронт считает сам по `watchedBy`.

## Эндпоинты

Все маршруты требуют `auth`. Базовый путь: `/api/filmLibrary`.

| Метод | Путь | Тело / параметры | Описание | Соответствие `libraryService` |
|------|------|------------------|----------|------------------------------|
| GET | `/api/filmLibrary` | — | Вернуть коллекции пользователя (его own) + все общие (`isPublic: true`). | `getCollections(userId)` |
| GET | `/api/filmLibrary/:id` | — | Одна коллекция (для страницы коллекции). | (опционально, можно искать в GET `/`) |
| POST | `/api/filmLibrary` | `{ name, isPublic }` | Создать коллекцию. `owner = req.user._id`. | `createCollection` |
| PATCH | `/api/filmLibrary/:id` | `{ name }` | Переименовать. Только `owner`. | `renameCollection` |
| DELETE | `/api/filmLibrary/:id` | — | Удалить. Только `owner`. | `deleteCollection` |
| POST | `/api/filmLibrary/:id/movies` | `{ movie }` | Добавить фильм. Только `owner`. `movie` = данные TMDB (тот же объект, что приходит с фронта). Дедупликация по `tmdbId`. | `addMovie` |
| DELETE | `/api/filmLibrary/:id/movies/:movieId` | — | Удалить фильм. Только `owner`. | `removeMovie` |
| PATCH | `/api/filmLibrary/:id/movies/order` | `{ orderedIds: [...] }` | Переупорядочить фильмы (массив `tmdbId` в новом порядке). Только `owner`. | `reorderMovies` |
| PATCH | `/api/filmLibrary/:id/movies/:movieId/watched` | `{ watched: Boolean }` | Поставить/снять «просмотрено» для **текущего** пользователя (добавить/удалить `req.user._id` из `watchedBy`). Доступно **любому** зрителю общей коллекции. | `setWatched` |

### Права доступа (серверная логика)

- Чтение: свои коллекции + `isPublic: true` (независимо от владельца).
- Мутации структуры (создание, переименование, удаление, добавление/удаление/переупорядочивание фильмов):
  только если `collection.owner.equals(req.user._id)`.
- Мутация `watched`: разрешена любому авторизованному пользователю (меняет только свою запись в `watchedBy`).
  Это реализует требование «отметку можно поставить и на общей коллекции, но видна только тому, кто её поставил».

## Форма ответа

Объект коллекции, совместимый с фронтом (маппинг `_id` → `id` и `owner` → `ownerId` удобно делать на бэкенде
или в `libraryService`):

```json
{
  "id": "665f1...",
  "name": "Любимое",
  "ownerId": "665a...",
  "isPublic": false,
  "createdAt": "2026-08-24T...",
  "movies": [
    {
      "id": 550,
      "title": "Fight Club",
      "poster_path": "/abc.jpg",
      "release_date": "1999-10-15",
      "vote_average": 8.4,
      "genre_ids": [18, 53],
      "overview": "...",
      "media_type": "movie",
      "watchedBy": ["665a...", "667b..."]
    }
  ]
}
```

> Примечание: на фронте `movie.id` = `tmdbId` (число из TMDB). В `:movieId` в URL передаётся это число.

## Пример реализации (скелет, в стиле проекта)

```js
// routes/api/filmLibrary.js
const express = require("express");
const router = express.Router();
const { filmLibrary: ctrl } = require("../../controllers");
const { auth, validation, ctrlWrapper } = require("../../middlewares");
const { filmLibraryJoiSchema } = require("../../models/filmLibrary");

router.get("/", auth, ctrlWrapper(ctrl.getCollections));
router.post("/", auth, validation(filmLibraryJoiSchema), ctrlWrapper(ctrl.createCollection));
router.get("/:id", auth, ctrlWrapper(ctrl.getCollectionById));
router.patch("/:id", auth, ctrlWrapper(ctrl.renameCollection));
router.delete("/:id", auth, ctrlWrapper(ctrl.deleteCollection));
router.post("/:id/movies", auth, ctrlWrapper(ctrl.addMovie));
router.delete("/:id/movies/:movieId", auth, ctrlWrapper(ctrl.removeMovie));
router.patch("/:id/movies/order", auth, ctrlWrapper(ctrl.reorderMovies));
router.patch("/:id/movies/:movieId/watched", auth, ctrlWrapper(ctrl.setWatched));

module.exports = router;
```

```js
// app.js — добавить монтирование
const filmLibraryRouter = require("./routes/api/filmLibrary");
app.use("/api/filmLibrary", filmLibraryRouter);
```

Контроллеры (`controllers/filmLibrary/*.js`) используют `ctrlWrapper` и работают с моделью
`FilmLibrary` (схема выше). Каждый мутирующий контроллер должен проверять `owner`
(кроме `setWatched`, где проверяется только наличие коллекции и право смотреть — т.е. своя или публичная).

## Интеграция на фронте (когда бэкенд готов)

В `src/Pages/FilmLibrary/libraryService.js` заменить тела методов на axios-запросы к `BASE_URL`
(импорт из `../../config`), например:

```js
import axios from 'axios';
import { BASE_URL } from '../../config';

const api = axios.create({ baseURL: BASE_URL }); // отдельный инстанс — НЕ наследует глобальный Authorization из store/auth

export const libraryService = {
  getCollections: async userId => (await api.get('/filmLibrary')).data,
  createCollection: async (userId, name, isPublic) =>
    (await api.post('/filmLibrary', { name, isPublic })).data,
  // ...остальные методы аналогично таблице выше
};
```

Важно: использовать **отдельный инстанс axios** (как уже сделано для TMDB в `tmdbService.js`),
чтобы не наследовать глобальный `axios.defaults` (baseURL/Authorization), выставляемый в `store/auth/operations.js`.
