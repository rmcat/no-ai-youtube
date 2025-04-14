function createElementWithStyles(tag, styles, text) {
  const element = document.createElement(tag);
  Object.assign(element.style, styles);
  if (text) {
    element.textContent = text;
  }
  return element;
}

export function createOverlay(sectionTitleText, bodyHeaderText, bodyText) {
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
    position: "relative",
  });

  const closeButton = createElementWithStyles(
    "button",
    {
      position: "absolute",
      top: "10px",
      right: "10px",
      fontSize: "24px",
      fontWeight: "bold",
      backgroundColor: "transparent",
      color: "white",
      border: "none",
      cursor: "pointer",
      zIndex: "10001",
    },
    "X"
  );

  closeButton.addEventListener("click", () => {
    overlay.remove();
    document.removeEventListener("keydown", keyHandler);
  });

  dialogContainer.appendChild(closeButton);

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

  if (bodyText) {
    const textElement = createElementWithStyles("div", { marginTop: "10px", fontSize: "large" }, bodyText);
    contentContainer.appendChild(textElement);
  }

  topRow.appendChild(imageContainer);
  topRow.appendChild(contentContainer);

  const footerContainer = createElementWithStyles(
    "div",
    {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "20px",
      fontWeight: "bold",
      fontSize: "medium",
    },
    "Press Esc to continue... Don't forget to smash dislike!"
  );

  dialogContainer.appendChild(topRow);
  dialogContainer.appendChild(footerContainer);

  overlay.appendChild(dialogContainer);

  document.body.appendChild(overlay);

  function keyHandler(event) {
    if (event.key == "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", keyHandler);
    }
  }

  document.addEventListener("keydown", keyHandler);
}
