// script.js
const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");
const loaderLogo = document.querySelector(".loader-logo");
const headerLogo = document.querySelector(".header-logo");

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

/* Detect when site loaded */
window.addEventListener("load", () => {
  websiteLoaded = true;
});

/* Keep checking if site loaded */
function checkIfLoaded() {
  let checkInterval = setInterval(() => {
    if (websiteLoaded) {
      clearInterval(checkInterval);

      // small delay before finalizing to make the UX smooth
      setTimeout(() => {
        // go to 100% (CSS transition controls how fast)
        progressBar.style.width = "100%";
      }, 150); // 0.15s

      // when width transition ends, start logo move
      progressBar.addEventListener("transitionend", onBarComplete);
    }
  }, 300);
}

function onBarComplete(e) {
  if (e.propertyName !== "width") return;
  progressBar.removeEventListener("transitionend", onBarComplete);
  animateLogoToHeader();
}

function animateLogoToHeader() {
  // get bounding boxes
  const loaderRect = loaderLogo.getBoundingClientRect();
  const headerRect = headerLogo.getBoundingClientRect();

  // create a visual clone of the loader logo to animate
  const clone = loaderLogo.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = loaderRect.left + "px";
  clone.style.top = loaderRect.top + "px";
  clone.style.width = loaderRect.width + "px";
  clone.style.height = loaderRect.height + "px";
  clone.style.margin = "0";
  clone.style.zIndex = "10000";
  clone.style.transition = "all 0.9s cubic-bezier(.22,.9,.28,1)"; // visible move + smooth ease
  clone.style.pointerEvents = "none";
  document.body.appendChild(clone);

  // hide the original loader logo so user only sees the clone moving
  loaderLogo.style.visibility = "hidden";

  // ensure header logo is invisible until clone reaches it
  headerLogo.style.opacity = "0";

  // force a frame then start the animation to header position/size
  requestAnimationFrame(() => {
    // set final position/size to header's rect
    clone.style.left = headerRect.left + "px";
    clone.style.top = headerRect.top + "px";
    clone.style.width = headerRect.width + "px";
    clone.style.height = headerRect.height + "px";
  });

  // when clone finishes moving, show header logo and remove clone, then hide overlay
  clone.addEventListener(
    "transitionend",
    () => {
      // reveal the real header logo (so it replaces the clone)
      headerLogo.style.opacity = "1";

      // remove clone
      clone.remove();

      // small delay to make the swap unnoticeable
      setTimeout(() => {
        // finally fade out the loading overlay (logo already moved)
        loadingScreen.style.transition = "opacity 0.4s ease";
        loadingScreen.style.opacity = "0";

        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 400);
      }, 80);
    },
    { once: true }
  );
}