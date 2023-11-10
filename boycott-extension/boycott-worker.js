let browserAPI = undefined;
const excludedWebsites = [
  "google.com",
  "youtube.com",
  "facebook.com",
  "baidu.com",
  "wikipedia.org",
  "reddit.com",
  "yahoo.com",
  "twitter.com",
  "x.com",
  "instagram.com",
  "linkedin.com",
  "microsoft.com",
  "pinterest.com",
  "apple.com",
  // Add more websites as needed
];

export async function handleTabVisit(actions, tabId, tabUrl) {
  browserAPI = actions;
  const urlObject = new URL(tabUrl);
  const domainName = urlObject.hostname.startsWith("www.")
    ? urlObject.hostname.slice(4)
    : urlObject.hostname;
  if (excludedWebsites.indexOf(domainName) >= 0) {
    return;
  }
  const eCommerce = getEcommerceTarget(domainName);
  if (eCommerce.isEcommerce) {
    const script = `${eCommerce.target}-blocker`;
    await injectScript(script, tabId);
    const json = await getBoycottList("brands");
    const res = await browserAPI.sendMessageToTab(tabId, {
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
  return browserAPI.setIcon({
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
    const interval = setInterval(async () => {
      if (nTimes == 0) {
        await browserAPI.setIcon({
          tabId,
          path: {
            128: `/icons/red-triangle-128.png`,
          },
        });
        clearInterval(interval);
        resolve();
      } else {
        await browserAPI.setIcon({
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

async function injectScript(scriptName, tabId) {
  await browserAPI.executeScript({
    target: { tabId },
    files: [`/content-scripts/${scriptName}.js`],
  });
  return;
}

async function getBoycottList(listName) {
  // chrome.storage.local.set({ myCachedData: jsonData }
  const cached = await browserAPI.cacheGet([`boycott-list:${listName}`]);
  if (cached[`boycott-list:${listName}`]) {
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
  await browserAPI.cacheSet({ [`boycott-list:${listName}`]: data });
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

function getEcommerceTarget(url) {
  const ecommerceSites = ["jumia", "amazon", "ebay"];

  const matchingSite = ecommerceSites.find((site) => url.includes(site));

  if (matchingSite) {
    return { isEcommerce: true, target: matchingSite };
  } else {
    return { isEcommerce: false, target: null };
  }
}
