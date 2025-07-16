const express = require("express");
const router = express.Router();
const { pool, saveRepositories } = require("../db/db");
const { fetchTrendingRepos } = require("../services/github");
let syncTimer;
let nextSyncTime;
let countdownInterval;

const syncInterval = process.env.SYNC_INTERVAL_MINUTES
  ? parseInt(process.env.SYNC_INTERVAL_MINUTES) * 60 * 1000
  : 10 * 60 * 1000;

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  nextSyncTime = Date.now() + syncInterval;

  countdownInterval = setInterval(() => {
    const timeLeft = nextSyncTime - Date.now();
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      return;
    }

    /* const totalSeconds = Math.ceil(timeLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      console.log(
        `Следующая синхронизация через: ${hours} ч ${minutes} мин ${seconds} сек`
      );
    } else if (minutes > 0) {
      console.log(
        `Следующая синхронизация через: ${minutes} мин ${seconds} сек`
      );
    } else {
      console.log(`Следующая синхронизация через: ${seconds} сек`);
    } */
  }, 1000);
};

router.get("/repositories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM repositories ORDER BY stars DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/repositories/:identifier", async (req, res) => {
  const { identifier } = req.params;
  const isId = !isNaN(identifier);
  const query = isId
    ? "SELECT * FROM repositories WHERE id = $1"
    : "SELECT * FROM repositories WHERE name = $1";
  const result = await pool.query(query, [identifier]);
  res.json(result.rows[0] || null);
});

const startSync = async () => {
  try {
    const repos = await fetchTrendingRepos();
    await saveRepositories(repos);
    console.log(`Синхронизировано ${repos.length} репозиториев`);
    startCountdown();
  } catch (error) {
    console.error("Ошибка синхронизации:", error.message);
  }
};

router.post("/sync", async (req, res) => {
  clearInterval(syncTimer);
  await startSync();
  syncTimer = setInterval(startSync, syncInterval);
  res.json({ message: "Синхронизация запущена" });
});

startSync().then(() => {
  syncTimer = setInterval(startSync, syncInterval);
});

router.get("/sync-status", (req, res) => {
  if (!nextSyncTime) {
    return res.json({
      status: "Синхронизация не запущена",
      timeLeft: null,
    });
  }

  const timeLeft = nextSyncTime - Date.now();
  res.json({
    status: "Синхронизация активна",
    timeLeft: timeLeft > 0 ? timeLeft : 0,
  });
});

module.exports = router;
