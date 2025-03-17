//You can edit ALL of the code here
const rootElem = document.getElementById("root");
const episodeCardTemplate = document.getElementById("episode-card");

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {  
  const episodeCards = episodeList.map(createEpisodeCard)
  rootElem.append(...episodeCards);
}

function createEpisodeCard({id, url, name, season, number, airdate, airtime, airstamp, runtime, image:{medium, original}, summary, _links:{self:{href}}}) {
  const episodeCard = episodeCardTemplate.content.cloneNode(true);
  episodeCard.querySelector("h3").textContent = name;
  episodeCard.querySelector("h4").textContent = `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`;
  episodeCard.querySelector("img").src = medium;
  episodeCard.querySelector("p").innerHTML = summary;

  return episodeCard;
}
window.onload = setup;


