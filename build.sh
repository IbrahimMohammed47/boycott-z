#!/bin/bash

set -e

function prepare_extension() {
  BROWSER=$1
  mkdir -p dist/$BROWSER

  rsync -av ./* dist/$BROWSER/ \
    --exclude .git \
    --exclude .idea \
    --exclude dist \
    --exclude build.sh \
    --exclude '*.json'

  cp manifest.$BROWSER.json dist/$BROWSER/manifest.json
  web-ext build -s dist/$BROWSER -a dist/package/$BROWSER/
}

prepare_extension firefox
prepare_extension chrome