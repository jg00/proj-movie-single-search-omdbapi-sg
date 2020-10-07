// The OMDB API. Free apikey.
const fetchdata = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "eef0e908",
      s: searchTerm,
    },
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

// Autocomplete HTML Structure
const root = document.querySelector(".autocomplete");
root.innerHTML = `
  <label><b>Search For a Movie</b></label>
  <input class="input" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

// Select Elements
const input = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

// Search For and Display List
const onInput = async (event) => {
  const movies = await fetchdata(event.target.value);

  // Handle Movie Search Returns None
  if (!movies.length) {
    dropdown.classList.remove("is-active");
    return;
  }

  // Clear List Then Display New Search Results
  resultsWrapper.innerHTML = "";
  dropdown.classList.add("is-active");
  for (let movie of movies) {
    const option = document.createElement("a");
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;

    option.classList.add("dropdown-item");
    option.innerHTML = `
      <img src="${imgSrc}"/>
      ${movie.Title}
    `;
    option.addEventListener("click", (event) => {
      dropdown.classList.remove("is-active");
      input.value = movie.Title;
      onMovieSelect(movie);
    });

    resultsWrapper.appendChild(option);
  }
};

// Follow Up Request For Additional Movie Details By Id
const onMovieSelect = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "eef0e908",
      i: movie.imdbID,
    },
  });

  // Render Summary
  document.querySelector("#summary").innerHTML = movieTemplate(response.data);
};

// Movie Template
const movieTemplate = (movieDetail) => {
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" />
        </p>
      </figure>

      <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>

    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
};

// Event Listeners
input.addEventListener("input", debounce(onInput, 1000));

// Close dropdown list if event.target is not part of the root element.
document.addEventListener("click", (event) => {
  if (!root.contains(event.target)) {
    dropdown.classList.remove("is-active");
  }
});

/*
  Search by title: http://www.omdbapi.com?apikey=eef0e908&s=avengers
  Search by id (details): http://www.omdbapi.com/?apikey=eef0e908&i=tt0848228
  Poster: https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg
*/

/*
  // 1 Ref - Before Debounce Function
  // The OMDB API. Free apikey.
  const fetchdata = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        apikey: "eef0e908",
        s: searchTerm,
      },
    });

    console.log(response);
  };

  const input = document.querySelector("input");

  let timeoutId;
  const onInput = (event) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fetchdata(event.target.value);
    }, 2000);
  };

  input.addEventListener("input", onInput);
  */
