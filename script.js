// script.js (replace the whole file)
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
  // small gap so CSS transition is applied reliably
  setTimeout(() => {
    progressBar.style.width = "100%";
  }, 50);

  // When the width transition completes, start the logo animation.
  const onBarTransition = (e) => {
    if (e.propertyName !== "width") return;
    progressBar.removeEventListener("transitionend", onBarTransition);
    // small visible pause at 100% before movement (tweakable)
    setTimeout(() => {
      startLogoMoveAnimation();
    }, 200);
  };

  progressBar.addEventListener("transitionend", onBarTransition);
}

/* Animate a cloned logo from loader to header using center-based translation + scale */
function startLogoMoveAnimation() {
  if (!loaderLogo || !headerLogo) {
    // fallback: hide overlay if logos missing
    loadingScreen.style.transition = "opacity 0.45s ease";
    loadingScreen.style.opacity = "0";
    setTimeout(() => (loadingScreen.style.display = "none"), 450);
    return;
  }

  const loaderRect = loaderLogo.getBoundingClientRect();
  const headerRect = headerLogo.getBoundingClientRect();

  // compute center points (viewport coords)
  const loaderCenterX = loaderRect.left + loaderRect.width / 2;
  const loaderCenterY = loaderRect.top + loaderRect.height / 2;
  const headerCenterX = headerRect.left + headerRect.width / 2;
  const headerCenterY = headerRect.top + headerRect.height / 2;

  // translation needed (from loader center to header center)
  const deltaX = headerCenterX - loaderCenterX;
  const deltaY = headerCenterY - loaderCenterY;

  // scale factor (header width / loader width)
  const scale = headerRect.width / loaderRect.width;

  // create clone and position it exactly over the loader logo
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
  clone.style.willChange = "transform, opacity";
  // slower, visible move; adjust the duration here if you want faster/slower
  clone.style.transition = "transform 1.4s cubic-bezier(.22,.9,.28,1), opacity 0.25s ease";

  document.body.appendChild(clone);

  // hide the original loader logo during animation (keeps only clone visible)
  loaderLogo.style.visibility = "hidden";

  // keep header logo hidden until clone finishes
  headerLogo.style.opacity = "0";

  // apply transform on next frame to ensure transition runs
  requestAnimationFrame(() => {
    clone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
  });

  // when the clone finishes moving, reveal header logo and remove clone, then hide overlay
  const onCloneEnd = (e) => {
    // ignore other transitionend events; wait for transform
    if (e && e.propertyName && e.propertyName !== "transform") return;
    clone.removeEventListener("transitionend", onCloneEnd);

    // reveal header logo (so it replaces clone)
    headerLogo.style.opacity = "1";

    // small delay so the swap is unnoticeable
    setTimeout(() => {
      clone.remove();

      // fade out the loading overlay now that the logo has moved
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