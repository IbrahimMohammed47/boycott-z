import { handleTabVisit } from "../../boycott-worker.js";
import * as actions from "./worker-actions.js";

// Listen when user switches to a tab (activates it)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      handleTabVisit(actions, activeInfo.tabId, tab.url);
    }
  });
});

// Listen for tab updates (when the URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId && changeInfo.status === "complete") {
    handleTabVisit(actions, tabId, tab.url);
  }
});
