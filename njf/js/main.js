// Elements
var audio = document.getElementById("audio");
var searchTextElement = document.getElementById("search-text");
var playlistElement = document.getElementById("playlist");
var clearSearchElement = document.getElementById("clear-search");
var titleElement = document.getElementById("title");
var episodeElement = document.getElementById("episode");
var hdToggleElement = document.getElementById("hd-switch");
var hdToggleLabel = document.getElementById("hd-toggle-label");
var downloadButton = document.getElementById("download-button");
var youtubeButton = document.getElementById("youtube-button");
var searchIcon = document.getElementById("search-icon");
var clearSearch = document.getElementById("clear-search");

// Set variables
var monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July",
    "August", "September", "October", "November", "December"
];
var mediaFolder = "https://filedn.com/lHHBHWtAlOt5syqI4onfcmB/NJF/media/";

// Empty variables
var episodes;
var currentEpisode = 0;
var cookies = {};

// On load JSON
$.getJSON("episodes.json", function (json) {

    // Sort episodes by the number
    episodes = json.sort(function(a, b) {
        return parseFloat(a.episode) - parseFloat(b.episode);
    });

    // Add event listeners
    searchTextElement.addEventListener('input', search);
    hdToggleElement.onclick = function () {
        setHD(hdToggleElement.checked)
    };
    clearSearchElement.onclick = function () {
        searchTextElement.value = "";
        search();
    };

    // Load playlist
    search();

    // Load episode
    loadCookies();
    setEpisode(episodes[cookies.lastEpisode], cookies.lastTime);
    audio.pause();
    setHD(cookies.hd);

	playlistElement.scrollTo(0, playlistElement.scrollHeight);
});

// On unload
window.onunload = function () {
    saveCookies();
};

// Update search results
function search() {
    var search = searchTextElement.value;
    playlistElement.innerHTML = "";
    if (search.length > 0) {
        searchIcon.style.display = "none";
        clearSearch.style.display = "inline-block";
        episodes.forEach(function (episode) {
            if (episode.title.toLowerCase().includes(search.toLowerCase()) || episode.episode.toString().startsWith(search)) {
                show(episode);
            }
        });
    } else {
        searchIcon.style.display = "inline-block";
        clearSearch.style.display = "none";
        episodes.forEach(function (episode) {
            show(episode);
        });
    }
}

// Show an an episode on the playlist
function show(episode) {
    var container = document.createElement("div");
    container.innerText = "Episode " + episode.episode + ": " + episode.title;
    container.className = "episode clickable";
    container.onclick = function() {
        setEpisode(episode);
    };

    playlistElement.appendChild(container);
}

// Sets the current episode
function setEpisode(episode, time) {

    currentEpisode = episodes.indexOf(episode);

    // Variables
    var date = new Date(episode.date);
    ;
    var src = getSrc(episode);

    // Load
    setSource(src, true, time ? time : episode.start);
    youtubeButton.onclick = function () {
        window.open("http://youtu.be/" + episode.id + "?t=" + episode.start);
    };

    // Display
    titleElement.innerText = episode.title;
    episodeElement.innerText = "Episode " + episode.episode;
    episodeElement.title = monthNames[date.getMonth()] + ' ' + date.getDay() + ', ' + date.getFullYear();

    //Set cookies
    cookies.lastEpisode = episode.episode;
}

function getSrc(episode) {
    return hdToggleElement.checked ? episode.src : episode.src.substring(0, episode.src.lastIndexOf(".")) + ".mp3";
}

// Changes source to HD or SD
function setHD(hd) {

    var episode = episodes[currentEpisode];
    var wasPlaying = !audio.paused;
    var src = getSrc(episode);

    hd ? hdToggleLabel.style.color = "#237b91" : hdToggleLabel.style.color = "#000";

    if (hdToggleElement.checked !== (hd === "true" || hd === true)) {
        hdToggleElement.checked = hd;
    }

    setSource(src, wasPlaying, audio.currentTime);

    downloadButton.onclick = function () {
        window.open(mediaFolder + src);
    };
}

// Sets the source of audio
function setSource(source, autoplay, timestamp) {
    audio.setAttribute("src", mediaFolder + source);
    if (timestamp) {
        audio.currentTime = timestamp;
    }
    if (autoplay === true) {
        audio.play();
    }
}

// Load cookies
function loadCookies() {
    var lastEpisode = getCookie("LastEpisodeIndex");
    cookies.lastEpisode = lastEpisode !== "" && lastEpisode > -1 ? lastEpisode : episodes.length - 1;

    var lastTime = getCookie("LastTime");
    cookies.lastTime = lastTime !== "" ? lastTime : episodes[currentEpisode].start;

    var hd = getCookie("HD");
    cookies.hd = hd !== "" ? hd : true;
}

// Save cookies
function saveCookies() {
    cookies = {
        lastEpisode: currentEpisode,
        lastTime: audio.currentTime,
        hd: hdToggleElement.checked
    };
    setCookie("LastEpisodeIndex", cookies.lastEpisode, 30);
    setCookie("LastTime", cookies.lastTime, 30);
    setCookie("HD", cookies.hd, 30);
}

// Straight from https://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
