# boycott-z

An extension that helps Human beings boycott products and services affiliated with terrorists.

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
- [x] Migrate to Supabase to leverage SQL and improve performance
- [x] Enriching the database or integrating it with other sources
- [x] Enhancing the UI that currently warns the user, (adding a popup with ~~cool~~ CSS)
- [x] Including fields `reason` And `proof`
- [x] Deploying and Publishing on Chrome webstore
- [ ] Supporting blacklisted brand detection in other famous e-commerce websites
- [ ] Support other browsers

## Installation guide

1. Install it from https://chromewebstore.google.com/detail/boycott-z/fiolfcekimelemlneoogmpjgdjhkdhdd?pli=1
2. Pin it to toolbar
