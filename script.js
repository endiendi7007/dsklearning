// script.js
const progressBar = document.querySelector(".progress-bar");
const loadingScreen = document.getElementById("loading-screen");
const loaderLogo = document.querySelector(".loader-logo");
const headerLogo = document.querySelector(".header-logo");

let progress = 0;
let websiteLoaded = false;
let progressInterval = null;
let checkInterval = null;

/* Fast progress to 90% */
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

/* Check repeatedly until the page actually finishes loading */
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
  // ensure CSS transition for width is applied before changing width
  // (small timeout makes sure the browser registers the change)
  setTimeout(() => {
    progressBar.style.width = "100%";
  }, 50);

  // Wait for the progress bar width transition to end, then start logo animation
  const onBarTransition = (e) => {
    if (e.propertyName !== "width") return;
    progressBar.removeEventListener("transitionend", onBarTransition);
    // small visible pause at 100% to satisfy user dopamine
    setTimeout(() => {
      startLogoMoveAnimation();
    }, 200); // tweakable pause (200ms)
  };

  progressBar.addEventListener("transitionend", onBarTransition);
}

/* Create a clone, translate+scale it into the header logo, swap, then hide loader */
function startLogoMoveAnimation() {
  // safety: ensure both elements exist
  if (!loaderLogo || !headerLogo) {
    // fallback: just hide loader
    loadingScreen.style.opacity = "0";
    setTimeout(() => (loadingScreen.style.display = "none"), 450);
    return;
  }

  const loaderRect = loaderLogo.getBoundingClientRect();
  const headerRect = headerLogo.getBoundingClientRect();

  // create clone
  const clone = loaderLogo.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.left = loaderRect.left + "px";
  clone.style.top = loaderRect.top + "px";
  clone.style.width = loaderRect.width + "px";
  clone.style.height = loaderRect.height + "px";
  clone.style.margin = "0";
  clone.style.zIndex = "10000";
  clone.style.pointerEvents = "none";
  clone.style.transformOrigin = "0 0"; // origin top-left for correct scale
  clone.style.transition = "transform 1.2s cubic-bezier(.22,.9,.28,1), opacity 0.3s ease"; // visible slow move
  document.body.appendChild(clone);

  // hide original loader logo so user only sees the clone moving
  loaderLogo.style.visibility = "hidden";

  // ensure header logo is hidden until clone finishes
  headerLogo.style.opacity = "0";

  // compute translation and scale
  const deltaX = headerRect.left - loaderRect.left;
  const deltaY = headerRect.top - loaderRect.top;
  const scale = headerRect.width / loaderRect.width;

  // trigger animation on next frame
  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
  });

  // when clone animation finishes, show header logo, remove clone, then hide loader overlay
  const onCloneEnd = (e) => {
    // wait for transform to finish
    if (e.propertyName && e.propertyName !== "transform") return;
    clone.removeEventListener("transitionend", onCloneEnd);

    // reveal header logo
    headerLogo.style.opacity = "1";

    // remove clone after tiny delay so the swap is unnoticeable
    setTimeout(() => {
      clone.remove();

      // fade out the loading overlay
      loadingScreen.style.transition = "opacity 0.45s ease";
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 450);
    }, 60);
  };

  clone.addEventListener("transitionend", onCloneEnd, { once: false });
}

/* start the initial progress */
startProgressTo90();