var names = [
    "Akoot", "Skoot", "Skooter", "Akoota Matata", "Acute", "A Coot", "Kahoot", "Aboot"
];

var logo = document.getElementById("logo");
logo.onclick = changeName;

var lastRand = -1;

function changeName() {
    var rand = Math.round(Math.random() * (names.length - 1));
    while (rand === lastRand) {
        rand = Math.round(Math.random() * (names.length - 1));
    }
    lastRand = rand;
    document.getElementById("name").innerText = names[rand];
    logo.style.backgroundImage = "url(img/fox/" + rand + ".png)";
}

changeName();