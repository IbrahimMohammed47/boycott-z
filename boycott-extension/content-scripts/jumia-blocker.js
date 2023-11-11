// Note that safari and firefox both support chrome namespace
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let brandSentence = null;
  document.querySelectorAll(".-phs").forEach((x) => {
    if (!brandSentence && x.innerText.toLowerCase().startsWith("brand:")) {
      brandSentence = x.innerText;
    }
  });
  if (brandSentence) {
    brandSentence = brandSentence
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const startIndex = "brand: ".length;
    const endIndex = brandSentence.indexOf("|");
    const brandName = brandSentence.slice(startIndex, endIndex);

    return sendResponse({ brandName });
  } else {
    return sendResponse({ brandName: null });
  }
});
