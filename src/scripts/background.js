browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received: ", request);
  if (!sender.tab || !sender.tab.id) {
    console.warn("No valid tab information available.");
  }

  const tabId = sender.tab.id;

  if (request.action === "getAction") {
    determineAction(tabId)
      .then((actionMessage) => {
        sendResponse({ actionMessage });
      })
      .catch((error) => {
        console.error("Error determining action:", error);
        sendResponse({ actionMessage: "Error determining action" });
      });
    return true;
  }

  if (request.action === "performAction") {
    performAction(tabId).catch((error) => {
      console.error("Error performing action:", error);
    });
  }
});

function determineAction(tabId) {
  return browser.tabs.get(tabId).then((tab) => {
    return browser.tabs.query({}).then((tabs) => {
      if (tab.canGoBack) {
        return "Navigating to the previous page";
      } else if (tabs.length > 1) {
        return "Closing this tab";
      } else {
        return "Redirecting to YouTube homepage";
      }
    });
  });
}

function performAction(tabId) {
  return browser.tabs.get(tabId).then((tab) => {
    return browser.tabs.query({}).then((tabs) => {
      if (tab.canGoBack) {
        return browser.tabs.goBack(tabId);
      } else if (tabs.length > 1) {
        return browser.tabs.remove(tabId);
      } else {
        return browser.tabs.update(tabId, { url: "https://www.youtube.com/" });
      }
    });
  });
}
