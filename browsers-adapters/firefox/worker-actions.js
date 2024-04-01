export function sendMessageToTab(tabId, msgObj) {
  return browser.tabs.sendMessage(tabId, msgObj);
}

export function setIcon(details) {
  return browser.browserAction.setIcon(details);
}

export function executeScript(injection) {
  return browser.scripting.executeScript(injection);
}

export function notify(notification) {
  return browser.notifications.create({
    type: "basic",
    iconUrl: browser.extension.getURL("icons/red-triangle-128.png"),
    title: notification.title,
    message: notification.message
  });
}

export function cacheSet(keyValuesObj) {
  return browser.storage.local.set(keyValuesObj);
}
