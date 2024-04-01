export function sendMessageToTab(tabId, msgObj) {
  return browser.tabs.sendMessage(tabId, msgObj);
}

export function setIcon(details) {
  return browser.browserAction.setIcon(details);
}

export function executeScript(injection) {
  return browser.scripting.executeScript(injection);
}

export function cacheSet(keyValuesObj) {
  return browser.storage.local.set(keyValuesObj);
}
