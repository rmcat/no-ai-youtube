
const OVERLAY_STYLES = `
  @keyframes noai-slide-in {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  dialog.noai-dialog {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: min(520px, calc(100vw - 48px));
    padding: 28px 28px 22px;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 4px solid #e63946;
    border-radius: 14px;
    color: #f1f1f1;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
    animation: noai-slide-in 0.22s ease-out both;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    cursor: pointer;
    outline: none;
  }

  dialog.noai-dialog::backdrop {
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .noai-top-row {
    display: flex;
    align-items: center;
    gap: 20px;
    pointer-events: none;
  }

  .noai-icon {
    flex-shrink: 0;
    width: 52px;
    height: 52px;
    border-radius: 10px;
  }

  .noai-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .noai-title {
    font-size: 17px;
    font-weight: 700;
    line-height: 1.3;
    color: #ffffff;
  }

  .noai-message {
    font-size: 14px;
    line-height: 1.5;
    color: #b0b0b0;
  }

  .noai-footer {
    font-size: 14px;
    color: #aaa;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
`;

function injectStyles() {
  if (document.getElementById("noai-styles")) return;
  const style = document.createElement("style");
  style.id = "noai-styles";
  style.textContent = OVERLAY_STYLES;
  document.head.appendChild(style);
}

function createOverlay(title, message) {
  injectStyles();

  const dialog = document.createElement("dialog");
  dialog.className = "noai-dialog";

  const topRow = document.createElement("div");
  topRow.className = "noai-top-row";

  const icon = document.createElement("img");
  icon.src = browser.runtime.getURL("icons/icon-128.png");
  icon.className = "noai-icon";
  icon.alt = "";

  const content = document.createElement("div");
  content.className = "noai-content";

  if (title) {
    const titleEl = document.createElement("div");
    titleEl.className = "noai-title";
    titleEl.textContent = title;
    content.appendChild(titleEl);
  }

  if (message) {
    const messageEl = document.createElement("div");
    messageEl.className = "noai-message";
    messageEl.textContent = message;
    content.appendChild(messageEl);
  }

  topRow.appendChild(icon);
  topRow.appendChild(content);

  const footer = document.createElement("div");
  footer.className = "noai-footer";
  footer.textContent = "Click anywhere to dismiss";

  dialog.appendChild(topRow);
  dialog.appendChild(footer);
  document.body.appendChild(dialog);
  dialog.showModal();

  function dismiss() {
    dialog.close();
    dialog.remove();
  }

  dialog.addEventListener("cancel", (e) => e.preventDefault());
  dialog.addEventListener("click", dismiss);
}
