var audio = document.getElementById("audio");

var episodes;
var currentEpisode;
var input = document.getElementById("search-text");
var playlist = document.getElementById("playlist");

var searchIcon = document.getElementById("search-icon");
var clearSearch = document.getElementById("clear-search");

var mediaFolder = "https://filedn.com/lHHBHWtAlOt5syqI4onfcmB/NJF/media/";

var monthNames = [
	"January", "February", "March",
	"April", "May", "June", "July",
	"August", "September", "October",
	"November", "December"
];

clearSearch.onclick = function() {
	input.value = "";
	search();
};

input.addEventListener('input', search);

$.getJSON("episodes.json", function (json) {
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
        if (audio.paused) {
            audio.play();
        }
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

function loadEpisode(time) {
    var isHD = document.getElementById("hd-switch").checked;
	var episode = episodes[currentEpisode];
	var src = isHD ? episode.src : episode.src.substring(0, episode.src.lastIndexOf(".")) + ".mp3";

    if (!time) {
        time = episode.start;
    }

    audio.setAttribute("src", mediaFolder + src);
    audio.currentTime = time;

	var titleElement = document.getElementById("title");
	var episodeElement = document.getElementById("episode");

	var date = new Date(episode.date);

	titleElement.innerText = episode.title;
	episodeElement.innerText = "Episode " + episode.episode;
	episodeElement.title = monthNames[date.getMonth()] + ' ' + date.getDay() + ', ' + date.getFullYear();

	document.getElementById("youtube-button").onclick = function() {
		window.open("http://youtu.be/" + episode.id + "?t=" + episode.start);
	};
	document.getElementById("download-button").onclick = function() {
        window.open(mediaFolder + src);
    };
    document.getElementById("hd-toggle").onclick = function () {
        var wasPlaying = !audio.paused;
        loadEpisode(audio.currentTime);
        if (wasPlaying) {
            audio.play();
        }
        if (!isHD) {
            document.getElementById("hd-toggle-label").style.color = "#237b91";
        } else {
            document.getElementById("hd-toggle-label").style.color = "#000";
        }
    }
}