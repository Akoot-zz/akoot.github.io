var overlay = document.getElementById("overlay");
var source = document.getElementById("source");
var download = document.getElementById("download-source");

function play(file, width, height) {
    showOverlay();
    var src = "https://filedn.com/lHHBHWtAlOt5syqI4onfcmB/swf/" + file;
    source.setAttribute("src", src);
    source.setAttribute("width", width);
    source.setAttribute("height", height);
    download.setAttribute("href", src);
}

function hideOverlay() {
    overlay.style.display = "none";
}

function showOverlay() {
    overlay.style.display = "block";
}