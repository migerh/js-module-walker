#!/bin/sh

npm install codeclimate-test-reporter
./node_modules/.bin/codeclimate-test-reporter < ./coverage/lcov.info