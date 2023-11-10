# boycott-z

An extension that helps Human beings boycott products and services of terrorists.

## What is this?

This extension functions as a tool to expose the affiliations of top brands and websites with unjust regimes, regimes that showed extensive brutality towards innocent people such as the Zionist regimes's impact on Palestinian people or the actions of French government affecting innocent Muslim civilians in Africa. These instances are merely the surface, indicative of a more extensive list of regimes engaging in violence and discrimination against Arab and Muslim nations around the world.

## What does it do exactly?

It does 2 things:

- Warn you when you open a blacklisted product page on E-commerce websites like Amazon
- Warn you when you you visit blacklisted websites

![ezgif-2-9918a95766](https://github.com/IbrahimMohammed47/boycott-z/assets/25140638/7a34a22b-e200-4521-afe5-8bce1d78cd9f)

## Checklist

- [x] Added cloudflare worker & KV store that serves the database of blacklisted entities
- [x] Added extension code that triggers when a person visits blacklisted URL, and then warns user
- [x] Added extension code that triggers when a person visits blacklisted product, and then warns user
- [x] Supporting blacklisted brand detection in Amazon, Ebay, and Jumia
- [ ] Deploying and Publishing on Chrome webstore
- [ ] Enriching the database or integrating it with other sources
- [ ] Enhancing the UI that currently warns the user, (adding a popup with cool CSS)
- [ ] Supporting blacklisted brand detection in other famous e-commerce websites
- [ ] Enhance Speed of blacklisted product detection
- [ ] Support other browsers

## Installation guide (until published on chrome store)

1. Clone the repo or install as zip file
2. Go to chrome://extensions
3. Switch on "Developer Mode"
4. Click on "Load Unpacked"
5. Select the folder called browser-extension inside the root folder of this repo
6. Finally, pin the extension so you can see it working
