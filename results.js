const API_KEY = "88df5f4e8245bfca92505a3c2f1fcff6";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w185";

function getQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("query");
}

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

function renderResults(movies) {
  const container = document.getElementById("results-container");
  const noResults = document.getElementById("no-results");
  const resultCount = document.getElementById("result-count");

  container.innerHTML = "";

  // Filter movies to only include those with poster_path
  const moviesWithPosters = movies.filter(
    (movie) => movie.poster_path
  );

  if (moviesWithPosters.length === 0) {
    noResults.classList.remove("hidden");
    container.classList.add("hidden");
    resultCount.textContent = "";
  } else {
    noResults.classList.add("hidden");
    container.classList.remove("hidden");
    resultCount.textContent = `Found ${moviesWithPosters.length} results`;

    moviesWithPosters.forEach((movie) => {
      container.appendChild(createCard(movie));
    });
  }
}

async function searchMovies() {
  const query = getQuery();

  if (!query) {
    window.location.href = "index.html";
    return;
  }

  // Update search input with current query
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.value = query;
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    renderResults(data.results);
  } catch (error) {
    console.error("Error searching movies:", error);
  }
}

function setupSearch() {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-btn");

  if (!input || !button) return;

  function goToResults() {
    const query = input.value.trim();
    if (query) {
      // Redirect to results.html with new query
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

searchMovies();
setupSearch();