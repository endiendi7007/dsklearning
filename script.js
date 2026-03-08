const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");
const loaderLogo = document.querySelector(".loader-logo");
const headerLogo = document.querySelector(".header-logo");

let progress = 0;
let websiteLoaded = false;

/* Progress to 90% fast */
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


/* detect page load */
window.addEventListener("load", () => {
websiteLoaded = true;
});


/* check repeatedly until loaded */
function checkIfLoaded() {

let checkInterval = setInterval(() => {

if (websiteLoaded) {

clearInterval(checkInterval);

/* go to 100% */
setTimeout(() => {

progressBar.style.width = "100%";

/* wait so user sees 100% */
setTimeout(startLogoAnimation, 800);

}, 200);

}

}, 300);

}


/* LOGO ANIMATION */
function startLogoAnimation() {

const loaderRect = loaderLogo.getBoundingClientRect();
const headerRect = headerLogo.getBoundingClientRect();

/* clone logo for animation */
const clone = loaderLogo.cloneNode(true);

clone.style.position = "fixed";
clone.style.left = loaderRect.left + "px";
clone.style.top = loaderRect.top + "px";
clone.style.width = loaderRect.width + "px";
clone.style.height = loaderRect.height + "px";

clone.style.transition = "all 1.6s ease";
clone.style.zIndex = "9999";

document.body.appendChild(clone);

/* hide loader logo */
loaderLogo.style.opacity = "0";

/* animate to header */
setTimeout(() => {

clone.style.left = headerRect.left + "px";
clone.style.top = headerRect.top + "px";
clone.style.width = headerRect.width + "px";
clone.style.height = headerRect.height + "px";

}, 50);


/* after animation finishes */
setTimeout(() => {

headerLogo.style.opacity = "1";

clone.remove();

/* hide loading screen */
loadingScreen.style.transition = "opacity 0.5s ease";
loadingScreen.style.opacity = "0";

setTimeout(() => {
loadingScreen.style.display = "none";
}, 500);

}, 1600);

}