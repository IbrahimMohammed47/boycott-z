function getProductJson(scriptJsons) {
    for (const scriptJson of scriptJsons) {
        if (!Array.isArray(scriptJson) && scriptJson["@type"] === "Product") {
            return scriptJson
        }
        return null
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    pollExpression()
        .then(scriptJsonsElements => {
            const scriptJsons = []
            scriptJsonsElements.forEach((e) => {
                scriptJsons.push(JSON.parse(e.innerText))
            });
            const json = getProductJson(scriptJsons);
            const rawBrandName = json?.brand?.name

            if (rawBrandName) {
                let brandName = rawBrandName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim();
                sendResponse({ brandName });
            } else {
                sendResponse({ brandName: null });
            }
        })
        .catch(e => {
            console.log("ERR:" + e)
            sendResponse({ brandName: null });
        })
    return true // DON'T EVER REMOVE THIS LINE
});

// this makes the script wait until page is loaded and script tags are found
function pollExpression() {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elements = document.querySelectorAll('script[type="application/ld+json"]');
            if (elements.length > 0) {
                clearInterval(interval);
                resolve(Array.from(elements));
            }

            if (Date.now() - startTime >= 10000) {
                clearInterval(interval);
                reject(new Error('Timeout: Expression not found within 10 seconds.'));
            }
        }, 50);
    });
}