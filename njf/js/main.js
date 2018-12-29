var audio = document.getElementById("audio");

var episodes;
var currentEpisode;
var input = document.getElementById("search-text");
var playlist = document.getElementById("playlist");

var searchIcon = document.getElementById("search-icon");
var clearSearch = document.getElementById("clear-search");

var mediaFolder = "https://filedn.com/lHHBHWtAlOt5syqI4onfcmB/NJF/media/";

clearSearch.onclick = function() {
	input.value = "";
	search();
};

input.addEventListener('input', search);

$.getJSON("episodes.json", function(json) {
    episodes = json.sort(function(a, b) {
        return parseFloat(a.episode) - parseFloat(b.episode);
    });
    search();

    currentEpisode = episodes.length - 1;
    loadEpisode();
    audio.pause();
});

function setEpisode(number) {
	currentEpisode = number;
	loadEpisode();
}

function displayEpisode(episode) {
	var container = document.createElement("div");
	container.innerText = "Episode " + episode.episode + ": " + episode.title;
	container.className = "episode clickable";
	container.onclick = function() {
		currentEpisode = episodes.indexOf(episode);
		loadEpisode();
	};

	playlist.appendChild(container);
}

function search() {
	var search = input.value;
	playlist.innerHTML = "";
	if(search.length > 0) {
		searchIcon.style.display = "none";
		clearSearch.style.display = "inline-block";
		episodes.forEach(function(episode) {
			if(episode.title.toLowerCase().includes(search.toLowerCase()) || episode.episode.toString().startsWith(search)) {
				displayEpisode(episode);
			}
		});
	} else {
		searchIcon.style.display = "inline-block";
		clearSearch.style.display = "none";
		episodes.forEach(function(episode) {
			displayEpisode(episode);
		});
	}
}

function loadEpisode() {
	var episode = episodes[currentEpisode];
	audio.setAttribute("src", mediaFolder + episode.src);
	audio.currentTime = episode.start;
	audio.play();

	var titleElement = document.getElementById("title");
	var episodeElement = document.getElementById("episode");

	titleElement.innerText = episode.title;
	episodeElement.innerText = "Episode " + episode.episode;
	episodeElement.title = episode.date;

	document.getElementById("youtube-button").onclick = function() {
		window.open("http://youtu.be/" + episode.id + "?t=" + episode.start);
	};
	document.getElementById("download-button").onclick = function() {
		window.open(mediaFolder + episode.src);
	};
}