import "webextension-polyfill";

function getHowThisWasMadeElement() {
  return document.querySelector("how-this-was-made-section-view-model");
}

function stopPlayback() {
  document.querySelectorAll("video, audio").forEach((media) => {
    media.pause();
  });
}

function createOverlay() {
  const howThisWasMadeElement = document.querySelector("how-this-was-made-section-view-model");

  let sectionTitleText = "";
  let bodyHeaderText = "";
  let bodyTextContent = "";

  if (howThisWasMadeElement) {
    const sectionTitleElement = howThisWasMadeElement.querySelector(".ytwHowThisWasMadeSectionViewModelSectionTitle span");
    if (sectionTitleElement) {
      sectionTitleText = sectionTitleElement.textContent;
    }

    const bodyHeaderElement = howThisWasMadeElement.querySelector(".ytwHowThisWasMadeSectionViewModelBodyHeader span");
    if (bodyHeaderElement) {
      bodyHeaderText = bodyHeaderElement.textContent;
    }

    const bodyTextElement = howThisWasMadeElement.querySelector(".ytwHowThisWasMadeSectionViewModelBodyText span");
    if (bodyTextElement) {
      bodyTextContent = bodyTextElement.textContent;
    }
  }

  if (!sectionTitleText && !bodyHeaderText && !bodyTextContent) {
    bodyHeaderText = "Altered or synthetic content detected.";
  }

  const overlay = createElementWithStyles("div", {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(39, 0, 0, 0.9)",
    color: "white",
    display: "flex",
    zIndex: "9999",
    overflow: "auto",
  });

  const dialogContainer = createElementWithStyles("div", {
    display: "flex",
    flexDirection: "column",
    width: "80%",
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "black",
    borderRadius: "10px",
  });

  const topRow = createElementWithStyles("div", {
    display: "flex",
    flexDirection: "row",
  });

  const imageContainer = createElementWithStyles("div", {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  });

  const image = document.createElement("img");
  image.src = browser.runtime.getURL("images/logo.png");

  imageContainer.appendChild(image);
  dialogContainer.appendChild(imageContainer);

  const contentContainer = createElementWithStyles("div", {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "20px",
  });

  if (sectionTitleText) {
    const titleElement = createElementWithStyles("div", { fontWeight: "bold", fontSize: "x-large" }, sectionTitleText);
    contentContainer.appendChild(titleElement);
  }

  if (bodyHeaderText) {
    const headerElement = createElementWithStyles("div", { marginTop: "10px", fontSize: "large" }, bodyHeaderText);
    contentContainer.appendChild(headerElement);
  }

  if (bodyTextContent) {
    const textElement = createElementWithStyles("div", { marginTop: "10px", fontSize: "large" }, bodyTextContent);
    contentContainer.appendChild(textElement);
  }

  topRow.appendChild(imageContainer);
  topRow.appendChild(contentContainer);

  const continueContainer = createElementWithStyles(
    "div",
    {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "20px",
      fontWeight: "bold",
      fontSize: "medium",
    },
    "Click to continue... If you don't like, smash dislike!"
  );

  dialogContainer.appendChild(topRow);
  dialogContainer.appendChild(continueContainer);

  overlay.appendChild(dialogContainer);

  overlay.addEventListener("click", () => {
    overlay.remove();
  });

  document.body.appendChild(overlay);
}

function createElementWithStyles(tag, styles, text) {
  const element = document.createElement(tag);
  Object.assign(element.style, styles);
  if (text) {
    element.textContent = text;
  }
  return element;
}

let observer = null;

function observeDOM() {
  const targetNode = document.querySelector("ytd-watch-flexy");
  if (!targetNode) {
    console.debug("Could not find ytd-watch-flexy");
    return;
  }

  console.debug("Found ytd-watch-flexy element");

  if (observer) {
    observer.disconnect();
  }

  observer = new MutationObserver(() => {
    const element = getHowThisWasMadeElement();
    if (element) {
      observer.disconnect();
      stopPlayback();
      createOverlay(element);
    }
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true,
  });
}

observeDOM();

window.addEventListener("yt-navigate-finish", observeDOM);
