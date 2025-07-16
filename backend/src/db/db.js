const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Ошибка подключения к БД:", err);
  } else {
    console.log(
      "Подключение к PostgreSQL успешно. Текущее время:",
      res.rows[0].now
    );
  }
});

const saveRepositories = async (repos) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const repo of repos) {
      await client.query(
        `
        INSERT INTO repositories (id, name, stars, url, description, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE
        SET stars = EXCLUDED.stars, 
        description = EXCLUDED.description,
        updated_at = EXCLUDED.updated_at 
      `,
        [
          repo.id,
          repo.name,
          repo.stargazers_count,
          repo.html_url,
          repo.description,
          new Date(repo.pushed_at),
        ]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, saveRepositories };
