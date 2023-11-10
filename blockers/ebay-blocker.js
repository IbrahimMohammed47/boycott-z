// document.addEventListener("SendJsonUrl-ebay", function (e) {
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const brands = request.brands;

  // works for amazon.com
  let rows = document.querySelectorAll("#viTabs_0_pd tbody tr");
  rows =
    rows.length > 0
      ? rows
      : document.querySelectorAll(".ux-layout-section-evo__row");

  let brandSentence =
    rows.length > 0
      ? Array.prototype.slice
          .call(rows)
          .find((r) => r.innerText.includes("Brand"))
          .innerText.split(/\s/g)
          .slice(1)
          .join(" ")
      : null;
  console.log("HEEEERE : " + brandSentence);
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
