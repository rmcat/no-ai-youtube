import "webextension-polyfill";

const isChromiumBased = isChromiumBasedUserAgent();
console.debug("Background script loaded. Chromium-based:", isChromiumBased);

browser.runtime.onMessage.addListener((request, sender, _sendResponse) => {
  if (request.action === "log") {
    console.log("Content Script Log:", request.message, {
      tabId: sender.tab?.id,
      tabUrl: sender.tab?.url,
    });
  }
});

function isChromiumBasedUserAgent() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("chrome") || userAgent.includes("chromium") || userAgent.includes("edg") || userAgent.includes("brave") || userAgent.includes("opr");
}
