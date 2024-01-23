let browserAPI = undefined;
/**
 * excludedWebsites is a list of famous websites that people usually visit 
 * and we don't want to run our extension on. 
 * this is to save unnecessary code run and db queries 
 */
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

const ecommerceTargets = [
  "jumia", "amazon", "ebay", "walmart", "argos", "tesco", "aliexpress"
]

export async function handleTabVisit(actions, tabId, tabUrl) {
  browserAPI = actions;
  const urlObject = new URL(tabUrl);

  // ignore urls for local files, firefox about:config and so on..
  if (!urlObject.hostname || urlObject.hostname === 'newtab') {
    return showOk(tabId);
  }
  const domainName = urlObject.hostname.startsWith("www.")
    ? urlObject.hostname.slice(4)
    : urlObject.hostname;
  if (excludedWebsites.indexOf(domainName) >= 0) {
    return showOk(tabId);
  }
  const eCommerce = getEcommerceTarget(domainName);
  if (eCommerce.isEcommerce) {
    const script = `${eCommerce.target}-blocker`;
    await injectScript(script, tabId);
    const res = await browserAPI.sendMessageToTab(tabId, {});
    if (res && res.brandName) {
      const json = await getBoycottItem("brand", res.brandName);
      if (json) {
        await showBoycottWarning(tabId, "brand", json);
        return;
      }
    }
  } else {
    const json = await getBoycottItem("website", domainName);
    if (json) {
      await showBoycottWarning(tabId, "website", json);
      return
    }
  }

  return showOk(tabId);
}

async function showOk(tabId) {
  await browserAPI.cacheSet({ boycottZItem: null })
  browserAPI.setIcon({
    tabId,
    path: {
      128: `/icons/green-triangle-128.png`,
    },
  });
}

async function showBoycottWarning(tabId, boycottType, boycottObject) {
  await browserAPI.cacheSet({ boycottZItem: boycottObject })
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

async function getBoycottItem(itemType, key) {
  const url = `https://lwnimzaynwyplgjazboz.supabase.co/rest/v1/blacklist?type=eq.${itemType}&name=like.*${key
    .trim()
    .replaceAll(" ", "%20")}*`;

  const response = await fetch(url, {
    headers: {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bmltemF5bnd5cGxnamF6Ym96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3MDE0ODQsImV4cCI6MjAxNTI3NzQ4NH0.Cgv3FHAXjMU5aon3dgREuAdkVQ0l9LKRdtR6zrqaIFg",
    },
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const jsonData = await response.json();

  if (Array.isArray(jsonData) && jsonData.length > 0) {
    return jsonData[0];
  }
  return null;
}

function getEcommerceTarget(url) {
  const matchingSite = ecommerceTargets.find((site) => url.includes(site));
  if (matchingSite) {
    return { isEcommerce: true, target: matchingSite };
  } else {
    return { isEcommerce: false, target: null };
  }
}
