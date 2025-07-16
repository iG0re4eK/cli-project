#!/usr/bin/env node
const { Command } = require("commander");
const axios = require("axios");
require("dotenv").config();

const program = new Command();
const API_BASE_URL = process.env.API_URL || "http://localhost:3000/api";

function handleError(error) {
  console.error("Ошибка:", error.response?.data?.error || error.message);
}

program
  .command("sync")
  .description("Синхронизировать с GitHub")
  .action(async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/sync`);
      console.log("✅", response.data.message);
    } catch (error) {
      console.error("❌ Ошибка:", error.response?.data?.error || error.message);
    }
  });

program
  .command("get-name <name>")
  .description("Получить репозиторий по имени")
  .action(async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repositories/${name}`);
      console.log(response.data);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("get-id <id>")
  .description("Получить репозиторий по имени")
  .action(async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repositories/${id}`);
      console.log(response.data);
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("list")
  .description("Получить все репозитории")
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/repositories`);
      console.log("Трендовые репозитории:");
      response.data.forEach((repo) => {
        console.log(`\n${repo.name} (${repo.stars} звёзд)`);
        console.log(repo.description);
        console.log(repo.url);
      });
    } catch (error) {
      handleError(error);
    }
  });

program
  .command("status")
  .description("Показать время до следующей синхронизации")
  .action(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sync-status`);

      if (response.data.timeLeft === null) {
        console.log("⏳ Синхронизация не запущена");
        return;
      }

      const totalSeconds = Math.ceil(response.data.timeLeft / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      let timeString = "";
      if (hours > 0) timeString += `${hours} ч `;
      if (minutes > 0 || hours > 0) timeString += `${minutes} мин `;
      timeString += `${seconds} сек`;

      console.log(`До следующей синхронизации: ${timeString}`);
    } catch (error) {
      handleError(error);
    }
  });

program.parse(process.argv);
