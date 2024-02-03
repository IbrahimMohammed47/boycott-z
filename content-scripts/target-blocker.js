
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const productUrl = window.location.pathname;
    // the product id is the last part of the url whihc usually looks like
    // http://...../_/A-123456789
    // find the last / and add 3 (/A-) to get the start of the product id
    const productIdStart = productUrl.lastIndexOf('/') + 3;
    const productId = productUrl.substring(productIdStart);
    if(isNaN(productId)) {
        sendResponse({ brandName: null });
        return true
    }
    
    const apiUrl = `https://redsky.target.com/redsky_aggregations/v1/web/pdp_client_v1?key=9f36aeafbe60771e321a7cc95a78140772ab3e96&tcin=${productId}&is_bot=true&store_id=1771&pricing_store_id=1771`
    fetch(apiUrl).then(res => {
        res.json().then(json => {
            const brand = json?.data?.product?.item?.primary_brand?.name;
            const brandName= brand
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim();
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

