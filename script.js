const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");

let progress = 0;

/* Fake smooth loading animation */
let loadingInterval = setInterval(() => {

progress += Math.random() * 10;

if (progress >= 90) {
progress = 90;
clearInterval(loadingInterval);
}

progressBar.style.width = progress + "%";

}, 200);


/* When page fully loads */
window.addEventListener("load", () => {

setTimeout(() => {

progressBar.style.width = "100%";

/* Fade out loading screen */
setTimeout(() => {

loadingScreen.style.transition = "opacity 0.5s ease";
loadingScreen.style.opacity = "0";

setTimeout(() => {
loadingScreen.style.display = "none";
}, 500);

}, 400);

}, 500);

});