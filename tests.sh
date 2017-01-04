#!/bin/sh

# unit tests

./node_modules/.bin/nyc ./node_modules/.bin/ava
UNIT=$?

# end2end tests

npm run build
npm link
cucumber
END2END=$?

exit $(($UNIT + $END2END))
