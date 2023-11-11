// Note that safari and firefox both support chrome namespace
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // works for amazon.com
  let rows = document.querySelectorAll("#viTabs_0_pd tbody tr");
  rows =
    rows.length > 0
      ? rows
      : document.querySelectorAll(".ux-layout-section-evo__row");
  let brandName = null;
  rows.forEach((x) => {
    if (!brandName) {
      const tokens = x.innerText.split("\n");
      const brandIndex = tokens.indexOf("Brand");
      if (brandIndex > -1) {
        brandName = tokens[brandIndex + 1];
      }
    }
  });

  if (brandName) {
    brandName = brandName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    return sendResponse({ brandName });
  } else {
    return sendResponse({ brandName: null });
  }
});
