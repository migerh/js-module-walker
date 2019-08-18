#!/bin/sh

# unit tests

npx nyc ava
UNIT=$?

# end2end tests

npm link
cucumber
END2END=$?

exit $(($UNIT + $END2END))
