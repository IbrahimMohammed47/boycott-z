// popup.js
chrome.action.getBadgeText({}, (result) => {
  document.getElementById("badgeText").innerText = result;
});

// You can update the badge text as needed.
