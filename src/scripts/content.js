import "webextension-polyfill";
import { createOverlay } from "./overlay.js";

function log(message) {
  browser.runtime.sendMessage({ action: "log", message: message });
}

function getHowThisWasMadeElement() {
  const howThisWasMadeElement = document.querySelector("how-this-was-made-section-view-model");

  if (!howThisWasMadeElement) {
    return null;
  }

  const sectionTitleElement = howThisWasMadeElement.querySelector(".ytwHowThisWasMadeSectionViewModelSectionTitle span");
  const sectionTitleText = sectionTitleElement?.textContent ?? "";

  const bodyHeaderElement = howThisWasMadeElement.querySelector(".ytwHowThisWasMadeSectionViewModelBodyHeader span");
  const bodyHeaderText = bodyHeaderElement?.textContent ?? "";

  const bodyTextElement = howThisWasMadeElement.querySelector(".ytwHowThisWasMadeSectionViewModelBodyText span");
  const bodyText = bodyTextElement?.textContent ?? "";

  if (!bodyHeaderText.toLowerCase().includes("altered or synthetic")) {
    return null;
  }

  return {
    element: howThisWasMadeElement,
    sectionTitleText: sectionTitleText,
    bodyHeaderText: bodyHeaderText,
    bodyText: bodyText,
  };
}

const detectedElementIds = new Set();

function makeElementUnique(element) {
  if (!element.dataset.uniqueId) {
    element.dataset.uniqueId = crypto.randomUUID();
  }
  return element.dataset.uniqueId;
}

function stopPlayback() {
  document.querySelectorAll("video, audio").forEach((media) => {
    media.pause();
  });
}

let observer = null;

function observeDOM() {
  const targetNode = document.querySelector("ytd-watch-flexy");
  if (!targetNode) {
    return;
  }

  if (observer) {
    observer.disconnect();
    observer = null;
  }

  function checkElement(recheck) {
    const howThisWasMadeElement = getHowThisWasMadeElement();
    if (howThisWasMadeElement) {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      const uniqueId = makeElementUnique(howThisWasMadeElement.element);
      if (!detectedElementIds.has(uniqueId)) {
        detectedElementIds.add(uniqueId);
        stopPlayback();
        createOverlay(howThisWasMadeElement.sectionTitleText, howThisWasMadeElement.bodyHeaderText, howThisWasMadeElement.bodyText);
      } else {
        // False positive!
        if (!recheck) {
          setTimeout(() => checkElement(true), 500);
        }
      }
    }
  }

  observer = new MutationObserver(() => checkElement(false));

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });
}

window.addEventListener("yt-navigate-finish", observeDOM);

observeDOM();
