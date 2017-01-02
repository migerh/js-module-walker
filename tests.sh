#!/bin/sh

declare -i RESULT=0

# unit tests

./node_modules/.bin/ava
RESULT+=$?

# end2end tests

npm run build
npm link
cucumber
RESULT+=$?

exit $RESULT