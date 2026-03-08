const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");

let progress = 0;
let websiteLoaded = false;

/* Fast progress to 90% */

let progressInterval = setInterval(() => {

progress += 5;

if (progress >= 90) {
progress = 90;
progressBar.style.width = progress + "%";
clearInterval(progressInterval);
checkIfLoaded();
return;
}

progressBar.style.width = progress + "%";

}, 50);


/* Detect when website is loaded */

window.addEventListener("load", () => {
websiteLoaded = true;
});


/* Keep checking if site loaded */

function checkIfLoaded() {

let checkInterval = setInterval(() => {

if (websiteLoaded) {

clearInterval(checkInterval);

/* Move to 100% */
progressBar.style.width = "100%";

/* Wait 5 seconds before opening site */

setTimeout(() => {

loadingScreen.style.transition = "opacity 0.15s ease";
loadingScreen.style.opacity = "0";

setTimeout(() => {
loadingScreen.style.display = "none";
}, 500);

}, 5000);

}

}, 300);

}