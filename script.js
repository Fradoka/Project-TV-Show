//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const episodeCardTemplate = document.getElementById("episode-card");
const input = document.getElementById("search");
const optionSelector = document.getElementById("episode-select");
const totalEpisodesListed = document.getElementById("showed-episodes");
const buttonReset = document.getElementById("reset");
const state = { allEpisodes: [], searchTerm: "" };

async function setup() {
  try {
    const response = await fetch ("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    state.allEpisodes = await response.json();
    showEpisode(state.allEpisodes);
  } catch (error) {
      alert(`Error fetching data: ${error.message}`);
      console.error('Error fetching data:', error);
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

function createOption(episode) {
  const option = document.createElement("option");
  option.value = episode.id;
  option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")} - ${episode.name}`;
  return option;
}

function showEpisode(episodesToShow) {
  rootElem.innerHTML = "";

  let episodesToRender;
  if (Array.isArray(episodesToShow)) {
    episodesToRender = episodesToShow;
  } else {
    episodesToRender = [episodesToShow];
  }

  const episodeCards = episodesToRender.map(createEpisodeCard);
  rootElem.append(...episodeCards);
  const episodesList = episodesToRender.map(createOption);
  optionSelector.innerHTML = `<option value="">-- Select an episode --</option>`;
  optionSelector.append(...episodesList);
  totalEpisodesListed.innerText = `Showing ${episodesToRender.length}/ ${state.allEpisodes.length} Episodes.`;
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

optionSelector.addEventListener("change", function () {
  const chosenEpisode = state.allEpisodes.find((episode) => episode.id == this.value);
  if (chosenEpisode) {
    rootElem.innerHTML = "";
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

window.onload = setup;