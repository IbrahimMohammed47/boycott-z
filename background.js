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
  "jumia", "amazon", "ebay", "walmart", "argos", "tesco", "aliexpress", "noon", "bestbuy", "target", "sainsburys"
]

const socialTargets = [
  "twitter",
  "linkedin"
]

function shouldByPassPage(domainName, path) {
  if (['twitter.com', 'x.com'].includes(domainName) && path.length > 1 && path.split("/").length == 2) {
    return false
  }
  if (['linkedin.com'].includes(domainName) && path.length > 1 && path.split("/").length == 4) {
    return false
  }
  return excludedWebsites.indexOf(domainName) >= 0
}
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
  if (shouldByPassPage(domainName, urlObject.pathname)) {
    return showOk(tabId);
  }
  const targetObj = getTarget(domainName)
  // const eCommerce = getEcommerceTarget(domainName);
  if (targetObj.type === 'ecommerce') {
    const script = `${targetObj.target}-blocker`;
    await injectScript(script, tabId);
    const res = await browserAPI.sendMessageToTab(tabId, {});
    if (res && res.brandName) {
      const json = await getBoycottItem("brand", res.brandName);
      if (json) {
        await showBoycottWarning(tabId, json);
        return;
      }
    }
  }
  else if (targetObj.type === 'social') {
    const script = `${targetObj.target}-blocker`;
    await injectScript(script, tabId);
    const res = await browserAPI.sendMessageToTab(tabId, {});
    if (res && res.figureName) {
      const json = await getBoycottItem("figure", res.figureName);
      if (json) {
        await showBoycottWarning(tabId, json);
        return;
      }
    }
    // if (res && res.brandName) {
    //   const json = await getBoycottItem("brand", res.brandName);
    //   if (json) {
    //     await showBoycottWarning(tabId, "brand", json);
    //     return;
    //   }
    // }
  } else {
    const json = await getBoycottItem("website", domainName);
    if (json) {
      await showBoycottWarning(tabId, json);
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

async function showBoycottWarning(tabId, boycottObject) {
  await browserAPI.cacheSet({ boycottZItem: boycottObject })
  var notification = {
    title: "Boycott Warning",
  };
  if (boycottObject.type === "brand") {
    notification.message = `You visited a product from a boycotted brand: ${boycottObject.label}. Click on the boycott-Z extension to learn more.`;
  } else if (boycottObject.type === "website") {
    notification.message = `You visited a boycott brand's website: ${boycottObject.name}. Click on the boycott-Z extension to learn more.`;
  } else if (boycottObject.type === "figure") {
    notification.message = `You visited an anti-palestinian profile: ${boycottObject.name}. Click on the boycott-Z extension to learn more.`;
  }
  browserAPI.notify(notification);
  await flash(6, 300, tabId);
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

  let matcher = ""
  if (itemType === 'website') {
    matcher = `name=like.*${key}`  // to include subdomains
  } else if (itemType === 'brand') {
    matcher = `name=like.*${key
      .trim()
      .replaceAll(" ", "%20")}*`
  } else if (itemType === 'figure') {
    key = key.trim()
    let nameParts = key.split(" ").filter(x => !!x)
    let keyX = key
      .replaceAll(" ", "%20")
    matcher = `name=like.*${keyX}*`

    if (nameParts.length >= 3) {
      matcher = `name.like.*${keyX}*`
      let matcher2 = `name.like.*${nameParts.slice(0, 2).join(" ").replaceAll(" ", "%20")}*`
      let matcher3 = `name.like.*${nameParts.slice(1, 3).join(" ").replaceAll(" ", "%20")}*`
      matcher = `or=(${matcher},${matcher2},${matcher3})`
    }
  }
  const url = `https://lwnimzaynwyplgjazboz.supabase.co/rest/v1/blacklist?limit=5&type=eq.${itemType}&${matcher}`;
  const response = await fetch(url, {
    headers: {
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3bmltemF5bnd5cGxnamF6Ym96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk3MDE0ODQsImV4cCI6MjAxNTI3NzQ4NH0.Cgv3FHAXjMU5aon3dgREuAdkVQ0l9LKRdtR6zrqaIFg",
    },
  });
  if (!response.ok) {
    let b = await response.json()
    console.log(b)
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

function getTarget(url) {
  let matchingSite = ecommerceTargets.find((site) => url.includes(site));
  if (matchingSite) return { type: "ecommerce", target: matchingSite }

  matchingSite = socialTargets.find((site) => url.includes(site));
  if (matchingSite) return { type: "social", target: matchingSite }

  return { type: null, target: null }
}