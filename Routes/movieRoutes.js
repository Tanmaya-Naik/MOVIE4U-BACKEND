const express = require("express");
const axios = require("axios");
const router = express.Router();
const mockData = require("../mock/movies.json"); // <-- added mock data

const API_KEY = process.env.TMDB_API_KEY;
if (!API_KEY) console.warn("⚠️ TMDB_API_KEY not found in .env");

// Route: Fetch movies by category (popular, top_rated, etc.)
router.get("/movies/:category", async (req, res) => {
  const category = req.params.category || "popular";
  const page = req.query.page || 1;

  if (!API_KEY) {
    console.log("⚙️ Serving mock movie list (no API key)");
    return res.json(mockData);
  }

  try {
    console.log(`📡 Fetching movies for category: ${category}, page: ${page}`);
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${category}`,
      { params: { api_key: API_KEY, language: "en-US", page } }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB Fetch Error:", error.message);
    console.log("⚙️ Using mock data instead");
    res.json(mockData);
  }
});

// Route: Fetch movie info (name, rating, release date, cast, director)
router.get("/movie-info/:id", async (req, res) => {
  const { id } = req.params;

  if (!API_KEY) {
    const movie = mockData.results.find((m) => m.id === parseInt(id));
    return movie
      ? res.json(movie)
      : res.status(404).json({ message: "Movie not found in mock data" });
  }

  try {
    const movieRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}`,
      { params: { api_key: API_KEY, language: "en-US" } }
    );

    const creditsRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/credits`,
      { params: { api_key: API_KEY, language: "en-US" } }
    );

    const movie = movieRes.data;
    const cast = creditsRes.data.cast
      .slice(0, 5)
      .map((c) => c.name)
      .join(", ");
    const director = creditsRes.data.crew.find((c) => c.job === "Director");

    res.json({
      id: movie.id,
      title: movie.title,
      rating: movie.vote_average,
      release_date: movie.release_date,
      director: director ? director.name : "Unknown",
      cast,
    });
  } catch (error) {
    console.error("❌ Error fetching movie info:", error.message);
    console.log("⚙️ Serving mock movie details");
    const movie = mockData.results.find((m) => m.id === parseInt(id));
    if (movie) return res.json(movie);
    res.status(500).json({ message: "Failed to fetch movie info" });
  }
});

module.exports = router;
