export function sendMessageToTab(tabId, msgObj) {
  return chrome.tabs.sendMessage(tabId, msgObj);
}

export function setIcon(details) {
  return chrome.action.setIcon(details);
}

export function executeScript(injection) {
  return chrome.scripting.executeScript(injection);
}

export function notify(notification) {
  return chrome.notifications.create({
    type: "basic",
    iconUrl: chrome.runtime.getURL("icons/red-triangle-128.png"),
    title: notification.title,
    message: notification.message
  });
}

export function cacheSet(keyValuesObj) {
  return chrome.storage.local.set(keyValuesObj);
}
