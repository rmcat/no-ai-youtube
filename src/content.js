const DEFAULT_COUNTDOWN = 5;

function detectAIContent() {
  return !!document.querySelector("ytd-app ytd-page-manager ytd-watch-metadata how-this-was-made-section-view-model");
}

function stopPlayback() {
  document.querySelectorAll("video, audio").forEach((media) => {
    media.pause();
  });
}

function createElementWithStyles(tag, styles, textContent = "") {
  const element = document.createElement(tag);
  Object.assign(element.style, styles);
  if (textContent) {
    element.textContent = textContent;
  }
  return element;
}

function createOverlay(actionMessage, countdown) {
  let timeLeft = countdown;
  const getCountdownText = (seconds) => `${actionMessage} in ${seconds} seconds... Click to stay and smash dislike!`;

  // Create and style overlay
  const overlay = createElementWithStyles("div", {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(39, 0, 0, 0.9)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "9999",
    fontSize: "48px",
  });

  // Create and append the countdown text
  const countdownText = createElementWithStyles("div", {}, getCountdownText(timeLeft));
  overlay.appendChild(countdownText);

  // Handle overlay click to cancel
  overlay.addEventListener("click", () => {
    overlay.remove();
    clearInterval(timer);
  });

  document.body.appendChild(overlay);

  // Start countdown timer
  const timer = setInterval(() => {
    timeLeft--;
    countdownText.textContent = getCountdownText(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timer);
      browser.runtime.sendMessage({
        action: "performAction",
      });
    }
  }, 1000);
}

function observeDOM() {
  const observer = new MutationObserver(() => {
    if (detectAIContent()) {
      observer.disconnect();
      stopPlayback();
      browser.runtime.sendMessage({ action: "getAction" }).then((response) => {
        if (response && response.actionMessage) {
          createOverlay(response.actionMessage, DEFAULT_COUNTDOWN);
        }
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

observeDOM();
