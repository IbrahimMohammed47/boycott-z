
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    pollExpression()
        .then(scriptJsonsElements => {
            const scriptJsons = []
            scriptJsonsElements.forEach((e) => {
                let item = JSON.parse(e.innerText)
                if (Array.isArray(item)) {
                    scriptJsons.push(...item)
                } else {
                    scriptJsons.push(item)
                }
            });

            const json = scriptJsons.find(s => s['@type'] === 'Product')
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
            const elements = document.querySelectorAll('head > script[type="application/ld+json"]');
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