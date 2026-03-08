const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");

let progress = 0;
let websiteLoaded = false;

/* Progress to 90% */
let progressInterval = setInterval(() => {

progress += 4;

if (progress >= 90) {
progress = 90;
progressBar.style.width = progress + "%";
clearInterval(progressInterval);
checkIfLoaded();
return;
}

progressBar.style.width = progress + "%";

}, 40);


/* Detect page load */
window.addEventListener("load", () => {
websiteLoaded = true;
});


/* Check repeatedly until loaded */
function checkIfLoaded() {

let checkInterval = setInterval(() => {

if (websiteLoaded) {

clearInterval(checkInterval);

/* Go to 100% */
setTimeout(() => {

progressBar.style.width = "100%";

/* Wait a moment so user sees 100% */
setTimeout(() => {

loadingScreen.style.transition = "opacity 0.5s ease";
loadingScreen.style.opacity = "0";

setTimeout(() => {
loadingScreen.style.display = "none";
}, 500);

}, 800);

}, 200);

}

}, 300);

}