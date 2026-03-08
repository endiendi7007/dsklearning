const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");

let progress = 0;

/* Smooth loading up to 90% */
let loadingInterval = setInterval(() => {

progress += 2;

if (progress >= 90) {
progress = 90;
progressBar.style.width = progress + "%";
clearInterval(loadingInterval);
}

progressBar.style.width = progress + "%";

}, 40);


/* When page finishes loading */
window.addEventListener("load", () => {

setTimeout(() => {

/* Final jump to 100% */
progressBar.style.width = "100%";

/* Small pause so users see 100% */
setTimeout(() => {

/* Fade out loader */
loadingScreen.style.transition = "opacity 0.5s ease";
loadingScreen.style.opacity = "0";

setTimeout(() => {
loadingScreen.style.display = "none";
}, 500);

}, 300);

}, 500);

});