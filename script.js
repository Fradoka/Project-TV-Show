//You can edit ALL of the code here
const container = document.getElementById("container");
const episodeCardTemplate = document.getElementById("episode-card");
const tvShowCardTemplate = document.getElementById("tvshow-card")
const input = document.getElementById("search");
const optionSelector = document.getElementById("episode-select");
const totalEpisodesListed = document.getElementById("showed-episodes");
const tvShowSearchInput = document.getElementById("search-tvshow-box");
const buttonReset = document.getElementById("reset");
const state = { allEpisodes: [], searchTerm: "" };
let filmsList = [];
let selectedFilm = null;

async function filmFetch(selectedFilm) {
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${selectedFilm}/episodes`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    state.allEpisodes = await response.json();
    showEpisode(state.allEpisodes);
    document.getElementById("title").textContent = filmsList.find(
      (film) => film.id === selectedFilm
    ).name;
  } catch (error) {
    alert(`Error fetching data: ${error.message}`);
    console.error('Error fetching data:', error);
  }
}

async function fetchAllFilms(){
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    filmsList = data.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  } catch (error) {
    alert(`Error fetching data: ${error.message}`);
    console.error('Error fetching data:', error);
  }
}

async function setup() {
  await fetchAllFilms();
  displayTvShows(filmsList);
}

function createFilmOptions(list){
  const filmOptions = list.map(createOptions);
  document.getElementById("film-select").innerHTML = `<option value="">-- Select A Film --</option>`;
  document.getElementById("film-select").append(...filmOptions);

  function createOptions(film){
    const filmOption = document.createElement('option');
    filmOption.value = film.id;
    filmOption.textContent = film.name;
    return filmOption;
  }
}

function createEpisodeCard({name, season, number, image: { medium, original }, summary, _links: { self: { href }, },}) {
  const episodeCard = episodeCardTemplate.content.cloneNode(true);
  episodeCard.querySelector("h3").textContent = name;
  episodeCard.querySelector("h4").textContent = `S${season
    .toString()
    .padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  episodeCard.querySelector("img").src = medium;
  episodeCard.querySelector("p").innerHTML = summary;
  return episodeCard;
}

function createTVShowCard (tvshow) {
  const tvShowCard = tvShowCardTemplate.content.cloneNode(true);
  tvShowCard.querySelector("h3").textContent = tvshow.name;
  tvShowCard.querySelector("h3").addEventListener("click", function (){
    let selected = filmsList.find((film) => film.name == this.textContent);
    if (selected) {
      container.innerHTML = "";
      selectedFilm = selected.id;
      filmFetch(selectedFilm);
    }
  });
  tvShowCard.querySelector("h3").style.cursor = "pointer";
  tvShowCard.querySelector("#rating").textContent = tvshow.rating.average;
  tvShowCard.querySelector("#genres").textContent = tvshow.genres.join(" | ");
  tvShowCard.querySelector("#status").textContent = tvshow.status;
  tvShowCard.querySelector("#runtime").textContent = tvshow.runtime;
  tvShowCard.querySelector("img").src = tvshow.image.medium;
  tvShowCard.querySelector("#show-text").innerHTML = tvshow.summary;
  return tvShowCard
}

function createOption(episode) {
  const option = document.createElement("option");
  option.value = episode.id;
  option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")} - ${episode.name}`;
  return option;
}

function showEpisode(episodesToShow) {
  container.innerHTML = "";

  let episodesToRender;
  if (Array.isArray(episodesToShow)) {
    episodesToRender = episodesToShow;
  } else {
    episodesToRender = [episodesToShow];
  }

  document.getElementById("episode-section").style.display = "block";
  document.getElementById("tvshow-section").style.display = "none";

  const episodeCards = episodesToRender.map(createEpisodeCard);
  container.append(...episodeCards);
  const episodesList = episodesToRender.map(createOption);
  optionSelector.innerHTML = `<option value="">-- Select an episode --</option>`;
  optionSelector.append(...episodesList);
  totalEpisodesListed.innerText = `Showing ${episodesToRender.length}/ ${state.allEpisodes.length} Episodes.`;
}

function displayTvShows (tvShowsToDisplay) {
  container.innerHTML = "";
  document.getElementById("episode-section").style.display = "none";
  document.getElementById("tvshow-section").style.display = "block";

  let tvShowToRender;
  if (Array.isArray(tvShowsToDisplay)) {
    tvShowToRender = tvShowsToDisplay;
  } else {
    tvShowToRender = [tvShowsToDisplay];
  }

  const tvShowCards = tvShowToRender.map (createTVShowCard);
  container.append(...tvShowCards);
  createFilmOptions(tvShowToRender);
}

input.addEventListener("input", function () {
  state.searchTerm = input.value;
  const filteredEpisodes = state.allEpisodes.filter((episode) =>
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
  );
    showEpisode(filteredEpisodes);
  return filteredEpisodes
});

tvShowSearchInput.addEventListener("input", () => {
  const term = tvShowSearchInput.value.toLowerCase();

  const filteredShows = filmsList.filter((show) => {
    const nameMatch = show.name.toLowerCase().includes(term);
    const genreMatch = show.genres.join(" ").toLowerCase().includes(term);
    const summaryMatch = (show.summary || "").toLowerCase().includes(term);
    return nameMatch || genreMatch || summaryMatch;
  });

  displayTvShows(filteredShows);
});

optionSelector.addEventListener("change", function () {
  const chosenEpisode = state.allEpisodes.find((episode) => episode.id == this.value);
  if (chosenEpisode) {
    container.innerHTML = "";
    showEpisode(chosenEpisode);
  }
  input.value = "";
  state.searchTerm = "";
});

buttonReset.addEventListener("click", () => {
  input.value = "";
  state.searchTerm = "";
  showEpisode(state.allEpisodes);
})

document.getElementById("back-to-shows").addEventListener("click", () => {
  input.value = "";
  state.searchTerm = "";
  displayTvShows(filmsList);
});

document.getElementById("film-select").addEventListener("change", function () {
  let selected = filmsList.find((film) => film.id == this.value);
  if (selected) {
    container.innerHTML = "";
    selectedFilm= selected.id;
    filmFetch(selectedFilm);
  }
})

window.onload = setup;