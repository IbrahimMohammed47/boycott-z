
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    const curUrl = window.location.toString()
    const productUrl = window.location.pathname.replace("/gol-ui/product", "gb/groceries");
    const apiUrl = `https://www.sainsburys.co.uk/groceries-api/gol-services/product/v1/product?filter[product_seo_url]=${productUrl}&include[ASSOCIATIONS]=false`

    fetch(apiUrl).then(res => {
        console.log(res);
        res.json().then(json => {
            const brandNames = json.products[0].attributes.brand;
            const brandNameRaw = brandNames[brandNames.length -1];
            const brandName = brandNameRaw.toLowerCase();
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

