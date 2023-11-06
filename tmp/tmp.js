const cheerio = require("cheerio");
const fs = require("fs");
(async function () {
  const s = fs.readFileSync("./tmp.html");

  const $ = cheerio.load(s.toString());
  const x = $("tr");
  let recs = [];
  x.each((i, y) => {
    const z = normalizeTextToken($(y));
    recs.push([z.at(0), z.at(-2)]);
  });
  recs = recs.filter((x) => x[1].includes("."));
  console.log(JSON.stringify(recs));
})();

function normalizeTextToken(token) {
  return token
    .text()
    .trim()
    .split("\n")
    .map((x) => x.trim().toLowerCase())
    .filter((x) => x.length > 0);
}
