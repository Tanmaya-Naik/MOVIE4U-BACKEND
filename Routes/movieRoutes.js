const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/movies/:category", async (req, res) => {
  const category = req.params.category || "popular";
  const page = req.query.page || 1;
  const API_KEY = process.env.TMDB_API_KEY;

  try {
    console.log(`Fetching TMDB: ${category}, page: ${page}`);
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${category}?api_key=${API_KEY}&language=en-US&page=${page}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB Fetch Error:", error.message);
    res.status(500).json({ message: "Error fetching movies" });
  }
});

module.exports = router;
