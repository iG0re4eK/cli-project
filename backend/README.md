====.env====
DB_USER=postgres
DB_HOST=localhost
DB_NAME=github-trends-db
DB_PASSWORD=1234
DB_PORT=5432

SYNC_INTERVAL_MINUTES=1

API_URL=http://localhost:3000/api

GITHUB_TOKEN= ваш гитхаб токен
====.env====

====npm команды====
npm run dev - запуск сервера с перезагрузкой при изменениях
npm start - запуск сервера без перезагрузки при изменениях
npm run cli list - выводит список 10 репозиториев с самым большим кол-ом звезд
npm run cli get-name <имя репозитория> - возвращается информацию о репозитории по его имени
npm run cli get-id <id репозитория> - возвращается информацию о репозитории по его id
npm run cli sync - принудительная синхронизация с GitHub
npm run cli status - выводит время до следующей автоматической синхронизации
====npm команды====

====БД====
CREATE TABLE repositories (
id BIGINT NOT NULL PRIMARY KEY,
name VARCHAR(255) NOT NULL,
stars INT NOT NULL,
url VARCHAR(255) NOT NULL,
description TEXT NOT NULL,
updated_at TIMESTAMP NOT NULL DEFAULT now()
);
====БД====
