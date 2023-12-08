// popup.js

chrome.storage.local.get(["boycottZItem"]).then((result) => {
  const { country, label, type, proof } = result.boycottZItem
  let msg = ``
  let proofText = proof? `
  <a class="button btn_btm" id="boycottZProof" href=${proof}>Why boycott it? 
  </a>`: ''
  // let proofText = proof?`<a class="button is-link" href=${proof}>Why Boycott?</a>`: ''
  let category = type === 'brand'? 'brand': 'company'
  msg = 
  `${label} is a ${category} from ${country}.
  ${proofText}`

  if(country === 'Israel'){
    msg += `
    <br/><br/><br/>
    Israel is an apartaheid state that has been commiting atrocities against Palestinian people
    since Zionist gangs craweled into Palestine in 1948.  
    `
  }
  else if(country === 'France'){
    msg += `
    <br/><br/><br/>
    French government is notorious for discrimination against Muslims inside and outside of France.
    Either by issuing anti-islam policies in France, or by airstriking Muslim nations in Africa
    `
    }
  document.getElementById("boycottZ").innerHTML = msg
  if(proof){
    document.getElementById("boycottZProof").addEventListener('click',(event)=>{
      let ur = event.target.getAttribute('href')
      chrome.tabs.create({url: ur});
    })
    // $('body').on('click', 'a', function(){
    //   return false;
    // });
  }

});

// You can update the badge text as needed.
