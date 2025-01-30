#!/bin/bash

npm run clone-images
npm run copy-images

cp src/assets/custom.webp src/assets/icons/
cp src/assets/evil.webp src/assets/icons/
cp src/assets/good.webp src/assets/icons/

vue-cli-service build ./src/main.js

cp -r dist/* repo/
cd repo || exit
git add *
git commit -m "Update"
git push
cd .. || exit