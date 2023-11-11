export function sendMessageToTab(tabId, msgObj) {
  return chrome.tabs.sendMessage(tabId, msgObj);
}

export function setIcon(details) {
  return chrome.action.setIcon(details);
}

export function executeScript(injection) {
  return chrome.scripting.executeScript(injection);
}

// export function cacheGet(keyList) {
//   return chrome.storage.local.get(keyList);
// }

// export function cacheSet(keyValuesObj) {
//   return chrome.storage.local.set(keyValuesObj);
// }
