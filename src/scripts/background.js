import "webextension-polyfill";

const isChromiumBased = isChromiumBasedUserAgent();
console.debug("Background script loaded. Chromium-based:", isChromiumBased);

browser.runtime.onMessage.addListener((request, _sender, _sendResponse) => {
  console.debug("Received message:", request);
});

function isChromiumBasedUserAgent() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("chrome") || userAgent.includes("chromium") || userAgent.includes("edg") || userAgent.includes("brave") || userAgent.includes("opr");
}
