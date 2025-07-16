const axios = require("axios");
require("dotenv").config();

const fetchTrendingRepos = async () => {
  try {
    const response = await axios.get(
      "https://api.github.com/search/repositories",
      {
        params: {
          q: "stars:>1000",
          sort: "stars",
          order: "desc",
          per_page: 15,
        },
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        },
      }
    );
    return response.data.items;
  } catch (error) {
    console.error("GitHub API Error:", error.message);
    return [];
  }
};

module.exports = { fetchTrendingRepos };
