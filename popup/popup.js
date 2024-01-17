// popup.js

chrome.storage.local.get(["boycottZItem"]).then((result) => {
  const boycottZItem = result.boycottZItem
  if (!boycottZItem) {
    window.close()
  }
  const { country, label, type, proof, reason } = boycottZItem
  let msg = ``
  // let proofText = proof?`<a class="button is-link" href=${proof}>Why Boycott?</a>`: ''
  let category = type === 'brand' ? 'brand' : 'company'
  const countryText = ["France", "Israel"].includes(country) ? ` from <b>${country}</b>` : ''
  msg =
    `<b>${label}</b>, a ${category}${countryText}.`
  if (reason && typeof reason == 'string' && reason.length > 0) {
    msg += `
    <br/><br/><p>
    ${reason}</p>
    `
  }
  if (country === 'Israel' && !reason) {
    msg += `
    <br/><br/><p>
    Israel's relentless atrocities against Palestinians since 1948 intensified in late 2023, as they mercilessly bombarded Gaza, 
    claiming countless innocent lives. This reprehensible act was allegedly in response to Hamas' attacks on Israeli forces and settlements on October 7th, 2023.</p>`

  }
  else if (country === 'France' && !reason) {
    msg += `
    <br/><br/><p>
    The French government has gained notoriety for its discriminatory practices against Muslims both inside and outside of France. 
    This is evident through the implementation of policies that target Muslims within the country, as well as through military actions, 
    such as airstrikes carried out against Muslim nations in Africa. This is besides its continuous support to Zionism.</p>`
  }

  if (proof && typeof proof == 'string' && proof.length > 0) {
    msg += `
    <br/><br/>
    <a class="button btn_btm" id="boycottZProof" href=${proof}>Proof
    </a>`
  }

  document.getElementById("boycottZ").innerHTML = msg
  if (proof) {
    document.getElementById("boycottZProof").addEventListener('click', (event) => {
      let ur = event.target.getAttribute('href')
      chrome.tabs.create({ url: ur });
    })
    // $('body').on('click', 'a', function(){
    //   return false;
    // });
  }

});

// You can update the badge text as needed.
