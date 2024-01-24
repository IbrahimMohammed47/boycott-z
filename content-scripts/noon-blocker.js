
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const curUrl = window.location.toString()
    const prodIdentifer = curUrl.split('/').slice(4).join('/')
    const apiUrl = `https://www.noon.com/_svc/catalog/api/v3/u/${prodIdentifer}`
    fetch(apiUrl).then(res => {
        res.json().then(json => {
            const english = /^[A-Za-z0-9'\s]*$/;

            const { brand_code, brand } = json?.product
            const rawBrand = brand
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
            const brandName = english.test(rawBrand) ? rawBrand : brand_code
            sendResponse({ brandName });
        }).catch(e => {
            console.log(e)
            sendResponse({ brandName: null });
        })
    }).catch(e => {
        console.log(e)
        sendResponse({ brandName: null });
    })
    return true // DON'T EVER REMOVE THIS LINE
});

