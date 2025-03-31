import "webextension-polyfill";

const isChromiumBased = isChromiumBasedUserAgent();
console.debug("Background script loaded. Chromium-based:", isChromiumBased);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "log") {
    console.log("Content Script Log:", request.message, {
      tabId: sender.tab?.id,
      tabUrl: sender.tab?.url,
    });
  }

  console.debug("Received message:", request);

  if (!sender.tab || sender.tab.id === undefined) {
    console.warn("Received message without valid sender tab information.");
    return;
  }

  const tabId = sender.tab.id;

  if (request.action === "redirectTab") {
    console.debug(`Attempting to navigate to the previous page in tab ID: ${tabId}`);
    const originalUrl = request.currentUrl;

    browser.tabs
      .goBack(tabId)
      .then(() => {
        console.debug(`browser.tabs.goBack(${tabId}) call succeeded.`);
        if (!isChromiumBased) {
          const delayMs = 500;
          console.debug(`Waiting ${delayMs}ms to check URL after goBack in Firefox.`);
          sleep(delayMs).then(() => {
            browser.tabs
              .get(tabId)
              .then((updatedTab) => {
                console.debug(`Current URL of tab ${tabId} after goBack attempt: ${updatedTab.url}`);
                if (updatedTab.url === originalUrl) {
                  console.log(`URL of tab ${tabId} did not change after goBack. Redirecting to fallback.`);
                  redirectFallback(tabId);
                } else {
                  console.debug(`Successfully navigated back in tab ${tabId}.`);
                }
              })
              .catch((error) => {
                console.error(`Error getting updated tab information for tab ${tabId}:`, error);
                redirectFallback(tabId);
              });
          });
        }
      })
      .catch((error) => {
        console.log(`Error during browser.tabs.goBack(${tabId}):`, error);
        redirectFallback(tabId);
      });
  }
});

function isChromiumBasedUserAgent() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes("chrome") || userAgent.includes("chromium") || userAgent.includes("edg") || userAgent.includes("brave") || userAgent.includes("opr");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function redirectFallback(tabId) {
  const fallbackUrl = "https://www.youtube.com/";
  console.log(`Redirecting tab ${tabId} to fallback URL: ${fallbackUrl}`);
  browser.tabs.update(tabId, { url: fallbackUrl });
}
