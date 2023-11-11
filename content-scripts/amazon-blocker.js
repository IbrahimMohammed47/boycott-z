// Note that safari and firefox both support chrome namespace
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  let brandSentence = document
    .querySelector("#bylineInfo")
    ?.innerText.split(":")
    .slice(-1)[0];

  if (brandSentence) {
    brandSentence = brandSentence
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") //replaces french accents
      .trim();
    const brandRegex = /Visit the ([\w\s'&-]+)\sStore/is;
    const brandRegex2 = /Brand: ([\w\s'&-]+)/is;

    let match1 = brandRegex.exec(brandSentence);
    let match2 = brandRegex2.exec(brandSentence);

    let brandName = brandSentence;
    if (match1) {
      brandName = match1.at(1);
    } else if (match2) {
      brandName = match2.at(1);
    }
    return sendResponse({ brandName });
  } else {
    return sendResponse({ brandName: null });
  }
});
