chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    pollExpression()
        .then(element => {
            const rawFigureName = element?.innerText
            if (rawFigureName) {
                let figureName = rawFigureName
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .trim()
                    .split("\n")
                    .at(0);
                sendResponse({ figureName });
            } else {
                sendResponse({ figureName: null });
            }
        })
        .catch(e => {
            console.log("ERR:" + e)
            sendResponse({ figureName: null });
        })
    return true // DON'T EVER REMOVE THIS LINE
});

// this makes the script wait until page is loaded and script tags are found
function pollExpression() {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector("div[data-testid=UserName]")
            if (element) {
                clearInterval(interval);
                resolve(element);
            }

            if (Date.now() - startTime >= 10000) {
                clearInterval(interval);
                reject(new Error('Timeout: Expression not found within 10 seconds.'));
            }
        }, 50);
    });
}