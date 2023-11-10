chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const brands = request.brands;
  let brandSentence = document
    .querySelector("#bylineInfo")
    ?.innerText.split(":")
    .slice(-1)[0];

  if (brandSentence) {
    brandSentence = brandSentence
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    foundAtIndex = brands.findIndex((b) => brandSentence.includes(b));
    if (foundAtIndex > -1) {
      console.log("FOUND: " + brands[foundAtIndex]);
      return sendResponse({ isSafe: false, brand: brands[foundAtIndex] });
    } else {
      console.log("SAFE");
      return sendResponse({ isSafe: true });
    }
  } else {
    console.log("NO BRAND");
    return sendResponse({ isSafe: true });
  }
});

// frenchBrands = frenchBrands.map((s) =>
//   s
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .trim()
// );
