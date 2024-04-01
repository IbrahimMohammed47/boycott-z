import { handleTabVisit } from "../../background.js";
import * as actions from "./worker-actions.js";

// Listen when user switches to a tab (activates it)
browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      handleTabVisit(actions, activeInfo.tabId, tab.url);
    }
  });
});

// Listen for tab updates (when the URL changes)
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId && changeInfo.status === "complete") {
    handleTabVisit(actions, tabId, tab.url);
  }
});
