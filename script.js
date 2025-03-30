//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const episodeCardTemplate = document.getElementById("episode-card");
const allEpisodes = getAllEpisodes();
const state = { allEpisodes, searchTerm: "" };
let filteredEpisodes = "";

function setup() {
  showEpisode(allEpisodes);
}

function showEpisode(episodesToShow) {
  rootElem.innerHTML = "";
  const filteredEpisodes = state.allEpisodes.filter(function (episode) {
    return (
      episode.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      episode.summary.toLowerCase().includes(state.searchTerm.toLowerCase())
    );
  });

  let episodesToRender;
  if (Array.isArray(episodesToShow)) {
    episodesToRender = filteredEpisodes;
  } else {
    episodesToRender = [episodesToShow];
  }

  const episodeCards = episodesToRender.map(createEpisodeCard);
  rootElem.append(...episodeCards);
  document.getElementById("showed-episodes").innerText = `Showing ${filteredEpisodes.length}/ 73 Episodes.`;
}

function createEpisodeCard({name, season, number, image: { medium, original }, summary, _links: { self: { href } },}) {
  const episodeCard = episodeCardTemplate.content.cloneNode(true);
  episodeCard.querySelector("h3").textContent = name;
  episodeCard.querySelector("h4").textContent = `S${season
    .toString()
    .padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  episodeCard.querySelector("img").src = medium;
  episodeCard.querySelector("p").innerHTML = summary;
  return episodeCard;
}

const input = document.querySelector("input");
input.addEventListener("keyup", function () {
  state.searchTerm = input.value;
  showEpisode(state.allEpisodes);
});

function createOption(episode) {
  const option = document.getElementById("option-template").content.cloneNode(true);
  function makeEpisodeTitle() {
    return `S${episode.season.toString().padStart(2, "0")}E${episode.number
      .toString()
      .padStart(2, "0")} - ${episode.name}`;
  }
  const title = makeEpisodeTitle();
  option.querySelector("option").textContent = title;
  option.querySelector("option").value = episode.id;
  return option;
}
const selectElement = document.getElementById("episode-select");
allEpisodes.forEach((episode) => {
  const optionElement = createOption(episode);
  selectElement.appendChild(optionElement);
});

function handleSelect(event) {
  const chosenEpisode = allEpisodes.find((episode) => episode.id == this.value);
  if (chosenEpisode) {
    showEpisode(chosenEpisode);
    document.getElementById("showed-episodes").innerText = `Showing 1/ 73 Episodes.`;
  } else {
    showEpisode(allEpisodes);
  }
}

selectElement.addEventListener("change", handleSelect);
window.onload = setup;