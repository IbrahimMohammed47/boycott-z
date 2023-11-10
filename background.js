// Listen for tab activation (when switching tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url) {
      handleTabVisit(activeInfo.tabId, tab.url);
    }
  });
});

// Listen for tab updates (when the URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tabId && changeInfo.status === "complete") {
    handleTabVisit(tabId, tab.url);
  }
});

async function handleTabVisit(tabId, tabUrl) {
  const urlObject = new URL(tabUrl);
  const domainName = urlObject.hostname.startsWith("www.")
    ? urlObject.hostname.slice(4)
    : urlObject.hostname;

  const eCommerce = getEcommerceTarget(domainName);
  if (eCommerce.isEcommerce) {
    const script = `${eCommerce.target}-blocker`;
    await injectScript("helpers", tabId);
    await injectScript(script, tabId);
    const json = await getBoycottList("brands");
    const res = await chrome.tabs.sendMessage(tabId, {
      brands: json,
    });
    if (res && res.isSafe === false) {
      const json = await getBoycottItem("brands", res.brand);
      console.log(json);
      await showBoycottWarning(tabId, "brand", json);
      return;
    }
  } else {
    const json = await getBoycottItem("websites", domainName);
    let { country, name, type } = json;
    if (country) {
      await showBoycottWarning(tabId, "website", json);
      return;
    }
  }
  // Reaching this line means everything is ok
  return chrome.action.setIcon({
    tabId,
    path: {
      128: `/icons/green-triangle-128.png`,
    },
  });
}

async function showBoycottWarning(tabId, boycottType, boycottObject) {
  let { country, name, type } = boycottObject;
  if (boycottType === "brand") {
    await flash(6, 300, tabId);
  } else if (boycottType === "website") {
    await flash(6, 300, tabId);
  }
}

async function flash(nTimes, period, tabId) {
  return await new Promise((resolve) => {
    let isEven = true;
    const interval = setInterval(() => {
      if (nTimes == 0) {
        chrome.action.setIcon({
          tabId,
          path: {
            128: `/icons/red-triangle-128.png`,
          },
        });
        resolve();
        clearInterval(interval);
      } else {
        chrome.action.setIcon({
          tabId,
          path: {
            128: `/icons/${isEven ? "red" : "green"}-triangle-128.png`,
          },
        });
        isEven = !isEven;
      }
      nTimes--;
    }, period);
  });
}

function getEcommerceTarget(url) {
  const ecommerceSites = ["jumia", "amazon", "ebay"];

  const matchingSite = ecommerceSites.find((site) => url.includes(site));

  if (matchingSite) {
    return { isEcommerce: true, target: matchingSite };
  } else {
    return { isEcommerce: false, target: null };
  }
}

async function injectScript(scriptName, tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: [`/blockers/${scriptName}.js`],
  });
  return;
}

async function getBoycottList(listName) {
  // chrome.storage.local.set({ myCachedData: jsonData }
  const cached = await chrome.storage.local.get([`boycott-list:${listName}`]);
  if (cached[`boycott-list:${listName}`]) {
    console.log("CACHE HIT");
    return cached[`boycott-list:${listName}`];
  }

  const response = await fetch(
    `https://morning-wind-c16a.ibrahimmohammed.workers.dev/get_list?list=${listName}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const jsonData = await response.json();
  const data = jsonData.data ? jsonData.data : jsonData;
  await chrome.storage.local.set({ [`boycott-list:${listName}`]: data });
  return data;
}

async function getBoycottItem(listName, key) {
  const response = await fetch(
    `https://morning-wind-c16a.ibrahimmohammed.workers.dev/get_list?list=${listName}&key=${key}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const jsonData = await response.json();
  return jsonData.data ? jsonData.data : jsonData;
}
