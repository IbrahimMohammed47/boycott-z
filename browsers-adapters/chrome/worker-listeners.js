import { handleTabVisit } from "../../background.js";
import * as actions from "./worker-actions.js";

// Listen for tab updates (when the URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId && changeInfo.status === "complete") {
    handleTabVisit(actions, tabId, tab.url);
  }
});
