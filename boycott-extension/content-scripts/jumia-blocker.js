// Note that safari and firefox both support chrome namespace
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const brands = request.brands;

  let brandSentence = null;
  document.querySelectorAll(".-phs").forEach((x) => {
    if (x.innerText.toLowerCase().startsWith("brand:")) {
      brandSentence = x.innerText;
    }
  });
  if (brandSentence) {
    brandSentence = brandSentence
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    foundAtIndex = brands.findIndex((b) => brandSentence.includes(b));
    if (foundAtIndex > -1) {
      return sendResponse({ isSafe: false, brand: brands[foundAtIndex] });
    } else {
      return sendResponse({ isSafe: true });
    }
  } else {
    return sendResponse({ isSafe: true });
  }
});
