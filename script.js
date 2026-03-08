// script.js
const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");
const loaderLogo = document.querySelector(".loader-logo");
const headerLogo = document.querySelector(".header-logo");

let progress = 0;
let websiteLoaded = false;
let progressInterval = null;
let checkInterval = null;

/* Progress quickly up to 90% */
function startProgressTo90() {
  progressInterval = setInterval(() => {
    progress += 4;
    if (progress >= 90) {
      progress = 90;
      progressBar.style.width = progress + "%";
      clearInterval(progressInterval);
      progressInterval = null;
      startCheckingLoaded();
      return;
    }
    progressBar.style.width = progress + "%";
  }, 40);
}

/* Repeatedly check until the page actually finishes loading */
function startCheckingLoaded() {
  checkInterval = setInterval(() => {
    if (websiteLoaded) {
      clearInterval(checkInterval);
      checkInterval = null;
      finalizeTo100AndAnimate();
    }
  }, 250);
}

/* When real page load fires, flip this flag */
window.addEventListener("load", () => {
  websiteLoaded = true;
});

/* Move to 100% then wait for the width transition to finish, then animate logo */
function finalizeTo100AndAnimate() {
  setTimeout(() => {
    progressBar.style.width = "100%";
  }, 50);

  const onBarTransition = (e) => {
    if (e.propertyName !== "width") return;
    progressBar.removeEventListener("transitionend", onBarTransition);
    setTimeout(() => {
      startLogoMoveAnimation();
    }, 200);
  };

  progressBar.addEventListener("transitionend", onBarTransition);
}

/* Animate a cloned logo from loader to header using center-based translation + scale */
function startLogoMoveAnimation() {
  if (!loaderLogo || !headerLogo) {
    loadingScreen.style.transition = "opacity 0.45s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => (loadingScreen.style.display = "none"), 450);
    return;
  }

  const loaderRect = loaderLogo.getBoundingClientRect();
  const headerRect = headerLogo.getBoundingClientRect();

  // Scold checkpoint: Catch zero-dimensions
  if (headerRect.width === 0) {
    console.error("Your header logo has 0 width! Remove 'display: none' from its CSS.");
  }

  const loaderCenterX = loaderRect.left + loaderRect.width / 2;
  const loaderCenterY = loaderRect.top + loaderRect.height / 2;
  const headerCenterX = headerRect.left + headerRect.width / 2;
  const headerCenterY = headerRect.top + headerRect.height / 2;

  const deltaX = headerCenterX - loaderCenterX;
  const deltaY = headerCenterY - loaderCenterY;
  const scale = headerRect.width / loaderRect.width || 1; // Fallback to 1 to prevent vanishing

  const clone = loaderLogo.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = loaderRect.left + "px";
  clone.style.top = loaderRect.top + "px";
  clone.style.width = loaderRect.width + "px";
  clone.style.height = loaderRect.height + "px";
  clone.style.margin = "0";
  clone.style.zIndex = "10000";
  clone.style.pointerEvents = "none";
  clone.style.transformOrigin = "center center";
  
  // FIX: Wipe out any inherited CSS transforms that skew the starting position
  clone.style.transform = "translate(0px, 0px) scale(1)";

  document.body.appendChild(clone);

  loaderLogo.style.visibility = "hidden";
  headerLogo.style.opacity = "0";

  // FIX: Force a browser reflow so the starting state is registered before animating
  void clone.offsetWidth;

  clone.style.willChange = "transform, opacity";
  clone.style.transition = "transform 1.4s cubic-bezier(.22,.9,.28,1), opacity 0.25s ease";

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
  });

  const onCloneEnd = (e) => {
    if (e && e.propertyName && e.propertyName !== "transform") return;
    clone.removeEventListener("transitionend", onCloneEnd);

    headerLogo.style.opacity = "1";

    setTimeout(() => {
      clone.remove();
      loadingScreen.style.transition = "opacity 0.45s ease";
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 450);
    }, 60);
  };

  clone.addEventListener("transitionend", onCloneEnd);
}

/* start everything */
startProgressTo90();
