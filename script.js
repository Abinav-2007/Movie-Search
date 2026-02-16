const API_KEY = "88df5f4e8245bfca92505a3c2f1fcff6";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w185";

function createCard(movie) {
  const { title, poster_path, vote_average } = movie;
  const posterUrl = `${IMG_BASE_URL}${poster_path}`;

  const card = document.createElement("div");
  card.className =
    "bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer max-w-[180px] mx-auto";

  card.innerHTML = `
    <div class="w-full aspect-[2/3] bg-gray-900 flex items-center justify-center">
      <img 
        src="${posterUrl}" 
        alt="${title}" 
        class="max-h-full max-w-full object-contain"
      />
    </div>
    <div class="p-2">
      <h3 class="text-white text-xs font-semibold truncate">
        ${title}
      </h3>
      <div class="flex items-center justify-between mt-1">
        <span class="text-yellow-400 font-bold text-xs">
          ⭐ ${vote_average.toFixed(1)}
        </span>
      </div>
    </div>
  `;

  return card;
}

function renderGrid(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Filter movies to only include those with poster_path
  const moviesWithPosters = movies.filter(
    (movie) => movie.poster_path
  );

  moviesWithPosters.slice(0, 18).forEach((movie) => {
    container.appendChild(createCard(movie));
  });
}

async function fetchPopularMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();
    renderGrid(data.results, "movie-container");
  } catch (error) {
    console.error("Error fetching popular movies:", error);
  }
}

async function fetchTopRatedMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
    );
    const data = await response.json();
    renderGrid(data.results, "top-rated-container");
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
  }
}

function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-btn");

  if (!input || !button) return;

  function goToResults() {
    const query = input.value.trim();
    if (query) {
      window.location.href = `results.html?query=${encodeURIComponent(
        query
      )}`;
    }
  }

  button.addEventListener("click", goToResults);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") goToResults();
  });
}

fetchPopularMovies();
fetchTopRatedMovies();
setupSearch();