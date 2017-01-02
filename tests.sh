#!/bin/sh

# unit tests

./node_modules/.bin/ava

# end2end tests

npm run build
npm link
cucumber
