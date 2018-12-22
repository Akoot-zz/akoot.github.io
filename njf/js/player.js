var playPause = document.getElementById("play-pause");
var scrubber = document.getElementById("scrubber");
var audio = document.getElementById("audio");
var playIcon = document.getElementById("play");
var pauseIcon = document.getElementById("pause");
var timeline = document.getElementById("timeline");
var timePlayed = document.getElementById("time-played");

var duration;
var timelineWidth = timeline.offsetWidth - scrubber.offsetWidth;
var onPlayHead = false;
var durationFormatted = "?";

playPause.addEventListener("click", togglePlayPause);
scrubber.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);
audio.addEventListener("timeupdate", timeUpdate, false);
audio.addEventListener("canplaythrough", function () {
    duration = audio.duration;
    durationFormatted = getTime(duration);
    if (audio.paused) {
        pause(true);
    } else {
        pause(false);
    }
    document.getElementById("time-remaining").innerText = getTime(audio.duration);
}, false);
timeline.addEventListener("click", function (event) {
    moveScrubber(event);
    audio.currentTime = duration * clickPercent(event);
}, false);

function clickPercent(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

function mouseDown() {
    onPlayHead = true;
    window.addEventListener('mousemove', moveScrubber, true);
    audio.removeEventListener('timeupdate', timeUpdate, false);
}

function mouseUp(event) {
    if (onPlayHead === true) {
        moveScrubber(event);
        window.removeEventListener('mousemove', moveScrubber, true);

        audio.currentTime = duration * clickPercent(event);
        audio.addEventListener('timeupdate', timeUpdate, false);
    }
    onPlayHead = false;
}

function moveScrubber(event) {
    var newMarginLeft = event.clientX - getPosition(timeline);

    if (newMarginLeft >= 0 && newMarginLeft <= timelineWidth) {
        setScrubberWidth(newMarginLeft);
    }
    else if (newMarginLeft < 0) {
        setScrubberWidth(0);
    }
    else if (newMarginLeft > timelineWidth) {
        setScrubberWidth(timelineWidth);
    }
}

function setScrubberWidth(width) {
    var height = scrubber.offsetHeight;
    scrubber.style.width = (width < height ? height : width) + "px";
}

function timeUpdate() {
    var playPercent = timelineWidth * (audio.currentTime / duration);
    setScrubberWidth(playPercent);
    if (audio.currentTime === duration) {
        pause(false);
    }
    timePlayed.innerText = getTime(audio.currentTime);
}

function togglePlayPause() {
    if(audio.getAttribute("src")) {
        if (audio.paused) {
            audio.play();
            pause(false);
        } else {
            audio.pause();
            pause(true);
        }
    }
}

function pause(toggle) {
    playIcon.style.display = toggle ? "inline" : "none";
    pauseIcon.style.display = toggle ? "none" : "inline";
}

function getTime(seconds) {
    var minutes = (seconds / 60).toFixed(0);
    seconds = (seconds % 60).toFixed(0);
    return minutes + ":" + (seconds >= 10 ? seconds : "0" + seconds);
}

function getPosition(element) {
    return element.getBoundingClientRect().left;
}