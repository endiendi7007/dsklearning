// Wait for DOM and all resources (images, fonts, etc.) to be fully loaded
window.addEventListener('load', function() {
  // Trigger progress bar to 100% and then fade out loading screen
  finishLoading();
});

// Simulate progress increments for a smoother experience
// (In real projects you might rely on resource loading events, but this gives a nice fill)
const progressBar = document.getElementById('progress-bar');
const loadingScreen = document.getElementById('loading-screen');
const mainContent = document.getElementById('main-content');

let progress = 0;
let completed = false;

// Function to update progress bar width
function setProgress(value) {
  progress = Math.min(value, 100);
  progressBar.style.width = progress + '%';
}

// Simulate incremental progress (like a real loading sequence)
// We'll use a combination of DOMContentLoaded and window.load + some fake steps
const interval = setInterval(function() {
  if (completed) return; // stop once we're done

  // Increase progress slowly, but don't go over 90% until fully loaded
  if (progress < 90) {
    setProgress(progress + (Math.random() * 10));
  } else {
    // Wait for the actual load event to jump to 100%
    clearInterval(interval);
  }
}, 300);

// When DOM is ready, we can give a little boost
document.addEventListener('DOMContentLoaded', function() {
  // DOM is parsed, maybe set to 40-60%
  if (!completed && progress < 60) {
    setProgress(60);
  }
});

// Function called when everything is truly loaded
function finishLoading() {
  if (completed) return;
  completed = true;

  // Stop the incremental interval
  clearInterval(interval);

  // Fill progress bar to 100% smoothly
  setProgress(100);

  // After a tiny delay (to let the bar fill and logo pulse once more), fade out
  setTimeout(function() {
    // Add fade-out class to loading screen
    loadingScreen.classList.add('fade-out');

    // Show main content (remove hidden class)
    mainContent.classList.remove('hidden');

    // Optionally remove loading screen from DOM after transition ends to clean up
    loadingScreen.addEventListener('transitionend', function() {
      loadingScreen.style.display = 'none';
    }, { once: true });
  }, 400); // slight delay to admire the full bar
}

// Edge case: if load fires extremely early (e.g., cached page), we still want a minimum presence.
// But we already have the incremental progress running, so it will look fine.
// If load happens before 90%, we jump to 100% and fade.

// Optional: If you prefer the progress bar at the top, you can add a class to the container:
// document.querySelector('.progress-container').classList.add('top-bar');